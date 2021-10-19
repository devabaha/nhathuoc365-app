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
import equal from 'deep-equal';
import {Actions} from 'react-native-router-flux';
import {TouchableOpacity as RNTouchableOpacity} from 'react-native-gesture-handler';
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
import DomainTag from './components/DomainTag';
import {Container} from 'src/components/Layout';

const DOMAIN_ATTRIBUTE = {
  API_DOMAIN: {
    domainParamName: 'domainName',
    isShowSelectorParamName: 'isShowAPIDomainSelector',
    iconName: 'api',
    color: appConfig.colors.primary,
  },
  IMAGE_DOMAIN: {
    domainParamName: 'imageDomainName',
    isShowSelectorParamName: 'isShowImageDomainSelector',
    iconName: 'image',
    color: appConfig.colors.primary,
  },
  SOCIAL_DOMAIN: {
    domainParamName: 'socialDomainName',
    isShowSelectorParamName: 'isShowSocialDomainSelector',
    iconName: 'supervised-user-circle',
    color: appConfig.colors.primary,
  },
};

const DOMAIN_TYPE = {
  LIVE: {
    label: 'live',
    color: appConfig.colors.status.success,
  },
  DEV: {
    label: 'dev',
    color: appConfig.colors.status.danger,
  },
  SPRINT_DEV: {
    label: 'sprint_dev',
    color: appConfig.colors.status.warning,
  },
  PRE_RELEASE: {
    label: 'pre-release',
    color: appConfig.colors.status.info,
  },
  UNKNOWN: {
    label: 'unknown',
    color: appConfig.colors.disabled,
  },
};

const API_DOMAIN_OPTIONS = [
  {
    title: LIVE_API_DOMAIN,
    ...DOMAIN_ATTRIBUTE.API_DOMAIN,
    tag: DOMAIN_TYPE.LIVE,
  },
  {
    title: DEV_API_DOMAIN,
    ...DOMAIN_ATTRIBUTE.API_DOMAIN,
    tag: DOMAIN_TYPE.DEV,
  },
  {
    title: SPRINT_DEV_API_DOMAIN,
    ...DOMAIN_ATTRIBUTE.API_DOMAIN,
    tag: DOMAIN_TYPE.SPRINT_DEV,
  },
  {
    title: PRE_RELEASE_API_DOMAIN,
    ...DOMAIN_ATTRIBUTE.API_DOMAIN,
    tag: DOMAIN_TYPE.PRE_RELEASE,
  },
];
const IMAGE_DOMAIN_OPTIONS = [
  {
    title: LIVE_IMAGE_DOMAIN,
    ...DOMAIN_ATTRIBUTE.IMAGE_DOMAIN,
    tag: DOMAIN_TYPE.LIVE,
  },
  {
    title: DEV_IMAGE_DOMAIN,
    ...DOMAIN_ATTRIBUTE.IMAGE_DOMAIN,
    tag: DOMAIN_TYPE.DEV,
  },
];
const SOCIAL_DOMAIN_OPTIONS = [
  {
    title: LIVE_SOCIAL_DOMAIN,
    ...DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN,
    tag: DOMAIN_TYPE.LIVE,
  },
  {
    title: DEV_SOCIAL_DOMAIN,
    ...DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN,
    tag: DOMAIN_TYPE.DEV,
  },
];

const DOMAIN_STORAGE_KEY = 'dynamic_domain_2021_10_13-minh_nguyen';
const MAX_SAVED_DOMAIN = 5;
const NOTES = [
  `Nhập "hs " để gõ nhanh "https://".`,
  `Nhập "ht " để gõ nhanh "http://".`,
  `Nếu bỏ trống image/ social domain thì hệ thống sẽ tự lựa chọn dựa theo theo api domain đã chọn:\r\n- Api domain là live domain -> image/ social domain sử dụng live domain.\r\n- Api domain không phải live domain -> image/ social domain sử dụng dev domain.`,
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
    paddingVertical: 10,
    marginHorizontal: -15,
    paddingHorizontal: 15,
  },
  domainLocalStorageIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  domainTxt: {
    fontWeight: '300',
    letterSpacing: 0.5,
    flex: 1,
  },
  icon: {
    fontSize: 16,
    color: appConfig.colors.primary,
    marginLeft: 15,
  },
  iconDelete: {
    color: appConfig.colors.status.other,
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
  domainItemSelectorWrapper: {
    borderColor: appConfig.colors.border,
  },
  domainItemSelectorContainer: {
    paddingVertical: 10,
    marginHorizontal: 5,
  },
});

class DomainSelector extends Component {
  getShowSelectorParamName = (domainType) => {
    domainType = domainType.charAt(0).toUpperCase() + domainType.slice(1);
    return `isShow${domainType}Selector`;
  };

  state = {
    [DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName]: '',
    localStorageDomains: [],
    [DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName]: '',
    [DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName]: '',
    isSaveChecked: true,
    [DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName]: false,
    [DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.isShowSelectorParamName]: false,
    [DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.isShowSelectorParamName]: false,
  };
  refAPIDomainInput = React.createRef();
  refImageDomainInput = React.createRef();
  refSocialDomainInput = React.createRef();

  get isDisabled() {
    return !this.state[DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName];
  }

  isEqualDomainData(domain1 = {}, domain2 = {}) {
    const domain1Temp = {...domain1};
    const domain2Temp = {...domain2};
    delete domain1Temp.selected;
    delete domain2Temp.selected;

    return equal(domain1Temp, domain2Temp);
  }

  isDomainExisted(domain) {
    return !!this.state.localStorageDomains.find((d) =>
      this.isEqualDomainData(d, domain),
    );
  }

  formatDomainName(domainName) {
    const lastChar = domainName.substring(domainName.length - 1);
    if (lastChar !== '/') {
      domainName += '/';
    }

    return domainName;
  }

  componentDidMount() {
    this.loadDomain();
    store.setIgnoreChangeDomain(false);
  }

  handleSelectAPIDomain = (key, domain) => {
    this.closeDomainSelector();
    this.onChangeDomainName(key, domain.title);
  };

  async loadDomain() {
    let localStorageDomains = await AsyncStorage.getItem(
      DOMAIN_STORAGE_KEY,
      (error, result) => {
        if (error) {
          console.log('%cerror_load_domain', 'color:red', error);
        }
      },
    );

    if (localStorageDomains) {
      localStorageDomains = JSON.parse(localStorageDomains);
      if (Array.isArray(localStorageDomains)) {
        const autoSelectedAPIDomainName =
          localStorageDomains.find(
            (domain) =>
              domain.selected &&
              domain.domainParamName ===
                DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
          )?.title || '';

        this.setState({localStorageDomains});
        this.onChangeDomainName(
          DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
          autoSelectedAPIDomainName,
        );
      }
    }
  }

  updateSelectedLocalStorageDomain = (localStorageDomains, domain) => {
    const domainIndex = localStorageDomains.findIndex(
      (d) => d.title === domain.title,
    );
    localStorageDomains[domainIndex].selected = true;
    return localStorageDomains;
  };

  saveDomain(apiDomain, imageDomain, socialDomain) {
    const isApiDomainExisted = this.isDomainExisted(apiDomain);
    const isImageDomainExisted = imageDomain
      ? this.isDomainExisted(imageDomain)
      : undefined;
    const isSocialDomainExisted = socialDomain
      ? this.isDomainExisted(socialDomain)
      : undefined;

    let localStorageDomains = [...this.state.localStorageDomains];
    localStorageDomains.forEach((domain) => (domain.selected = false));

    if (isSocialDomainExisted !== undefined) {
      if (isSocialDomainExisted) {
        localStorageDomains = this.updateSelectedLocalStorageDomain(
          localStorageDomains,
          socialDomain,
        );
      } else {
        localStorageDomains.unshift(socialDomain);
      }
    }
    if (isImageDomainExisted !== undefined) {
      if (isImageDomainExisted) {
        localStorageDomains = this.updateSelectedLocalStorageDomain(
          localStorageDomains,
          imageDomain,
        );
      } else {
        localStorageDomains.unshift(imageDomain);
      }
    }
    if (isApiDomainExisted) {
      localStorageDomains = this.updateSelectedLocalStorageDomain(
        localStorageDomains,
        apiDomain,
      );
    } else {
      localStorageDomains.unshift(apiDomain);
    }

    localStorageDomains = localStorageDomains.splice(0, MAX_SAVED_DOMAIN);

    this.saveDomainToLocalStorage(localStorageDomains);
  }

  saveDomainToLocalStorage = (domains) => {
    this.setState({localStorageDomains: domains});

    AsyncStorage.setItem(DOMAIN_STORAGE_KEY, JSON.stringify(domains), (err) => {
      err && console.log('%cerror_save_domain', 'color:red', err);
    });
  };

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
    this.applyDomain(LIVE_API_DOMAIN);
  }

  changeDomain() {
    if (this.isDisabled) return;
    Keyboard.dismiss();

    const apiDomainName = this.formatDomainName(
      this.state[DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName],
    );
    const isAPIDomainLive = apiDomainName === LIVE_API_DOMAIN;
    const imageDomainName = this.state[
      DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName
    ]
      ? this.formatDomainName(
          this.state[DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName],
        )
      : isAPIDomainLive
      ? LIVE_IMAGE_DOMAIN
      : DEV_IMAGE_DOMAIN;
    const socialDomainName = this.state[
      DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName
    ]
      ? this.formatDomainName(
          this.state[DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName],
        )
      : isAPIDomainLive
      ? LIVE_SOCIAL_DOMAIN
      : DEV_SOCIAL_DOMAIN;

    const apiDomain = API_DOMAIN_OPTIONS.find(
      (domain) => domain.title === apiDomainName,
    ) || {
      title: apiDomainName,
      ...DOMAIN_ATTRIBUTE.API_DOMAIN,
      tag: DOMAIN_TYPE.UNKNOWN,
    };
    apiDomain && (apiDomain.selected = true);

    const imageDomain = this.state[
      DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName
    ]
      ? IMAGE_DOMAIN_OPTIONS.find(
          (domain) => domain.title === imageDomainName,
        ) || {
          title: imageDomainName,
          ...DOMAIN_ATTRIBUTE.IMAGE_DOMAIN,
          tag: DOMAIN_TYPE.UNKNOWN,
        }
      : undefined;
    imageDomain && (imageDomain.selected = true);

    const socialDomain = this.state[
      DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName
    ]
      ? SOCIAL_DOMAIN_OPTIONS.find(
          (domain) => domain.title === socialDomainName,
        ) || {
          title: socialDomainName,
          ...DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN,
          tag: DOMAIN_TYPE.UNKNOWN,
        }
      : undefined;
    socialDomain && (socialDomain.selected = true);

    store.setIgnoreChangeDomain(true);

    if (this.state.isSaveChecked) {
      this.saveDomain(apiDomain, imageDomain, socialDomain);
    }

    this.applyDomain(apiDomainName, imageDomainName, socialDomainName);
  }

  applyDomain(apiDomainName, imageDomainName, socialDomainName) {
    BaseAPI.updateAPIDomain = apiDomainName;
    if (imageDomainName) {
      BaseAPI.updateImageDomain = imageDomainName;
    }
    if (socialDomainName) {
      BaseAPI.updateSocialDomain = socialDomainName;
    }

    Actions.reset(appConfig.routes.sceneWrapper);
  }

  checkSave() {
    this.setState((prevState) => ({
      isSaveChecked: !prevState.isSaveChecked,
    }));
  }

  getDomainTag = (domainParamName) => {
    let domain,
      listDomainOptions = [];
    switch (domainParamName) {
      case DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName:
        listDomainOptions = API_DOMAIN_OPTIONS;
        break;
      case DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName:
        listDomainOptions = IMAGE_DOMAIN_OPTIONS;
        break;
      case DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName:
        listDomainOptions = SOCIAL_DOMAIN_OPTIONS;
        break;
    }
    domain = this.state[domainParamName]
      ? listDomainOptions.find(
          (domain) =>
            domain.title === this.state[domainParamName] ||
            domain.title.slice(0, domain.title.length - 1) ===
              this.state[domainParamName],
        )
      : undefined;

    return (
      domain?.tag ||
      (this.state[domainParamName] ? DOMAIN_TYPE.UNKNOWN : undefined)
    );
  };

  closeDomainSelector = () => {
    this.setState({
      [DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName]: false,
      [DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.isShowSelectorParamName]: false,
      [DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.isShowSelectorParamName]: false,
    });
  };

  deleteDomainFromLocalStorage = (domain) => {
    const localStorageDomains = [...this.state.localStorageDomains];
    const deleteIndex = localStorageDomains.findIndex((d) =>
      this.isEqualDomainData(d, domain),
    );

    if (deleteIndex !== -1) {
      localStorageDomains.splice(deleteIndex, 1);
      this.saveDomainToLocalStorage(localStorageDomains);
    }
  };

  renderHistoryItem() {
    if (this.state.localStorageDomains.length === 0) {
      return <Text style={styles.noHistory}>Chưa nhập gì :)</Text>;
    }
    return this.state.localStorageDomains.map((domain, index) => {
      const isSelected =
        domain?.title && this.state[domain.domainParamName] === domain.title;
      const extraStyle = isSelected
        ? {
            backgroundColor: hexToRgbA(
              domain.color || appConfig.colors.primary,
              0.1,
            ),
          }
        : {};
      const extraIconStyle = {
        color: hexToRgbA(domain.color || appConfig.colors.primary, 0.6),
      };

      return (
        <TouchableOpacity
          key={index}
          onPress={() =>
            this.onChangeDomainName(domain.domainParamName, domain.title)
          }>
          <View style={[styles.historyContainer, extraStyle]}>
            {!!domain.iconName && (
              <MaterialIcons
                name={domain.iconName}
                style={[styles.domainLocalStorageIcon, extraIconStyle]}
              />
            )}
            <Text style={styles.domainTxt}>{domain.title}</Text>
            {!!domain?.tag && (
              <DomainTag
                label={domain.tag.label}
                containerStyle={{
                  backgroundColor: domain.tag.color,
                }}
              />
            )}
            {isSelected ? (
              <MaterialIcons
                name="check"
                style={[styles.icon, extraIconStyle]}
              />
            ) : (
              <TouchableOpacity
                hitSlop={HIT_SLOP}
                onPress={() => this.deleteDomainFromLocalStorage(domain)}>
                <MaterialIcons
                  name="delete"
                  style={[styles.icon, styles.iconDelete]}
                />
              </TouchableOpacity>
            )}
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
              Chỉ lưu {MAX_SAVED_DOMAIN} dữ liệu gần nhất!
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
          <Container key={index} row centerVertical={false}>
            <Text style={styles.note}>•{` `}</Text>
            <Text style={styles.note}>{note}</Text>
          </Container>
        ))}
      </View>
    );
  }

  renderDomainItemSelector = (domain, onPress, index, domains) => {
    return (
      <View
        key={index}
        style={[
          styles.domainItemSelectorWrapper,
          {
            borderBottomWidth:
              index !== domains.length - 1 ? appConfig.device.pixel : 0,
          },
        ]}>
        <RNTouchableOpacity
          onPress={onPress}
          style={styles.domainItemSelectorContainer}>
          <Container row centerVertical={false}>
            <Text style={styles.domainTxt}>{domain.title}</Text>
            <DomainTag
              label={domain?.tag?.label}
              containerStyle={{backgroundColor: domain?.tag?.color}}
            />
          </Container>
        </RNTouchableOpacity>
      </View>
    );
  };

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
                  value={
                    this.state[DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName]
                  }
                  iconName={DOMAIN_ATTRIBUTE.API_DOMAIN.iconName}
                  iconColor={DOMAIN_ATTRIBUTE.API_DOMAIN.color}
                  tag={this.getDomainTag(
                    DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
                  )}
                  placeholder="api domain"
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(
                      DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
                      value,
                    )
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(
                      DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
                      '',
                    )
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName,
                    )
                  }
                />

                <DomainInput
                  innerRef={this.refImageDomainInput}
                  value={
                    this.state[DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName]
                  }
                  iconName={DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.iconName}
                  iconColor={DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.color}
                  tag={this.getDomainTag(
                    DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
                  )}
                  placeholder="image domain (optional)"
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(
                      DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
                      value,
                    )
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(
                      DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
                      '',
                    )
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.isShowSelectorParamName,
                    )
                  }
                />

                <DomainInput
                  innerRef={this.refSocialDomainInput}
                  value={
                    this.state[DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName]
                  }
                  iconName={DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.iconName}
                  iconColor={DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.color}
                  tag={this.getDomainTag(
                    DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
                  )}
                  placeholder="social domain (optional)"
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(
                      DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
                      value,
                    )
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(
                      DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
                      '',
                    )
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.isShowSelectorParamName,
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
          data={API_DOMAIN_OPTIONS}
          show={this.state[DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName]}
          useParentWidth
          onSelect={(domain) =>
            this.handleSelectAPIDomain(
              DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
              domain,
            )
          }
          onClose={this.closeDomainSelector}
          renderCustomItem={this.renderDomainItemSelector}
        />
        <AwesomeCombo
          parentRef={this.refImageDomainInput}
          data={IMAGE_DOMAIN_OPTIONS}
          show={
            this.state[DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.isShowSelectorParamName]
          }
          useParentWidth
          onSelect={(domain) =>
            this.handleSelectAPIDomain(
              DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
              domain,
            )
          }
          onClose={this.closeDomainSelector}
          renderCustomItem={this.renderDomainItemSelector}
        />
        <AwesomeCombo
          parentRef={this.refSocialDomainInput}
          data={SOCIAL_DOMAIN_OPTIONS}
          show={
            this.state[DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.isShowSelectorParamName]
          }
          useParentWidth
          onSelect={(domain) =>
            this.handleSelectAPIDomain(
              DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
              domain,
            )
          }
          onClose={this.closeDomainSelector}
          renderCustomItem={this.renderDomainItemSelector}
        />
      </>
    );
  }
}

export default DomainSelector;
