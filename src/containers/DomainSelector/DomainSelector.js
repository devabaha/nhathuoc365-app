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
import Button from '../../components/Button';
import appConfig from 'app-config';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BaseAPI from '../../network/API/BaseAPI';
import { Actions } from 'react-native-router-flux';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    marginTop: '20%',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: '10%'
  },
  textInput: {
    paddingVertical: 15,
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
    marginBottom: 20,
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
  btnContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingVertical: 15,
    backgroundColor: '#fff',
    ...elevationShadowStyle(5)
  },
  noteContainer: {
    marginTop: 30
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
const DOMAIN_REGEX = /(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]/g;
const NOTES = [
  `• Nhập "hs " để gõ nhanh "https://"`,
  `• Nhập "ht " để gõ nhanh "http://"`,
  `• Domain phải kết thúc bằng dấu "/" \r\n  (vd: https://domain.com/)`
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
    let domainNames = await AsyncStorage.getItem(DOMAIN_STORAGE_KEY, err => {
      console.log('%cerror_load_domain', 'color:red', err);
    });
    if (domainNames) {
      domainNames = JSON.parse(domainNames);
      console.log(domainNames);
      if (Array.isArray(domainNames)) {
        this.setState({ domainNames });
        this.onChangeDomainName(domainNames[0]);
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

  changeDomain() {
    if (this.isDisabled) return;
    Keyboard.dismiss();

    const domainName = this.domainNameFormatted();

    if (this.state.isSaveChecked && !this.isDomainNameExisted()) {
      this.saveDomain(domainName);
    }

    BaseAPI.updateAPIDomain = domainName;
    Actions.replace(appConfig.routes.primaryTabbar);
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
      <>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          bounces={false}
          style={styles.container}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.mainContent}>
              <Text style={styles.heading}>Domains</Text>

              <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <TextInput
                  style={styles.textInput}
                  onChangeText={this.onChangeDomainName.bind(this)}
                  onSubmitEditing={this.onChangeDomainName.bind(this)}
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
        <Button
          containerStyle={styles.btnContainer}
          title="Thay đổi"
          disabled={this.isDisabled}
          onPress={this.changeDomain.bind(this)}
        />
        {appConfig.device.isIOS && <KeyboardSpacer />}
      </>
    );
  }
}

export default DomainSelector;
