import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Keyboard
} from 'react-native';
import PropTypes from 'prop-types';
import Modal from 'react-native-modalbox';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Row from './Row';
import appConfig from 'app-config';
import EventTracker from '../../helper/EventTracker';

const API_KEYS = 'AIzaSyBZfS1WyeCgdWk9D6RVMT65RXl5ZOptJAQ';

class PlacesAutoComplete extends Component {
  static propTypes = {
    minLengthToSearch: PropTypes.number,
    onPressItem: PropTypes.func
  };

  static defaultProps = {
    minLengthToSearch: 2,
    onPressItem: () => {}
  };

  state = {
    animatedClear: new Animated.Value(0),
    showResult: false,
    textSearch: ''
  };
  refAutoComplete = React.createRef();
  ref_modal = React.createRef();
  eventTracker = new EventTracker();

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.showResult !== this.state.showResult) {
      Animated.spring(this.state.animatedClear, {
        toValue: nextState.showResult ? 1 : 0,
        useNativeDriver: true
      }).start();
    }
    if (nextProps !== this.props) {
      return true;
    }

    if (nextState !== this.state) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handleChangeText(textSearch) {
    const state = { textSearch };
    if (textSearch.length >= this.props.minLengthToSearch) {
      state.showResult = true;
    }

    if (!!!textSearch) {
      state.showResult = false;
    }

    this.setState(state);
  }

  clearText() {
    if (this.refAutoComplete.current) {
      if (this.refAutoComplete.current) {
        this.refAutoComplete.current._handleChangeText('');
        if (this.refAutoComplete.current.refs.textInput) {
          this.refAutoComplete.current.refs.textInput.focus();
        }
      }
    }
  }

  onClose = () => {
    Keyboard.dismiss();
    if (this.ref_modal.current) {
      this.ref_modal.current.close();
    }
  };

  onPressItem(data, details) {
    this.onClose();
    this.props.onPressItem(this.formatdata(data, details));
  }

  formatdata(data, details) {
    let country = '';
    let detail_address = {
      description: '',
      district: '',
      city: ''
    };
    let map_address = {
      description: '',
      lat: '',
      lng: ''
    };

    if (data.description) {
      let detail_map_address = '';
      detail_address.description = data.structured_formatting.main_text || '';
      detail_map_address = data.structured_formatting.secondary_text || '';

      details.address_components.some(add =>
        add.types.some(type => {
          if (type === 'country') {
            country = add.long_name;
            return true;
          }
        })
      );

      if (country) {
        detail_map_address += ', ' + country;
      }

      if (detail_map_address) {
        detail_map_address =
          detail_address.description + ', ' + detail_map_address;
      }

      map_address.description = detail_map_address;
    }

    if (details.geometry) {
      if (details.geometry.location) {
        map_address.lat = details.geometry.location.lat.toString();
        map_address.lng = details.geometry.location.lng.toString();
      }
    }

    if (details.address_components) {
      details.address_components.forEach(addComp => {
        addComp.types.forEach(type => {
          if (type === 'administrative_area_level_1') {
            detail_address.city = addComp.long_name;
          }
          if (type === 'administrative_area_level_2') {
            detail_address.district = addComp.long_name;
          }
        });
      });
    }

    return { detail_address, map_address };
  }

  onPressOutSide() {
    Keyboard.dismiss();
  }

  renderClearButton() {
    const extraStyle = {
      transform: [
        {
          translateX: this.state.animatedClear.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0]
          })
        }
      ],
      opacity: this.state.animatedClear
    };

    return (
      <Animated.View style={[styles.clearContainer, extraStyle]}>
        <TouchableOpacity onPress={this.clearText.bind(this)}>
          <Icon name="close-circle" style={styles.clearIcon} />
        </TouchableOpacity>
      </Animated.View>
    );
  }

  renderRow(row) {
    const title = row.structured_formatting
      ? row.structured_formatting.main_text
        ? row.structured_formatting.main_text
        : row.description
      : row.description;

    const description = row.structured_formatting
      ? row.structured_formatting.secondary_text
        ? row.structured_formatting.secondary_text
        : ''
      : '';

    return (
      <Row
        textSearch={this.state.textSearch}
        title={title}
        description={description}
      />
    );
  }

  // renderFooter() {
  //     const condition = !!this.state.textSearch.length &&
  //         (this.state.textSearch.length >= this.props.minLengthToSearch);

  //     return condition && <TouchableOpacity
  //         style={styles.footerContainer}
  //         onPress={() => this.onPressItem(null, { formatted_address: this.state.textSearch })}
  //     >
  //         <Row
  //             textSearch={this.state.textSearch}
  //             title={this.state.textSearch}
  //         />
  //     </TouchableOpacity>
  // }

  render() {
    const { t, i18n, minLengthToSearch } = this.props;
    return (
      <Modal
        entry="bottom"
        position="bottom"
        style={[styles.modal]}
        animationDuration={200}
        backButtonClose
        ref={this.ref_modal}
        isOpen
        swipeToClose={false}
        onClosed={this.props.onCloseModal}
        useNativeDriver
        easing={Easing.bezier(0.54, 0.96, 0.74, 1.01)}
      >
        <TouchableWithoutFeedback onPress={this.onPressOutSide.bind(this)}>
          <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                onPress={this.onClose}
                style={styles.iconContainer}
              >
                <Icon name="close" style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.heading}>
                {t('common:screen.searchPlaces.mainTitle')}
              </Text>
            </View>
            <GooglePlacesAutocomplete
              ref={this.refAutoComplete}
              placeholder={t('input.placeholder')}
              minLength={minLengthToSearch} // minimum length of text to search
              autoFocus={true}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              listViewDisplayed={this.state.showResult} // true/false/undefined
              fetchDetails={true}
              renderRow={row => this.renderRow(row)}
              // renderDescription={row => this.renderDescription(row)} // custom description render
              onPress={(data, details = null) => {
                // 'details' is provided when fetchDetails = true
                this.onPressItem(data, details);
                // console.log(data, details);
              }}
              getDefaultValue={() => ''}
              query={{
                // available options: https://developers.google.com/places/web-service/autocomplete
                key: API_KEYS,
                region: 'vn',
                language: i18n.language // language of the results
                // types: 'address' // default: 'geocode'
              }}
              // ListFooterComponent={() => this.renderFooter()}
              styles={{
                row: styles.rowContainer,
                loader: styles.loader,
                textInputContainer: styles.textInputContainer,
                textInput: styles.textInput,
                description: styles.rowContent,
                separator: styles.separator,
                predefinedPlacesDescription: styles.rowContentPredefined,
                listView: styles.listView
              }}
              enablePoweredByContainer={false}
              placeholderTextColor={appConfig.colors.placeholder}
              textInputProps={{
                clearButtonMode: 'never',
                onChangeText: this.handleChangeText.bind(this),
                onBlur: () => {}
              }}
              renderRightButton={this.renderClearButton.bind(this)}
              currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
              // currentLocationLabel="Current location"
              nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
              GoogleReverseGeocodingQuery={
                {
                  // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                }
              }
              GooglePlacesSearchQuery={
                {
                  // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                  // rankby: 'prominence',
                  // pageToken: 1
                  // type: 'address'
                }
              }
              GooglePlacesDetailsQuery={{
                // available options for GooglePlacesDetails API : https://developers.google.com/places/web-service/details
                fields: 'formatted_address,geometry,address_component,name'
              }}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3'
              ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[workPlace]}

              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              // renderLeftButton={() => <Image source={require('path/custom/left-icon')} />}
              // renderRightButton={() => <Text>Custom text after the input</Text>}
            />
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: 'hidden',
    height: '70%'
  },
  container: {
    flex: 1
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#fafafa',
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    alignItems: 'center',
    zIndex: 1
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 30,
    height: 30,
    left: 15,
    top: 15,
    justifyContent: 'center'
  },
  icon: {
    fontSize: 22,
    color: '#666'
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500'
  },
  footerContainer: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    padding: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ddd'
  },
  content: {
    flexDirection: 'row'
  },
  rowContainer: {
    paddingVertical: 11,
    height: null
  },
  textInputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    height: null,
    marginTop: 0,
    borderTopWidth: 0,
    paddingVertical: 10,
    shadowColor: '#000',
    borderLeftWidth: 5,
    borderColor: hexToRgbA(DEFAULT_COLOR, 0.9),
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,

    elevation: 5
  },
  textInput: {
    marginTop: 0,
    height: 30,
    paddingLeft: 10,
    marginLeft: 0,
    paddingRight: 30,
    borderRadius: 0,
    backgroundColor: '#fff'
  },
  listView: {
    flex: 1
  },
  rowContent: {
    width: '100%'
  },
  rowContentPredefined: {
    color: DEFAULT_COLOR
  },
  separator: {
    marginLeft: 13
  },
  loader: {
    marginRight: 5
  },
  clearContainer: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    right: 15
  },
  clearIcon: {
    fontSize: 16,
    color: '#888'
  }
});

export default withTranslation(['searchPlaces', 'common'])(PlacesAutoComplete);
