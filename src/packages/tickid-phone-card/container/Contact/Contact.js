import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FlatList, StyleSheet, Platform, SafeAreaView } from 'react-native';
import Contacts from 'react-native-contacts';
import SearchComponent from '../../component/Search';
import ContactItemComponent from '../../component/ContactItem';
import LoadingComponent from '@tickid/tickid-rn-loading';
import update from 'immutability-helper';
import debounce from '../../helper/debounce';
import ContactEntity from '../../entity/Contact';

const INIT_PAGE = 1;
const CONTACTS_PER_PAGE = 20;

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
      showLoading: false,
      currentPage: INIT_PAGE,
      searchText: ''
    };
  }

  get hasSearchResult() {
    return this.state.searchResult.length > 0;
  }

  componentDidMount() {
    this.getListContacts();
  }

  getListContacts = () => {
    this.setState({
      showLoading: true
    });

    try {
      Contacts.getAll((err, contacts) => {
        if (err) {
          throw err;
        }
        this.setState({
          showLoading: false,
          contacts: contacts.map(contact => new ContactEntity(contact)),
          contactsToRender: contacts
            .slice(0, CONTACTS_PER_PAGE)
            .map(contact => new ContactEntity(contact))
        });
      });
    } catch (error) {
      this.setState({
        showLoading: false
      });
    }
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
    this.setState({
      searchResult: this.state.contacts.filter(({ isMatch }) =>
        isMatch(searchText)
      )
    });
  }, 250);

  handleClearText = () => {
    this.setState({
      searchText: '',
      searchResult: []
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.showLoading && <LoadingComponent loading />}

        <SearchComponent
          value={this.state.searchText}
          onChangeText={this.handleChangeText}
          onClearText={this.handleClearText}
        />

        {this.renderContacts()}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Contact;
