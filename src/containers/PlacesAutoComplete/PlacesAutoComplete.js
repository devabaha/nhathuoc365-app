import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  Keyboard,
} from 'react-native';
import PropTypes from 'prop-types';
// 3-party libs
import Modal from 'react-native-modalbox';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
import EventTracker from 'app-helper/EventTracker';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import Row from './Row';
import {
  Container,
  IconButton,
  ScreenWrapper,
  Typography,
} from 'src/components/base';

const API_KEYS = 'AIzaSyBZfS1WyeCgdWk9D6RVMT65RXl5ZOptJAQ';

class PlacesAutoComplete extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    minLengthToSearch: PropTypes.number,
    onPressItem: PropTypes.func,
  };

  static defaultProps = {
    minLengthToSearch: 2,
    onPressItem: () => {},
  };

  state = {
    animatedClear: new Animated.Value(0),
    showResult: false,
    textSearch: '',
  };
  refAutoComplete = React.createRef();
  ref_modal = React.createRef();
  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.showResult !== this.state.showResult) {
      Animated.spring(this.state.animatedClear, {
        toValue: nextState.showResult ? 1 : 0,
        useNativeDriver: true,
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
    setTimeout(() => {
      if (this.refAutoComplete.current.refs.textInput) {
        this.refAutoComplete.current.refs.textInput.focus();
      }
    });
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handleChangeText(textSearch) {
    const state = {textSearch};
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
      city: '',
    };
    let map_address = {
      description: '',
      lat: '',
      lng: '',
    };

    if (data.description) {
      let detail_map_address = '';
      detail_address.description = data.structured_formatting.main_text || '';
      detail_map_address = data.structured_formatting.secondary_text || '';

      details.address_components.some((add) =>
        add.types.some((type) => {
          if (type === 'country') {
            country = add.long_name;
            return true;
          }
        }),
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
      details.address_components.forEach((addComp) => {
        addComp.types.forEach((type) => {
          if (type === 'administrative_area_level_1') {
            detail_address.city = addComp.long_name;
          }
          if (type === 'administrative_area_level_2') {
            detail_address.district = addComp.long_name;
          }
        });
      });
    }

    return {detail_address, map_address};
  }

  onPressOutSide() {
    Keyboard.dismiss();
  }

  get modalStyle() {
    return mergeStyles(styles.modal, {
      borderTopLeftRadius: this.theme.layout.borderRadiusHuge,
      borderTopRightRadius: this.theme.layout.borderRadiusHuge,
    });
  }

  get headerContainerStyle() {
    return mergeStyles(styles.headerContainer, {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.border,
    });
  }

  get textInputContainerStyle() {
    return mergeStyles(styles.textInputContainer, {
      backgroundColor: this.theme.color.surface,
      borderColor: this.theme.color.persistPrimary,
      shadowColor: this.theme.color.shadow,
      ...this.theme.layout.shadow,
    });
  }

  get textInputStyle() {
    return mergeStyles(styles.textInput, {
      backgroundColor: this.theme.color.surface,
      color: this.theme.color.textPrimary,
    });
  }

  get contentContainerStyle() {
    return {
      backgroundColor: this.theme.color.surface,
      paddingBottom: appConfig.device.bottomSpace,
    };
  }

  get rowContentPredefinedStyle() {
    return {
      color: this.theme.color.primaryHighlight,
    };
  }
  get clearBtnStyle() {
    return {
      color: this.theme.color.textTertiary,
      fontSize: 16,
    };
  }
  get placeholderTextColor() {
    return this.theme.color.placeholder;
  }

  renderClearButton() {
    const extraStyle = {
      transform: [
        {
          translateX: this.state.animatedClear.interpolate({
            inputRange: [0, 1],
            outputRange: [200, 0],
          }),
        },
      ],
      opacity: this.state.animatedClear,
    };

    return (
      <Animated.View style={[styles.clearContainer, extraStyle]}>
        <IconButton
          name="close-circle"
          bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
          iconStyle={this.clearBtnStyle}
          neutral
          onPress={this.clearText.bind(this)}
        />
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
    const {t, i18n, minLengthToSearch} = this.props;
    return (
      <Modal
        entry="bottom"
        position="bottom"
        style={this.modalStyle}
        animationDuration={200}
        backButtonClose
        ref={this.ref_modal}
        isOpen
        swipeToClose={false}
        onClosed={this.props.onCloseModal}
        useNativeDriver
        easing={Easing.bezier(0.54, 0.96, 0.74, 1.01)}>
        <TouchableWithoutFeedback onPress={this.onPressOutSide.bind(this)}>
          <ScreenWrapper style={styles.container}>
            <Container style={styles.headerContainer}>
              <IconButton
                name="close"
                bundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
                onPress={this.onClose}
                style={styles.iconContainer}
                iconStyle={styles.icon}
                neutral
              />
              <Typography
                type={TypographyType.TITLE_LARGE}
                style={styles.heading}>
                {t('common:screen.searchPlaces.mainTitle')}
              </Typography>
            </Container>
            <GooglePlacesAutocomplete
              ref={this.refAutoComplete}
              placeholder={t('input.placeholder')}
              minLength={minLengthToSearch} // minimum length of text to search
              autoFocus={true}
              returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
              keyboardAppearance={'light'} // Can be left out for default keyboardAppearance https://facebook.github.io/react-native/docs/textinput.html#keyboardappearance
              listViewDisplayed={this.state.showResult} // true/false/undefined
              fetchDetails={true}
              renderRow={(row) => this.renderRow(row)}
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
                language: i18n.language, // language of the results
                // types: 'address' // default: 'geocode'
              }}
              // ListFooterComponent={() => this.renderFooter()}
              styles={{
                row: styles.rowContainer,
                loader: styles.loader,
                textInputContainer: this.textInputContainerStyle,
                textInput: this.textInputStyle,
                description: styles.rowContent,
                separator: styles.separator,
                predefinedPlacesDescription: this.rowContentPredefinedStyle,
                listView: styles.listView,
              }}
              contentContainerStyle={this.contentContainerStyle}
              enablePoweredByContainer={false}
              placeholderTextColor={appConfig.colors.placeholder}
              textInputProps={{
                placeholderTextColor: this.placeholderTextColor,
                clearButtonMode: 'never',
                onChangeText: this.handleChangeText.bind(this),
                onBlur: () => {},
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
                fields: 'formatted_address,geometry,address_component,name',
              }}
              filterReverseGeocodingByTypes={[
                'locality',
                'administrative_area_level_3',
              ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
              // predefinedPlaces={[workPlace]}

              debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
              // renderLeftButton={() => <Image source={require('path/custom/left-icon')} />}
              // renderRightButton={() => <Text>Custom text after the input</Text>}
            />
          </ScreenWrapper>
        </TouchableWithoutFeedback>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    overflow: 'hidden',
    height: '70%',
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 15,
    alignItems: 'center',
    zIndex: 1,
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 1,
    width: 30,
    height: 30,
    left: 15,
    top: 15,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
  },
  heading: {
    textAlign: 'center',
    fontWeight: '500',
  },
  footerContainer: {
    backgroundColor: '#f9f9f9',
    width: '100%',
    padding: 15,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  content: {
    flexDirection: 'row',
  },
  rowContainer: {
    padding: 0,
    height: null,
  },
  textInputContainer: {
    width: '100%',
    height: null,
    marginTop: 0,
    borderTopWidth: 0,
    paddingVertical: 10,
    borderLeftWidth: 5,
  },
  textInput: {
    marginTop: 0,
    height: 30,
    paddingLeft: 10,
    marginLeft: 0,
    paddingRight: 30,
    borderRadius: 0,
  },
  listView: {
    flex: 1,
  },
  rowContent: {
    width: '100%',
  },
  separator: {
    marginLeft: 13,
  },
  loader: {
    marginRight: 5,
  },
  clearContainer: {
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
    right: 15,
  },
});

export default withTranslation(['searchPlaces', 'common'])(PlacesAutoComplete);
