import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Button from '../../components/Button';
import appConfig from 'app-config';
import store from 'app-store';
import BaseAPI from '../../network/API/BaseAPI';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  iconBackWrapper: {
    // left: 10,
    position: 'absolute',
    zIndex: 9999
  },
  iconBackContainer: {
    padding: 15
  },
  iconBack: {
    fontSize: 30,
    color: '#555'
  },
  mainContent: {
    flex: 1,
    padding: 15
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#444',
    fontSize: 30,
    marginTop: '7%',
    letterSpacing: 8,
    left: 4,
    textTransform: 'uppercase'
  },
  subHeading: {
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: '7%',
    textTransform: 'lowercase'
  },
  textInput: {
    paddingVertical: appConfig.device.isIOS ? 15 : 7,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
    borderColor: appConfig.colors.primary,
    backgroundColor: '#fafafa',
    flex: 1
  },
  closeIconContainer: {
    position: 'absolute',
    right: 0,
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 15,
    backgroundColor: '#ededed'
  },
  saveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    justifyContent: 'flex-end'
  },
  saveTxt: {
    color: '#666'
  },
  saveIconContainer: {
    marginLeft: 10
  },
  saveIcon: {
    fontSize: 20,
    color: appConfig.colors.primary
  },
  historyHeadingContainer: {
    marginTop: 10,
    marginBottom: 15
  },
  historyDescriptionContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  historyDescription: {
    fontSize: 12,
    fontWeight: '300',
    marginRight: 15
  },
  noHistory: {
    textAlign: 'right',
    fontStyle: 'italic',
    marginRight: 15,
    color: '#888',
    letterSpacing: 1.3
  },
  dash: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#242424'
  },
  historyHeading: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 2.2,
    alignSelf: 'flex-start'
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginHorizontal: -15,
    paddingHorizontal: 15
  },
  domainTxt: {
    fontWeight: '300',
    letterSpacing: 0.5
  },
  icon: {
    marginLeft: 15,
    fontSize: 16,
    color: appConfig.colors.primary
  },
  comboBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    ...elevationShadowStyle(24, 0, 0, 0.5, appConfig.colors.primary)
  },
  ignoreContainer: {
    width: undefined,
    alignSelf: 'center'
  },
  ignoreBtn: {
    width: undefined,
    paddingHorizontal: 10,
    marginRight: -15,
    backgroundColor: '#999'
  },
  btnContainer: {
    paddingVertical: 15,
    flex: 1
  },
  noteContainer: {
    marginTop: 10
  },
  noteHeading: {
    marginBottom: 10
  },
  note: {
    marginTop: 5,
    color: '#888'
  }
});

const DOMAIN_STORAGE_KEY = 'dynamic_domain_2020_11_24-minh_nguyen';
const NOTES = [
  `• Nhập "hs " để gõ nhanh "https://"`,
  `• Nhập "ht " để gõ nhanh "http://"`
  //   `• Domain phải kết thúc bằ ng dấu "/" \r\n  (vd: https://domain.com/)`,
];

class DomainSelector extends Component {
  state = {
    domainName: '',
    domainNames: [],
    isSaveChecked: true
  };

  get isDisabled() {
    return !this.state.domainName;
  }

  isDomainNameExisted(domainName = this.state.domainName) {
    domainName = this.domainNameFormatted(domainName);
    return this.state.domainNames.includes(domainName);
  }

  domainNameFormatted(domainName = this.state.domainName) {
    const lastChar = domainName.substring(domainName.length - 1);
    if (lastChar !== '/') {
      domainName += '/';
    }

    return domainName;
  }

  componentDidMount() {
    this.loadDomain();
  }

  async loadDomain() {
    let domainNames = await AsyncStorage.getItem(
      DOMAIN_STORAGE_KEY,
      (error, result) => {
        if (error) {
          console.log('%cerror_load_domain', 'color:red', error);
        }
      }
    );
    if (domainNames) {
      domainNames = JSON.parse(domainNames);

      if (Array.isArray(domainNames)) {
        const autoSelectedDomainName = domainNames[0];
        this.setState({ domainNames });
        this.onChangeDomainName(autoSelectedDomainName);
      }
    }
  }

  saveDomain(domainName) {
    let domainNames = this.state.domainNames;
    domainNames.unshift(domainName);
    domainNames = domainNames.splice(0, 3);

    this.setState({ domainNames, domainName });

    AsyncStorage.setItem(
      DOMAIN_STORAGE_KEY,
      JSON.stringify(domainNames),
      err => {
        console.log('%cerror_save_domain', 'color:red', err);
      }
    );
  }

  onChangeDomainName(domainName = '') {
    const lastChar = domainName.substring(domainName.length - 1);
    if (lastChar === ' ') {
      if (this.state.domainName.toLocaleLowerCase() === 'ht') {
        domainName = 'http://';
      } else if (this.state.domainName.toLocaleLowerCase() === 'hs') {
        domainName = 'https://';
      }
    }

    this.setState({
      domainName
    });
  }

  ignoreDomainChanging() {
    store.setIgnoreChangeDomain(true);
    this.applyDomain(BaseAPI.apiDomain);
  }

  changeDomain() {
    if (this.isDisabled) return;
    Keyboard.dismiss();

    const domainName = this.domainNameFormatted();

    if (this.state.isSaveChecked && !this.isDomainNameExisted()) {
      this.saveDomain(domainName);
    }

    this.applyDomain(domainName);
  }

  applyDomain(domainName) {
    BaseAPI.updateAPIDomain = domainName;
    Actions.reset(appConfig.routes.sceneWrapper);
  }

  checkSave() {
    this.setState(prevState => ({
      isSaveChecked: !prevState.isSaveChecked
    }));
  }

  renderHistoryItem() {
    if (this.state.domainNames.length === 0) {
      return <Text style={styles.noHistory}>Chưa nhập gì :)</Text>;
    }
    return this.state.domainNames.map((domainName, index) => {
      const isSelected = this.state.domainName === domainName;
      const extraStyle = isSelected
        ? {
            backgroundColor: hexToRgbA(appConfig.colors.primary, 0.1)
          }
        : {};
      return (
        <TouchableOpacity
          key={index}
          onPress={() => this.onChangeDomainName(domainName)}
        >
          <View style={[styles.historyContainer, extraStyle]}>
            <Text style={styles.domainTxt}>{domainName}</Text>
            {isSelected && <Icon name="check" style={styles.icon} />}
          </View>
        </TouchableOpacity>
      );
    });
  }

  renderHistory() {
    return (
      <View>
        <View style={[styles.historyHeadingContainer]}>
          <View>
            <Text style={styles.historyHeading}>Bạn đã nhập gì?</Text>
          </View>
          <View style={styles.historyDescriptionContainer}>
            <Text style={styles.historyDescription}>
              Chỉ lưu 3 kết quả gần nhất!
            </Text>
            <View style={styles.dash} />
          </View>
        </View>
        {this.renderHistoryItem()}
      </View>
    );
  }

  renderNote() {
    return (
      <View style={styles.noteContainer}>
        <View style={[styles.historyHeadingContainer]}>
          <View>
            <Text style={styles.historyHeading}>Có thể bạn cần biết!</Text>
          </View>
          <View style={styles.historyDescriptionContainer}>
            <View style={styles.dash} />
          </View>
        </View>
        {NOTES.map((note, index) => (
          <Text key={index} style={styles.note}>
            {note}
          </Text>
        ))}
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.back && (
          <SafeAreaView style={styles.iconBackWrapper}>
            <TouchableOpacity
              style={styles.iconBackContainer}
              onPress={Actions.pop}
            >
              <Icon name="keyboard-backspace" style={styles.iconBack} />
            </TouchableOpacity>
          </SafeAreaView>
        )}

        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          bounces={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
              <Text style={styles.heading}>Domains</Text>
              <Text style={styles.subHeading}>
                Change API - change your life
              </Text>

              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={this.onChangeDomainName.bind(this)}
                  onSubmitEditing={this.changeDomain.bind(this)}
                  value={this.state.domainName}
                  placeholder="Nhập domain..."
                />

                {!this.isDisabled && (
                  <TouchableOpacity
                    onPress={() => this.onChangeDomainName()}
                    style={styles.closeIconContainer}
                  >
                    <Icon name="close" />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                onPress={this.checkSave.bind(this)}
                style={styles.saveContainer}
              >
                <Text style={styles.saveTxt}>Lưu lại nhé?</Text>
                <View style={styles.saveIconContainer}>
                  {this.state.isSaveChecked ? (
                    <Icon name="check-box" style={styles.saveIcon} />
                  ) : (
                    <Icon
                      name="check-box-outline-blank"
                      style={styles.saveIcon}
                    />
                  )}
                </View>
              </TouchableOpacity>

              <Text>{this.state.suggestedDomain}</Text>

              {this.renderHistory()}
              {this.renderNote()}
            </View>
          </SafeAreaView>
        </ScrollView>

        <View style={styles.comboBtnContainer}>
          <Button
            containerStyle={styles.ignoreContainer}
            btnContainerStyle={styles.ignoreBtn}
            title="Bỏ qua"
            onPress={this.ignoreDomainChanging.bind(this)}
          />
          <Button
            containerStyle={styles.btnContainer}
            title="Thay đổi"
            disabled={this.isDisabled}
            onPress={this.changeDomain.bind(this)}
          />
        </View>
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </View>
    );
  }
}

export default DomainSelector;
