import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Text,
  ScrollView,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import store from 'app-store';
import appConfig from 'app-config';
import BaseAPI, {
  DEV_API_DOMAIN,
  SPRINT_DEV_API_DOMAIN,
  PRE_RELEASE_API_DOMAIN,
  DEV_IMAGE_DOMAIN,
  LIVE_IMAGE_DOMAIN,
  DEV_SOCIAL_DOMAIN,
  LIVE_SOCIAL_DOMAIN,
  LIVE_API_DOMAIN,
} from 'src/network/API/BaseAPI';

import AwesomeCombo from 'src/components/AwesomeCombo';
import Button from 'src/components/Button';
import DomainInput from './components/DomainInput';

const DOMAIN_TYPE = {
  API_DOMAIN: 'domainName',
  IMAGE_DOMAIN: 'imageDomainName',
  SOCIAL_DOMAIN: 'socialDomainName',
};
const IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME = {
  API_DOMAIN: 'isShowAPIDomainSelector',
  IMAGE_DOMAIN: 'isShowImageDomainSelector',
  SOCIAL_DOMAIN: 'isShowSocialDomainSelector',
};

const DOMAIN_STORAGE_KEY = 'dynamic_domain_2020_11_24-minh_nguyen';
const IMAGE_DOMAIN_STORAGE_KEY = 'dynamic_image_domain_2020_10_12-minh_nguyen';
const SOCIAL_DOMAIN_STORAGE_KEY =
  'dynamic_social_domain_2020_10_12-minh_nguyen';
const NOTES = [
  `• Nhập "hs " để gõ nhanh "https://"`,
  `• Nhập "ht " để gõ nhanh "http://"`,
  //   `• Domain phải kết thúc bằ ng dấu "/" \r\n  (vd: https://domain.com/)`,
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconBackWrapper: {
    // left: 10,
    position: 'absolute',
    zIndex: 9999,
  },
  iconBackContainer: {
    padding: 15,
  },
  iconBack: {
    fontSize: 30,
    color: '#555',
  },
  mainContent: {
    flex: 1,
    padding: 15,
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#444',
    fontSize: 30,
    marginTop: '7%',
    letterSpacing: 8,
    left: 4,
    textTransform: 'uppercase',
  },
  subHeading: {
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: '7%',
    textTransform: 'lowercase',
  },
  domainInput: {
    marginBottom: 10,
  },
  saveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    justifyContent: 'flex-end',
  },
  saveTxt: {
    color: '#666',
  },
  saveIconContainer: {
    marginLeft: 10,
  },
  saveIcon: {
    fontSize: 20,
    color: appConfig.colors.primary,
  },
  historyHeadingContainer: {
    marginTop: 10,
    marginBottom: 15,
  },
  historyDescriptionContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDescription: {
    fontSize: 12,
    fontWeight: '300',
    marginRight: 15,
  },
  noHistory: {
    textAlign: 'right',
    fontStyle: 'italic',
    marginRight: 15,
    color: '#888',
    letterSpacing: 1.3,
  },
  dash: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#242424',
  },
  historyHeading: {
    color: '#555',
    fontWeight: 'bold',
    fontSize: 16,
    fontStyle: 'italic',
    textTransform: 'uppercase',
    letterSpacing: 2.2,
    alignSelf: 'flex-start',
  },
  historyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  domainTxt: {
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  icon: {
    marginLeft: 15,
    fontSize: 16,
    color: appConfig.colors.primary,
  },
  comboBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    ...elevationShadowStyle(24, 0, 0, 0.5, appConfig.colors.primary),
  },
  ignoreContainer: {
    width: undefined,
    alignSelf: 'center',
  },
  ignoreBtn: {
    width: undefined,
    paddingHorizontal: 10,
    marginRight: -15,
    backgroundColor: '#999',
  },
  btnContainer: {
    paddingVertical: 15,
    flex: 1,
  },
  noteContainer: {
    marginTop: 10,
  },
  noteHeading: {
    marginBottom: 10,
  },
  note: {
    marginTop: 5,
    color: '#888',
  },
});

class DomainSelector extends Component {
  getShowSelectorParamName = (domainType) => {
    domainType = domainType.charAt(0).toUpperCase() + domainType.slice(1);
    return `isShow${domainType}Selector`;
  };

  state = {
    [DOMAIN_TYPE.API_DOMAIN]: '',
    domainNames: [],
    [DOMAIN_TYPE.IMAGE_DOMAIN]: '',
    [DOMAIN_TYPE.SOCIAL_DOMAIN]: '',
    isSaveChecked: true,
    [IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.API_DOMAIN]: false,
    [IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.IMAGE_DOMAIN]: false,
    [IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.SOCIAL_DOMAIN]: false,
  };
  refAPIDomainInput = React.createRef();
  refImageDomainInput = React.createRef();
  refSocialDomainInput = React.createRef();
  apiDomainOptions = [
    {title: LIVE_API_DOMAIN},
    {title: DEV_API_DOMAIN},
    {title: SPRINT_DEV_API_DOMAIN},
    {title: PRE_RELEASE_API_DOMAIN},
  ];
  imageDomainOptions = [{title: DEV_IMAGE_DOMAIN}, {title: LIVE_IMAGE_DOMAIN}];
  socialDomainOptions = [
    {title: DEV_SOCIAL_DOMAIN},
    {title: LIVE_SOCIAL_DOMAIN},
  ];

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

  handleSelectAPIDomain = (key, domain) => {
    this.onChangeDomainName(key, domain.title);
  };

  async loadDomain() {
    let domainNames = await AsyncStorage.getItem(
      DOMAIN_STORAGE_KEY,
      (error, result) => {
        if (error) {
          console.log('%cerror_load_domain', 'color:red', error);
        }
      },
    );
    if (domainNames) {
      domainNames = JSON.parse(domainNames);

      if (Array.isArray(domainNames)) {
        const autoSelectedDomainName = domainNames[0];
        this.setState({domainNames});
        this.onChangeDomainName(autoSelectedDomainName);
      }
    }
  }

  saveDomain(domainName) {
    let domainNames = this.state.domainNames;
    domainNames.unshift(domainName);
    domainNames = domainNames.splice(0, 3);

    this.setState({domainNames, domainName});

    AsyncStorage.setItem(
      DOMAIN_STORAGE_KEY,
      JSON.stringify(domainNames),
      (err) => {
        console.log('%cerror_save_domain', 'color:red', err);
      },
    );
  }

  onChangeDomainName(key, domainName = '') {
    const lastChar = domainName.substring(domainName.length - 1);
    if (lastChar === ' ') {
      if (this.state.domainName.toLocaleLowerCase() === 'ht') {
        domainName = 'http://';
      } else if (this.state.domainName.toLocaleLowerCase() === 'hs') {
        domainName = 'https://';
      }
    }

    this.setState({
      [key]: domainName,
    });
  }

  handleShowMoreAPIDomain = (key) => {
    this.setState((prevState) => ({
      [key]: !prevState[key],
    }));
  };

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
    this.setState((prevState) => ({
      isSaveChecked: !prevState.isSaveChecked,
    }));
  }

  closeAPISelector = () => {
    this.setState({
      [IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.API_DOMAIN]: false,
      [IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.IMAGE_DOMAIN]: false,
      [IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.SOCIAL_DOMAIN]: false,
    });
  };

  renderHistoryItem() {
    if (this.state.domainNames.length === 0) {
      return <Text style={styles.noHistory}>Chưa nhập gì :)</Text>;
    }
    return this.state.domainNames.map((domainName, index) => {
      const isSelected = this.state.domainName === domainName;
      const extraStyle = isSelected
        ? {
            backgroundColor: hexToRgbA(appConfig.colors.primary, 0.1),
          }
        : {};
      return (
        <TouchableOpacity
          key={index}
          onPress={() => this.onChangeDomainName(domainName)}>
          <View style={[styles.historyContainer, extraStyle]}>
            <Text style={styles.domainTxt}>{domainName}</Text>
            {isSelected && <MaterialIcons name="check" style={styles.icon} />}
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
        <View style={styles.container}>
          {this.props.back && (
            <SafeAreaView style={styles.iconBackWrapper}>
              <TouchableOpacity
                style={styles.iconBackContainer}
                onPress={Actions.pop}>
                <MaterialIcons
                  name="keyboard-backspace"
                  style={styles.iconBack}
                />
              </TouchableOpacity>
            </SafeAreaView>
          )}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
            bounces={false}
            contentContainerStyle={{flexGrow: 1}}>
            <SafeAreaView style={styles.container}>
              <View style={styles.mainContent}>
                <Text style={styles.heading}>Domains</Text>
                <Text style={styles.subHeading}>
                  Change API - change your life
                </Text>

                <DomainInput
                  innerRef={this.refAPIDomainInput}
                  value={this.state[DOMAIN_TYPE.API_DOMAIN]}
                  placeholder="Nhập domain..."
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(DOMAIN_TYPE.API_DOMAIN, value)
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(DOMAIN_TYPE.API_DOMAIN, '')
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.API_DOMAIN,
                    )
                  }
                />

                <DomainInput
                  innerRef={this.refImageDomainInput}
                  value={this.state[DOMAIN_TYPE.IMAGE_DOMAIN]}
                  placeholder="Nhập image domain..."
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(DOMAIN_TYPE.IMAGE_DOMAIN, value)
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(DOMAIN_TYPE.IMAGE_DOMAIN, '')
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.IMAGE_DOMAIN,
                    )
                  }
                />

                <DomainInput
                  innerRef={this.refSocialDomainInput}
                  value={this.state[DOMAIN_TYPE.SOCIAL_DOMAIN]}
                  placeholder="Nhập social domain..."
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(DOMAIN_TYPE.SOCIAL_DOMAIN, value)
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(DOMAIN_TYPE.SOCIAL_DOMAIN, '')
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.SOCIAL_DOMAIN,
                    )
                  }
                />

                <TouchableOpacity
                  onPress={this.checkSave.bind(this)}
                  style={styles.saveContainer}>
                  <Text style={styles.saveTxt}>Lưu lại nhé?</Text>
                  <View style={styles.saveIconContainer}>
                    {this.state.isSaveChecked ? (
                      <MaterialIcons name="check-box" style={styles.saveIcon} />
                    ) : (
                      <MaterialIcons
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

        <AwesomeCombo
          parentRef={this.refAPIDomainInput}
          data={this.apiDomainOptions}
          show={this.state[IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.API_DOMAIN]}
          onSelect={(domain) =>
            this.handleSelectAPIDomain(
              IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.API_DOMAIN,
              domain,
            )
          }
          onClose={this.closeAPISelector}
        />
        <AwesomeCombo
          parentRef={this.refImageDomainInput}
          data={this.imageDomainOptions}
          show={this.state[IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.IMAGE_DOMAIN]}
          onSelect={(domain) =>
            this.handleSelectAPIDomain(
              IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.IMAGE_DOMAIN,
              domain,
            )
          }
          onClose={this.closeAPISelector}
        />
        <AwesomeCombo
          parentRef={this.refSocialDomainInput}
          data={this.socialDomainOptions}
          show={this.state[IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.SOCIAL_DOMAIN]}
          onSelect={(domain) =>
            this.handleSelectAPIDomain(
              IS_SHOW_DOMAIN_SELECTOR_PARAM_NAME.SOCIAL_DOMAIN,
              domain,
            )
          }
          onClose={this.closeAPISelector}
        />
      </>
    );
  }
}

export default DomainSelector;
