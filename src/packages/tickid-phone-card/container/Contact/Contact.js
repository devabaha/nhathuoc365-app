import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Platform,
  Linking,
  View,
  PermissionsAndroid,
} from 'react-native';
// 3-party libs
import Contacts from 'react-native-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AndroidOpenSettings from 'react-native-android-open-settings';
// helpers
import update from 'immutability-helper';
import debounce from 'src/packages/tickid-phone-card/helper/debounce';
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// entities
import ContactEntity from 'src/packages/tickid-phone-card/entity/Contact';
// custom components
import Button from 'src/components/Button';
import SearchComponent from 'src/packages/tickid-phone-card/component/Search';
import LoadingComponent from '@tickid/tickid-rn-loading';
import ContactItemComponent from 'src/packages/tickid-phone-card/component/ContactItem';
import ModalAllowPermisson from 'src/packages/tickid-phone-card/component/ModalAllowPermisson';
import {
  FlatList,
  RefreshControl,
  ScreenWrapper,
  Typography,
} from 'src/components/base';

const INIT_PAGE = 1;
const CONTACTS_PER_PAGE = 20;
const CONTACTS_STORAGE_KEY = 'CONTACTS_STORAGE_KEY';

class Contact extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    onPressContact: PropTypes.func,
    requestContactsPermissionTitle: PropTypes.string,
    requestContactsPermissionMessage: PropTypes.string,
    notInContactsFamilyName: PropTypes.string,
    allowAccessContactsMessage: PropTypes.string,
    searchContactsPlaceholder: PropTypes.string,
  };

  static defaultProps = {
    onPressContact: () => {},
  };

  state = {
    contacts: [],
    contactsToRender: [],
    searchResult: [],
    refreshing: false,
    showLoading: false,
    isNotAccessToContact: false,
    showAllowContactPermission: false,
    currentPage: INIT_PAGE,
    searchText: '',
  };
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get hasSearchResult() {
    return this.state.searchResult.length > 0;
  }

  get requestContactsPermissionTitle() {
    return this.props.requestContactsPermissionTitle || this.props.t('title');
  }

  get requestContactsPermissionMessage() {
    return (
      this.props.requestContactsPermissionMessage ||
      this.props.t('requestContactsPermission.message')
    );
  }

  get notInContactsFamilyName() {
    return (
      this.props.notInContactsFamilyName ||
      this.props.t('notInContactsFamilyName')
    );
  }

  get allowAccessContactsMessage() {
    return (
      this.props.allowAccessContactsMessage ||
      this.props.t('requestContactsPermission.allowAccessContacts')
    );
  }

  get searchContactsPlaceholder() {
    console.log(this.props);
    return (
      this.props.searchContactsPlaceholder ||
      this.props.t('searchContactsPlaceholder')
    );
  }

  componentDidMount() {
    if (Platform.OS === 'ios') {
      Contacts.checkPermission(async (err, permission) => {
        if (err) throw err;

        this.handleCheckPermissonIOS(permission);
      });
    } else {
      this.handleCheckPermissonAndroid();
    }

    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  handleCheckPermissonAndroid = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: this.requestContactsPermissionTitle,
      message: this.requestContactsPermissionMessage,
    }).then(async (error) => {
      switch (error) {
        case 'never_ask_again':
          this.setState({
            showAllowContactPermission: true,
            isNotAccessToContact: true,
            nerverAskAgain: true,
          });
          break;
        case 'denied':
          this.setState({
            showAllowContactPermission: true,
            isNotAccessToContact: true,
          });
          break;
        default:
          this.getListContacts();
          this.setState({
            showAllowContactPermission: false,
            isNotAccessToContact: false,
          });
      }
    });
  };

  handleCheckPermissonIOS = async (permission) => {
    switch (permission) {
      case 'authorized':
        await this.loadStoredContacts();
        this.getListContacts(false);
        break;
      case 'undefined':
        Contacts.requestPermission((err, permission) =>
          this.handleCheckPermissonIOS(permission),
        );
        break;
      case 'denied':
        this.setState({
          showAllowContactPermission: true,
          isNotAccessToContact: true,
        });
        break;
    }
  };

  handleOpenAllowContactPermission = () => {
    if (Platform.OS === 'android') {
      AndroidOpenSettings.appDetailsSettings();
    } else {
      Linking.canOpenURL('app-settings:')
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle settings url");
          } else {
            return Linking.openURL('app-settings:');
          }
        })
        .catch((err) => console.error('An error occurred', err));
    }
  };

  loadStoredContacts = async () => {
    await this.setState({
      showLoading: true,
    });

    try {
      const contactsString = await AsyncStorage.getItem(CONTACTS_STORAGE_KEY);
      const contacts = JSON.parse(contactsString);
      if (Array.isArray(contacts) && contacts.length > 0) {
        this.mapContactsToState(contacts);
        return true;
      }
    } catch (error) {
      console.log(error);
    }
    return false;
  };

  getListContacts = (showLoading = true) => {
    if (showLoading) {
      this.setState({
        showLoading: true,
      });
    }

    try {
      Contacts.getAll((err, contacts) => {
        if (err) throw err;
        this.saveContactsToStorage(contacts);
        this.mapContactsToState(contacts);
      });
    } catch (error) {
      this.setState({
        refreshing: false,
        showLoading: false,
      });
    }
  };

  mapContactsToState = (contacts) => {
    this.setState({
      refreshing: false,
      showLoading: false,
      contacts: contacts.map((contact) => new ContactEntity(contact)),
      contactsToRender: contacts
        .slice(0, CONTACTS_PER_PAGE)
        .map((contact) => new ContactEntity(contact)),
    });
  };

  saveContactsToStorage = async (contacts) => {
    try {
      await AsyncStorage.setItem(
        CONTACTS_STORAGE_KEY,
        JSON.stringify(contacts),
      );
    } catch (error) {
      console.log(error);
    }
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
      currentPage: INIT_PAGE,
    });

    setTimeout(() => {
      this.getListContacts(false); // false is not show loading
    }, 1000);
  };

  renderContacts = () => {
    const dataToRender = this.hasSearchResult
      ? this.state.searchResult
      : this.state.contactsToRender;
    return (
      <FlatList
        keyboardDismissMode={Platform.OS === 'ios' ? 'on-drag' : 'interactive'}
        data={dataToRender}
        keyExtractor={(item) => `${item.id}`}
        renderItem={this.renderContact}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={this.onLoadMoreContacts}
      />
    );
  };

  onLoadMoreContacts = () => {
    this.setState(
      (prevState) => ({
        currentPage: prevState.currentPage + 1,
      }),
      () => {
        const startIndex = CONTACTS_PER_PAGE * (this.state.currentPage - 1);
        const newContacts = this.state.contacts.slice(
          startIndex,
          startIndex + CONTACTS_PER_PAGE,
        );
        if (newContacts.length > 0) {
          this.setState({
            contactsToRender: update(this.state.contactsToRender, {
              $push: newContacts,
            }),
          });
        }
      },
    );
  };

  renderContact = ({item: contact}) => {
    return (
      <ContactItemComponent
        hasThumbnail={contact.data.hasThumbnail}
        thumbnailPath={contact.data.thumbnailPath}
        familyName={contact.data.familyName}
        givenName={contact.data.givenName}
        displayPhone={contact.displayPhone}
        notInContact={contact.notInContact}
        onPress={() => this.props.onPressContact(contact)}
      />
    );
  };

  handleChangeText = (searchText) => {
    if (searchText) {
      this.setState({
        searchText,
      });
      this.search(searchText);
    } else {
      this.handleClearText();
    }
  };

  search = debounce((searchText) => {
    let searchResult = this.state.contacts.filter(({isMatch}) =>
      isMatch(searchText),
    );

    if (searchResult.length === 0) {
      searchResult = [
        {
          data: {
            familyName: this.notInContactsFamilyName,
          },
          displayPhone: searchText,
          name: this.notInContactsFamilyName,
          notInContact: true,
        },
      ];
    }

    this.setState({
      searchResult,
    });
  }, 250);

  handleClearText = () => {
    this.setState({
      searchText: '',
      searchResult: [],
    });
  };

  handleCloseContactPermission = () => {
    this.setState({
      showAllowContactPermission: false,
    });
  };

  render() {
    return (
      <ScreenWrapper>
        {this.state.showLoading && <LoadingComponent loading />}

        {this.state.isNotAccessToContact ? (
          <View style={styles.allowBox}>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              style={styles.allowMessage}>
              {this.props.requestContactsPermissionMessage}
            </Typography>
            <Button
              containerStyle={styles.allowBtn}
              onPress={this.handleOpenAllowContactPermission}>
              {this.allowAccessContactsMessage}
            </Button>
          </View>
        ) : (
          <Fragment>
            <SearchComponent
              value={this.state.searchText}
              onChangeText={this.handleChangeText}
              onClearText={this.handleClearText}
              placeholder={this.searchContactsPlaceholder}
            />

            {this.renderContacts()}
          </Fragment>
        )}

        <ModalAllowPermisson
          visible={this.state.showAllowContactPermission}
          onClose={this.handleCloseContactPermission}
          onAllowAccessContacts={this.handleOpenAllowContactPermission}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  allowBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  allowMessage: {
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
  },
  allowBtn: {
    marginTop: 24,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
});

export default withTranslation('phoneCardContact')(Contact);
