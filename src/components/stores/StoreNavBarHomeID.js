import React, {Component} from 'react';
import appConfig from 'app-config';
import PropTypes from 'prop-types';
import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {ifIphoneX} from 'react-native-iphone-x-helper';
import Icon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import RightButtonOrders from '../RightButtonOrders';
import AwesomeCombo from '../AwesomeCombo';
import store from 'app-store';
import {servicesHandler} from '../../helper/servicesHandler';

const defaultListener = () => {};
class StoreNavBarHomeID extends Component {
  static propTypes = {
    onCancel: PropTypes.func,
    onSearch: PropTypes.func,
    onClearText: PropTypes.func,
    placeholder: PropTypes.string,
    searchValue: PropTypes.string,
  };

  static defaultProps = {
    onCancel: defaultListener,
    onSearch: defaultListener,
    onClearText: defaultListener,
    placeholder: '',
    searchValue: '',
  };

  state = {
    showMoreCombo: false,
  };
  moreBtnRef = React.createRef();

  get isShowMoreOptions() {
    return !!this.props.moreOptions && this.props.moreOptions.length > 0;
  }

  onToggleMore = () => {
    this.setState((prevState) => ({
      showMoreCombo: !prevState.showMoreCombo,
    }));
  };

  handleSelectMoreOption = (option) => {
    servicesHandler(option.service);
    this.onToggleMore();
  };

  renderLeft() {
    const BackIcon = appConfig.device.isIOS ? Ionicons : Icon;
    const iconName = appConfig.device.isIOS ? 'ios-arrow-back' : 'arrow-left';
    const iconSize = appConfig.device.isIOS ? 30 : 25;
    const pressColor = 'rgba(0,0,0,.32)';

    /*
     * TouchableNativeFeedback.Ripple causes a crash on old Android versions,
     * therefore only enable it on Android Lollipop and above.
     *
     * All touchables on Android should have the ripple effect according to
     * platform design guidelines.
     * We need to pass the background prop to specify a borderless ripple effect.
     */
    if (Platform.OS === 'android' && Platform.Version >= 21) {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            Actions.pop();
            this.props.onCancel();
          }}
          background={TouchableNativeFeedback.Ripple(pressColor, true)}
          accessible
          accessibilityComponentType="button">
          <View style={[styles.cancelButton, {borderRadius: 20}]}>
            <BackIcon
              size={iconSize}
              color="#fff"
              style={styles.searchIcon}
              name={iconName}
            />
          </View>
        </TouchableNativeFeedback>
      );
    }
    return (
      <Button
        containerStyle={styles.cancelButton}
        onPress={() => {
          Actions.pop();
          this.props.onCancel();
        }}>
        <BackIcon
          size={iconSize}
          color="#fff"
          style={styles.searchIcon}
          name={iconName}
        />
      </Button>
    );
  }

  renderMiddle() {
    return (
      <TouchableHighlight
        hitSlop={HIT_SLOP}
        onPress={this.props.onPressSearch}
        underlayColor="rgba(0,0,0,.6)"
        style={styles.searchWrapper}>
        <View
          pointerEvents="none"
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{paddingBottom: 2, alignItems: 'center'}}>
            <Icon
              size={20}
              color="#ccc"
              style={styles.searchIcon}
              name="search"
            />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder={this.props.placeholder}
            placeholderTextColor={appConfig.colors.placeholder}
            onChangeText={this.props.onSearch}
            value={this.props.searchValue}
            editable={false}
          />
        </View>
      </TouchableHighlight>
    );
  }

  renderRight() {
    return (
      <View style={[styles.right_btn_box]}>
        <RightButtonOrders tel={store.store_data.tel} />
        {this.isShowMoreOptions && (
          <View collapsable={false} ref={this.moreBtnRef}>
            <TouchableOpacity onPress={this.onToggleMore}>
              <Icon name="more-horizontal" style={styles.iconMore} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  render() {
    return (
      <>
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.container}>
            {this.renderLeft()}
            {this.renderMiddle()}
            {this.renderRight()}
          </View>
        </SafeAreaView>
        {this.isShowMoreOptions && (
          <AwesomeCombo
            parentRef={this.moreBtnRef}
            data={this.props.moreOptions}
            show={this.state.showMoreCombo}
            onSelect={this.handleSelectMoreOption}
            onClose={this.onToggleMore}
          />
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 999,
    width: '100%',
    position: appConfig.device.isIOS ? 'relative' : 'absolute',
  },
  container: {
    position: appConfig.device.isIOS ? 'absolute' : 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancelButton: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  cancelText: {
    fontSize: 16,
    color: '#fff',
  },
  searchIcon: {
    position: 'relative',
    top: 2,
  },
  clearWrapper: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  searchWrapper: {
    zIndex: 999,
    flex: 1,
    height: 38,
    alignSelf: 'flex-end',
    // width: '100%',
    paddingLeft: 10,
    // maxWidth: appConfig.device.width - 100,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#696969',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // marginRight: 15,
    ...ifIphoneX(
      {
        marginTop: 4,
        marginBottom: 8,
      },
      {
        marginVertical: Platform.OS === 'ios' ? 6 : 8,
      },
    ),
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-end',
    color: appConfig.colors.white,
  },
  right_btn_box: {
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  iconMore: {
    fontSize: 22,
    color: '#fff',
    ...elevationShadowStyle(7),
    marginLeft: 10,
  },
});

export default withTranslation('stores')(StoreNavBarHomeID);
