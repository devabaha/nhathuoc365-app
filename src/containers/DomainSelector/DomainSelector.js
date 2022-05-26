import React, {Component} from 'react';
import {StyleSheet, View, Keyboard} from 'react-native';
// 3-party libs
import equal from 'deep-equal';
import {withTranslation} from 'react-i18next';
import {observer} from 'mobx-react';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {isDarkTheme, mergeStyles} from 'src/Themes/helper';
// routing
import {pop, reset} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
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
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import AwesomeCombo from 'src/components/AwesomeCombo';
import Button from 'src/components/Button';
import DomainInput from './components/DomainInput';
import DomainTag from './components/DomainTag';
import {
  ScreenWrapper,
  Container,
  Typography,
  BaseButton,
  TextButton,
  IconButton,
  ScrollView,
  Icon,
} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iconBackWrapper: {
    position: 'absolute',
    zIndex: 9999,
  },
  iconBackContainer: {
    padding: 15,
  },
  iconBack: {
    fontSize: 30,
  },
  mainContent: {
    flex: 1,
    padding: 15,
  },
  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: '7%',
    letterSpacing: 8,
    left: 4,
    textTransform: 'uppercase',
  },
  subHeading: {
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
    marginLeft: 'auto',
  },
  saveTxt: {},
  saveIconContainer: {
    marginLeft: 10,
  },
  saveIcon: {
    fontSize: 20,
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
    fontWeight: '300',
    marginRight: 15,
  },
  noHistory: {
    textAlign: 'right',
    fontStyle: 'italic',
    marginRight: 15,
    letterSpacing: 1.3,
  },
  dash: {
    flex: 1,
    height: 0.5,
  },
  historyHeading: {
    fontWeight: 'bold',
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
    marginLeft: 15,
  },
  iconDelete: {},
  comboBtnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ignoreContainer: {
    width: undefined,
    alignSelf: 'center',
  },
  ignoreBtn: {
    width: undefined,
    paddingHorizontal: 10,
    marginRight: -15,
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
  },
  domainItemSelectorContainer: {
    paddingVertical: 10,
    marginHorizontal: 5,
  },
});

class DomainSelector extends Component {
  static contextType = ThemeContext;

  DOMAIN_ATTRIBUTE = {
    API_DOMAIN: {
      domainParamName: 'domainName',
      isShowSelectorParamName: 'isShowAPIDomainSelector',
      iconName: 'api',
      color: this.theme.color.primaryHighlight,
    },
    IMAGE_DOMAIN: {
      domainParamName: 'imageDomainName',
      isShowSelectorParamName: 'isShowImageDomainSelector',
      iconName: 'image',
      color: this.theme.color.primaryHighlight,
    },
    SOCIAL_DOMAIN: {
      domainParamName: 'socialDomainName',
      isShowSelectorParamName: 'isShowSocialDomainSelector',
      iconName: 'supervised-user-circle',
      color: this.theme.color.primaryHighlight,
    },
  };

  DOMAIN_TYPE = {
    LIVE: {
      label: 'live',
      color: this.theme.color.success,
    },
    DEV: {
      label: 'dev',
      color: this.theme.color.danger,
    },
    SPRINT_DEV: {
      label: 'sprint_dev',
      color: this.theme.color.warning,
    },
    PRE_RELEASE: {
      label: 'pre-release',
      color: this.theme.color.info,
    },
    UNKNOWN: {
      label: 'unknown',
      color: this.theme.color.disabled,
    },
  };

  API_DOMAIN_OPTIONS = [
    {
      title: LIVE_API_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.API_DOMAIN,
      tag: this.DOMAIN_TYPE.LIVE,
    },
    {
      title: DEV_API_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.API_DOMAIN,
      tag: this.DOMAIN_TYPE.DEV,
    },
    {
      title: SPRINT_DEV_API_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.API_DOMAIN,
      tag: this.DOMAIN_TYPE.SPRINT_DEV,
    },
    {
      title: PRE_RELEASE_API_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.API_DOMAIN,
      tag: this.DOMAIN_TYPE.PRE_RELEASE,
    },
  ];
  IMAGE_DOMAIN_OPTIONS = [
    {
      title: LIVE_IMAGE_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN,
      tag: this.DOMAIN_TYPE.LIVE,
    },
    {
      title: DEV_IMAGE_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN,
      tag: this.DOMAIN_TYPE.DEV,
    },
  ];
  SOCIAL_DOMAIN_OPTIONS = [
    {
      title: LIVE_SOCIAL_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN,
      tag: this.DOMAIN_TYPE.LIVE,
    },
    {
      title: DEV_SOCIAL_DOMAIN,
      ...this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN,
      tag: this.DOMAIN_TYPE.DEV,
    },
  ];

  DOMAIN_STORAGE_KEY = 'dynamic_domain_2021_10_13-minh_nguyen';
  MAX_SAVED_DOMAIN = 5;
  NOTES = this.props.t('domainSelector:note');

  getShowSelectorParamName = (domainType) => {
    domainType = domainType.charAt(0).toUpperCase() + domainType.slice(1);
    return `isShow${domainType}Selector`;
  };

  state = {
    [this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName]: '',
    localStorageDomains: [],
    [this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName]: '',
    [this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName]: '',
    isSaveChecked: true,
    [this.DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName]: false,
    [this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.isShowSelectorParamName]: false,
    [this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.isShowSelectorParamName]: false,
  };
  refAPIDomainInput = React.createRef();
  refImageDomainInput = React.createRef();
  refSocialDomainInput = React.createRef();

  get theme() {
    return getTheme(this);
  }

  get isDisabled() {
    return !this.state[this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName];
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
      this.DOMAIN_STORAGE_KEY,
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
                this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
          )?.title || '';

        this.setState({localStorageDomains});
        this.onChangeDomainName(
          this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
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

    localStorageDomains = localStorageDomains.splice(0, this.MAX_SAVED_DOMAIN);

    this.saveDomainToLocalStorage(localStorageDomains);
  }

  saveDomainToLocalStorage = (domains) => {
    this.setState({localStorageDomains: domains});

    AsyncStorage.setItem(
      this.DOMAIN_STORAGE_KEY,
      JSON.stringify(domains),
      (err) => {
        err && console.log('%cerror_save_domain', 'color:red', err);
      },
    );
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
      this.state[this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName],
    );
    const isAPIDomainLive = apiDomainName === LIVE_API_DOMAIN;
    const imageDomainName = this.state[
      this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName
    ]
      ? this.formatDomainName(
          this.state[this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName],
        )
      : apiDomainName;
    const socialDomainName = this.state[
      this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName
    ]
      ? this.formatDomainName(
          this.state[this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName],
        )
      : isAPIDomainLive
      ? LIVE_SOCIAL_DOMAIN
      : DEV_SOCIAL_DOMAIN;

    const apiDomain = this.API_DOMAIN_OPTIONS.find(
      (domain) => domain.title === apiDomainName,
    ) || {
      title: apiDomainName,
      ...this.DOMAIN_ATTRIBUTE.API_DOMAIN,
      tag: this.DOMAIN_TYPE.UNKNOWN,
    };
    apiDomain && (apiDomain.selected = true);

    const imageDomain = this.state[
      this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName
    ]
      ? this.IMAGE_DOMAIN_OPTIONS.find(
          (domain) => domain.title === imageDomainName,
        ) || {
          title: imageDomainName,
          ...this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN,
          tag: this.DOMAIN_TYPE.UNKNOWN,
        }
      : undefined;
    imageDomain && (imageDomain.selected = true);

    const socialDomain = this.state[
      this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName
    ]
      ? this.SOCIAL_DOMAIN_OPTIONS.find(
          (domain) => domain.title === socialDomainName,
        ) || {
          title: socialDomainName,
          ...this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN,
          tag: this.DOMAIN_TYPE.UNKNOWN,
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

    reset(appConfig.routes.sceneWrapper);
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
      case this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName:
        listDomainOptions = this.API_DOMAIN_OPTIONS;
        break;
      case this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName:
        listDomainOptions = this.IMAGE_DOMAIN_OPTIONS;
        break;
      case this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName:
        listDomainOptions = this.SOCIAL_DOMAIN_OPTIONS;
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
      (this.state[domainParamName] ? this.DOMAIN_TYPE.UNKNOWN : undefined)
    );
  };

  closeDomainSelector = () => {
    this.setState({
      [this.DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName]: false,
      [this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.isShowSelectorParamName]: false,
      [this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.isShowSelectorParamName]: false,
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
      return (
        <Typography
          type={TypographyType.LABEL_MEDIUM_TERTIARY}
          style={styles.noHistory}>
          {this.props.t('domainSelector:noHistory')}
        </Typography>
      );
    }
    return this.state.localStorageDomains.map((domain, index) => {
      const isSelected =
        domain?.title && this.state[domain.domainParamName] === domain.title;
      const domainMainColor =
        (!isDarkTheme(this.theme) && domain.color) ||
        this.theme.color.primaryHighlight;
      const extraStyle = isSelected
        ? {
            backgroundColor: hexToRgba(domainMainColor, 0.1),
          }
        : {};
      const extraIconStyle = {
        color: hexToRgba(domainMainColor, 0.6),
      };

      return (
        <BaseButton
          key={index}
          onPress={() =>
            this.onChangeDomainName(domain.domainParamName, domain.title)
          }>
          <View style={[styles.historyContainer, extraStyle]}>
            {!!domain.iconName && (
              <Icon
                bundle={BundleIconSetName.MATERIAL_ICONS}
                name={domain.iconName}
                style={[styles.domainLocalStorageIcon, extraIconStyle]}
              />
            )}
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.domainTxt}>
              {domain.title}
            </Typography>
            {!!domain?.tag && (
              <DomainTag
                label={domain.tag.label}
                containerStyle={{
                  backgroundColor: domain.tag.color,
                }}
              />
            )}
            {isSelected ? (
              <Icon
                bundle={BundleIconSetName.MATERIAL_ICONS}
                name="check"
                style={[styles.icon, extraIconStyle]}
              />
            ) : (
              <IconButton
                hitSlop={HIT_SLOP}
                bundle={BundleIconSetName.MATERIAL_ICONS}
                name="delete"
                iconStyle={[styles.icon, this.iconDeleteStyle]}
                onPress={() => this.deleteDomainFromLocalStorage(domain)}
              />
            )}
          </View>
        </BaseButton>
      );
    });
  }

  renderHistory() {
    return (
      <View>
        <View style={[styles.historyHeadingContainer]}>
          <View>
            <Typography
              type={TypographyType.LABEL_LARGE_TERTIARY}
              style={styles.historyHeading}>
              {this.props.t('domainSelector:historyTitle')}
            </Typography>
          </View>
          <View style={styles.historyDescriptionContainer}>
            <Typography
              type={TypographyType.LABEL_SMALL}
              style={styles.historyDescription}>
              {this.props.t('domainSelector:historyLabel', {
                maxSave: this.MAX_SAVED_DOMAIN,
              })}
            </Typography>
            <View style={this.dashStyle} />
          </View>
        </View>
        {this.renderHistoryItem()}
      </View>
    );
  }

  renderNote() {
    return (
      <View style={styles.noteContainer}>
        <View style={styles.historyHeadingContainer}>
          <View>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.historyHeading}>
              {this.props.t('domainSelector:noteTitle')}
            </Typography>
          </View>
          <View style={styles.historyDescriptionContainer}>
            <View style={this.dashStyle} />
          </View>
        </View>
        {this.NOTES.map((note, index) => (
          <Container noBackground key={index} row centerVertical={false}>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              style={styles.note}>
              •{` `}
            </Typography>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              style={styles.note}>
              {note}
            </Typography>
          </Container>
        ))}
      </View>
    );
  }

  renderDomainItemSelector = (domain, onPress, index, domains) => {
    return (
      <Container
        key={index}
        style={[
          this.domainItemSelectorWrapperStyle,
          {
            borderBottomWidth:
              index !== domains.length - 1 ? appConfig.device.pixel : 0,
          },
        ]}>
        <BaseButton
          useGestureHandler
          onPress={onPress}
          style={styles.domainItemSelectorContainer}>
          <Container noBackground row centerVertical={false}>
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={styles.domainTxt}>
              {domain.title}
            </Typography>
            <DomainTag
              label={domain?.tag?.label}
              containerStyle={{backgroundColor: domain?.tag?.color}}
            />
          </Container>
        </BaseButton>
      </Container>
    );
  };

  renderIconCheckSave = () => {
    return (
      <View style={styles.saveIconContainer}>
        <Icon
          bundle={BundleIconSetName.MATERIAL_ICONS}
          name={
            this.state.isSaveChecked ? 'check-box' : 'check-box-outline-blank'
          }
          style={this.saveIconStyle}
        />
      </View>
    );
  };

  get dashStyle() {
    return mergeStyles(styles.dash, {
      backgroundColor: this.theme.color.onBackground,
    });
  }

  get saveIconStyle() {
    return mergeStyles(styles.saveIcon, {
      color: this.theme.color.primaryHighlight,
    });
  }

  get iconDeleteStyle() {
    return mergeStyles(styles.iconDelete, {
      color: this.theme.color.danger,
    });
  }

  get domainItemSelectorWrapperStyle() {
    return {
      borderColor: this.theme.color.border,
    };
  }

  render() {
    return (
      <ScreenWrapper>
        <Container flex safeTopLayout>
          <View style={styles.container}>
            {!this.props.back && (
              <Container noBackground style={styles.iconBackWrapper}>
                <IconButton
                  bundle={BundleIconSetName.MATERIAL_ICONS}
                  name="keyboard-backspace"
                  iconStyle={styles.iconBack}
                  style={styles.iconBackContainer}
                  onPress={pop}
                />
              </Container>
            )}

            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="interactive"
              bounces={false}>
              <View style={styles.mainContent}>
                <Typography
                  type={TypographyType.DISPLAY_SMALL}
                  style={styles.heading}>
                  {this.props.t('domainSelector:title')}
                </Typography>
                <Typography
                  type={TypographyType.LABEL_MEDIUM_TERTIARY}
                  style={styles.subHeading}>
                  {this.props.t('domainSelector:label')}
                </Typography>

                <DomainInput
                  innerRef={this.refAPIDomainInput}
                  value={
                    this.state[this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName]
                  }
                  iconName={this.DOMAIN_ATTRIBUTE.API_DOMAIN.iconName}
                  iconColor={this.DOMAIN_ATTRIBUTE.API_DOMAIN.color}
                  tag={this.getDomainTag(
                    this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
                  )}
                  placeholder={this.props.t(
                    'domainSelector:placeholder.apiDomain',
                  )}
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(
                      this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
                      value,
                    )
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(
                      this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
                      '',
                    )
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      this.DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName,
                    )
                  }
                />

                <DomainInput
                  innerRef={this.refImageDomainInput}
                  value={
                    this.state[
                      this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName
                    ]
                  }
                  iconName={this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.iconName}
                  iconColor={this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.color}
                  tag={this.getDomainTag(
                    this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
                  )}
                  placeholder={this.props.t(
                    'domainSelector:placeholder.imageDomain',
                  )}
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(
                      this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
                      value,
                    )
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(
                      this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
                      '',
                    )
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN
                        .isShowSelectorParamName,
                    )
                  }
                />

                <DomainInput
                  innerRef={this.refSocialDomainInput}
                  value={
                    this.state[
                      this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName
                    ]
                  }
                  iconName={this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.iconName}
                  iconColor={this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.color}
                  tag={this.getDomainTag(
                    this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
                  )}
                  placeholder={this.props.t(
                    'domainSelector:placeholder.socialDomain',
                  )}
                  containerStyle={styles.domainInput}
                  onChangeText={(value) =>
                    this.onChangeDomainName(
                      this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
                      value,
                    )
                  }
                  onSubmitEditing={this.changeDomain.bind(this)}
                  onClearText={() =>
                    this.onChangeDomainName(
                      this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
                      '',
                    )
                  }
                  onPressShowMore={() =>
                    this.handleShowMoreAPIDomain(
                      this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN
                        .isShowSelectorParamName,
                    )
                  }
                />

                <TextButton
                  typoProps={{type: TypographyType.LABEL_MEDIUM_TERTIARY}}
                  onPress={this.checkSave.bind(this)}
                  style={styles.saveContainer}
                  titleStyle={styles.saveTxt}
                  renderIconRight={this.renderIconCheckSave}>
                  {this.props.t('domainSelector:save')}
                </TextButton>

                {this.renderHistory()}
                {this.renderNote()}
              </View>
            </ScrollView>

            <Container
              noBackground
              safeLayout={!store.keyboardTop}
              style={styles.comboBtnContainer}>
              <Button
                neutral
                containerStyle={styles.ignoreContainer}
                btnContainerStyle={styles.ignoreBtn}
                title={this.props.t('rateApp:btn.cancel')}
                onPress={this.ignoreDomainChanging.bind(this)}
              />
              <Button
                containerStyle={styles.btnContainer}
                title={this.props.t('vndWallet:detailHistory.change')}
                disabled={this.isDisabled}
                onPress={this.changeDomain.bind(this)}
              />
            </Container>
            {appConfig.device.isIOS && <KeyboardSpacer />}
          </View>

          <AwesomeCombo
            parentRef={this.refAPIDomainInput}
            data={this.API_DOMAIN_OPTIONS}
            show={
              this.state[
                this.DOMAIN_ATTRIBUTE.API_DOMAIN.isShowSelectorParamName
              ]
            }
            useParentWidth
            onSelect={(domain) =>
              this.handleSelectAPIDomain(
                this.DOMAIN_ATTRIBUTE.API_DOMAIN.domainParamName,
                domain,
              )
            }
            onClose={this.closeDomainSelector}
            renderCustomItem={this.renderDomainItemSelector}
          />
          <AwesomeCombo
            parentRef={this.refImageDomainInput}
            data={this.IMAGE_DOMAIN_OPTIONS}
            show={
              this.state[
                this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.isShowSelectorParamName
              ]
            }
            useParentWidth
            onSelect={(domain) =>
              this.handleSelectAPIDomain(
                this.DOMAIN_ATTRIBUTE.IMAGE_DOMAIN.domainParamName,
                domain,
              )
            }
            onClose={this.closeDomainSelector}
            renderCustomItem={this.renderDomainItemSelector}
          />
          <AwesomeCombo
            parentRef={this.refSocialDomainInput}
            data={this.SOCIAL_DOMAIN_OPTIONS}
            show={
              this.state[
                this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.isShowSelectorParamName
              ]
            }
            useParentWidth
            onSelect={(domain) =>
              this.handleSelectAPIDomain(
                this.DOMAIN_ATTRIBUTE.SOCIAL_DOMAIN.domainParamName,
                domain,
              )
            }
            onClose={this.closeDomainSelector}
            renderCustomItem={this.renderDomainItemSelector}
          />
        </Container>
      </ScreenWrapper>
    );
  }
}

export default withTranslation('rateApp, vndWallet, domainSelector')(
  observer(DomainSelector),
);
