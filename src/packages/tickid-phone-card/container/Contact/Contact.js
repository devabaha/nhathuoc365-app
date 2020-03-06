import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  FlatList,
  StyleSheet,
  Platform,
  SafeAreaView,
  RefreshControl,
  Linking,
  View,
  Text,
  PermissionsAndroid
} from 'react-native';
import config from '../../config';
import update from 'immutability-helper';
import Button from 'react-native-button';
import Contacts from 'react-native-contacts';
import debounce from '../../helper/debounce';
import ContactEntity from '../../entity/Contact';
import SearchComponent from '../../component/Search';
import LoadingComponent from '@tickid/tickid-rn-loading';
import ContactItemComponent from '../../component/ContactItem';
import AsyncStorage from '@react-native-community/async-storage';
import ModalAllowPermisson from '../../component/ModalAllowPermisson';
import AndroidOpenSettings from 'react-native-android-open-settings';

const INIT_PAGE = 1;
const CONTACTS_PER_PAGE = 20;
const CONTACTS_STORAGE_KEY = 'CONTACTS_STORAGE_KEY';

class Contact extends Component {
  static propTypes = {
    onPressContact: PropTypes.func
  };

  static defaultProps = {
    onPressContact: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      contactsToRender: [],
      searchResult: [],
      refreshing: false,
      showLoading: false,
      isNotAccessToContact: false,
      showAllowContactPermission: false,
      currentPage: INIT_PAGE,
      searchText: ''
    };
  }

  get hasSearchResult() {
    return this.state.searchResult.length > 0;
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
    EventTracker.logEvent('contact_page');
  }

  handleCheckPermissonAndroid = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'Danh bạ',
      message:
        'Cho phép truy cập danh bạ sẽ giúp bạn chọn nhanh và chính xác thông tin'
    }).then(async error => {
      switch (error) {
        case 'never_ask_again':
          this.setState({
            showAllowContactPermission: true,
            isNotAccessToContact: true,
            nerverAskAgain: true
          });
          break;
        case 'denied':
          this.setState({
            showAllowContactPermission: true,
            isNotAccessToContact: true
          });
          break;
        default:
          this.getListContacts();
          this.setState({
            showAllowContactPermission: false,
            isNotAccessToContact: false
          });
      }
    });
  };

  handleCheckPermissonIOS = async permission => {
    switch (permission) {
      case 'authorized':
        await this.loadStoredContacts();
        this.getListContacts(false);
        break;
      case 'undefined':
        Contacts.requestPermission((err, permission) =>
          this.handleCheckPermissonIOS(permission)
        );
        break;
      case 'denied':
        this.setState({
          showAllowContactPermission: true,
          isNotAccessToContact: true
        });
        break;
    }
  };

  handleOpenAllowContactPermission = () => {
    if (Platform.OS === 'android') {
      AndroidOpenSettings.appDetailsSettings();
    } else {
      Linking.canOpenURL('app-settings:')
        .then(supported => {
          if (!supported) {
            console.log("Can't handle settings url");
          } else {
            return Linking.openURL('app-settings:');
          }
        })
        .catch(err => console.error('An error occurred', err));
    }
  };

  loadStoredContacts = async () => {
    await this.setState({
      showLoading: true
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
        showLoading: true
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
        showLoading: false
      });
    }
  };

  mapContactsToState = contacts => {
    this.setState({
      refreshing: false,
      showLoading: false,
      contacts: contacts.map(contact => new ContactEntity(contact)),
      contactsToRender: contacts
        .slice(0, CONTACTS_PER_PAGE)
        .map(contact => new ContactEntity(contact))
    });
  };

  saveContactsToStorage = async contacts => {
    try {
      await AsyncStorage.setItem(
        CONTACTS_STORAGE_KEY,
        JSON.stringify(contacts)
      );
    } catch (error) {
      console.log(error);
    }
  };

  onRefresh = () => {
    this.setState({
      refreshing: true,
      currentPage: INIT_PAGE
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
        keyExtractor={item => `${item.id}`}
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
      prevState => ({
        currentPage: prevState.currentPage + 1
      }),
      () => {
        const startIndex = CONTACTS_PER_PAGE * (this.state.currentPage - 1);
        const newContacts = this.state.contacts.slice(
          startIndex,
          startIndex + CONTACTS_PER_PAGE
        );
        if (newContacts.length > 0) {
          this.setState({
            contactsToRender: update(this.state.contactsToRender, {
              $push: newContacts
            })
          });
        }
      }
    );
  };

  renderContact = ({ item: contact }) => {
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

  handleChangeText = searchText => {
    if (searchText) {
      this.setState({
        searchText
      });
      this.search(searchText);
    } else {
      this.handleClearText();
    }
  };

  search = debounce(searchText => {
    let searchResult = this.state.contacts.filter(({ isMatch }) =>
      isMatch(searchText)
    );

    if (searchResult.length === 0) {
      searchResult = [
        {
          data: {
            familyName: 'Chưa có trong danh bạ'
          },
          displayPhone: searchText,
          name: 'Chưa có trong danh bạ',
          notInContact: true
        }
      ];
    }

    this.setState({
      searchResult
    });
  }, 250);

  handleClearText = () => {
    this.setState({
      searchText: '',
      searchResult: []
    });
  };

  handleCloseContactPermission = () => {
    this.setState({
      showAllowContactPermission: false
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.showLoading && <LoadingComponent loading />}

        {this.state.isNotAccessToContact ? (
          <View style={styles.allowBox}>
            <Text style={styles.allowMessage}>
              Cho phép truy cập danh bạ sẽ giúp bạn chọn nhanh và chính xác
              thông tin
            </Text>
            <Button
              containerStyle={styles.allowBtn}
              style={styles.allowText}
              onPress={this.handleOpenAllowContactPermission}
            >
              Cho phép truy cập
            </Button>
          </View>
        ) : (
          <Fragment>
            <SearchComponent
              value={this.state.searchText}
              onChangeText={this.handleChangeText}
              onClearText={this.handleClearText}
            />

            {this.renderContacts()}
          </Fragment>
        )}

        <ModalAllowPermisson
          visible={this.state.showAllowContactPermission}
          onClose={this.handleCloseContactPermission}
          onAllowAccessContacts={this.handleOpenAllowContactPermission}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  allowBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16
  },
  allowMessage: {
    fontSize: 15,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24
  },
  allowBtn: {
    marginTop: 24,
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: config.colors.primary
  },
  allowText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500'
  }
});

export default Contact;
