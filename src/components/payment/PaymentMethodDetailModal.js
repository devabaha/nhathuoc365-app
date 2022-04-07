import React, {PureComponent} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import Image from 'src/components/Image';
import {
  Container,
  ScreenWrapper,
  Icon,
  FlatList,
  Input,
  RefreshControl,
  Typography,
  BaseButton,
} from 'src/components/base';

const NUM_COLUMS = 3;
const LIST_PAYMENT_METHOD_DETAIL = [
  {
    id: 0,
    name: 'MBBank',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/2/25/Logo_MB_new.png',
  },
  {
    id: 1,
    name: 'Agribank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/07/Agribank-logo-400x400.png',
  },
  {
    id: 2,
    name: 'Vietcombank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/07/vietcombank-vector-logo.png',
  },
  {
    id: 3,
    name: 'BIDV',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/07/BIDV-logo-400x400.png',
  },
  {
    id: 4,
    name: 'Vietinbank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/01/vietinbank-logo-vector-download-400x400.jpg',
  },
  {
    id: 5,
    name: 'Techcombank',
    image:
      'https://seeklogo.net/wp-content/uploads/2016/11/techcombank-logo-preview-400x400.png',
  },
  {
    id: 6,
    name: 'ACB',
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Asia_Commercial_Bank_logo.svg/1200px-Asia_Commercial_Bank_logo.svg.png',
  },
  {
    id: 7,
    name: 'VPBank',
    image:
      'https://vignette.wikia.nocookie.net/logopedia/images/4/44/VPBank_Ng%C3%A2n_H%C3%A0ng_Vi%E1%BB%87t_Nam_Th%E1%BB%8Bnh_V%C6%B0%E1%BB%A3ng.png/revision/latest?cb=20170204083549',
  },
];

class PaymentMethodDetailModal extends PureComponent {
  static contextType = ThemeContext;

  static propTypes = {
    siteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    paymentMethodId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onPressPaymentMethodDetail: PropTypes.func,
  };

  static defaultProps = {
    siteId: store?.store_data?.id,
    onPressPaymentMethodDetail: () => {},
  };

  state = {
    text: '',
    searchData: null,
    data: [],
    isLoading: true,
    refreshing: false,
  };
  getPaymentMethodDetailRequest = new APIRequest();
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.getPaymentMethodDetail();
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

  async getPaymentMethodDetail() {
    const {t} = this.props;
    const data = {
      payment_id: this.props.paymentMethodId,
    };
    this.getPaymentMethodDetailRequest.data = APIHandler.payment_method_detail(
      this.props.siteId,
      data,
    );

    try {
      const response = await this.getPaymentMethodDetailRequest.promise();
      console.log(response, data);

      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({data: response.data.list});
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (err) {
      console.log('get_payment_method_detail', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({
        isLoading: false,
        refreshing: false,
      });
    }
  }

  onChangeText = (text) => {
    this.setState({text});
    this.searchPaymentMethodDetail(text);
  };

  searchPaymentMethodDetail = (searchValue = '') => {
    if (searchValue) {
      const searchData = this.state.data.filter(
        (paymentMethodDetail) =>
          paymentMethodDetail.name
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase()) ||
          paymentMethodDetail.short_name
            .toLowerCase()
            .includes(searchValue.trim().toLowerCase()),
      );
      this.setState({searchData});
    } else {
      this.setState({searchData: null});
    }
  };

  onPressPaymentMethodDetail = (item) => {
    this.props.onPressPaymentMethodDetail(item);
    pop();
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getPaymentMethodDetail();
  };

  renderPaymentMethodDetail(data, {item, index}) {
    const isRightOutermost = (index + 1) % NUM_COLUMS === 0;
    const isLastRow =
      index >=
        (data.length % NUM_COLUMS === 0
          ? data.length - NUM_COLUMS
          : Math.floor(data.length / NUM_COLUMS) * NUM_COLUMS) ||
      data.length <= NUM_COLUMS;

    return (
      <BaseButton
        useTouchableHighlight
        onPress={() => this.onPressPaymentMethodDetail(item)}
        style={styles.itemContainer}>
        <View style={styles.itemWrapper}>
          {!isRightOutermost && (
            <View style={this.borderRightContainerStyle}>
              <View style={this.borderRightStyle} />
            </View>
          )}
          <View style={[styles.itemInnerWrapper]}>
            <View style={styles.imageContainer}>
              <Image
                source={{uri: item.image}}
                resizeMode="contain"
                style={styles.image}
              />
            </View>
            <Typography
              type={TypographyType.LABEL_SEMI_MEDIUM}
              style={styles.name}>
              {item.short_name || item.name}
            </Typography>
          </View>
          {!isLastRow && <View style={this.borderBottomStyle} />}
          {!isLastRow && !isRightOutermost && (
            <View style={styles.dotContainer}>
              <View style={this.dotStyle} />
            </View>
          )}
        </View>
      </BaseButton>
    );
  }

  get searchContainerStyle() {
    return [
      styles.searchContainer,
      {
        borderBottomWidth: this.theme.layout.borderWidthSmall,
        borderColor: this.theme.color.border,
        borderRadius: this.theme.layout.borderRadiusExtraSmall,
        shadowColor: this.theme.color.shadow,
        ...this.theme.layout.shadow,
      },
    ];
  }

  get searchIconStyle() {
    return [
      styles.searchIcon,
      {
        color: this.theme.color.placeholder,
      },
    ];
  }

  get borderBottomStyle() {
    return [
      styles.borderBottom,
      {
        height: this.theme.layout.borderWidthPixel,
        backgroundColor: this.theme.color.border,
      },
    ];
  }

  get borderRightStyle() {
    return [
      styles.borderRight,
      {
        backgroundColor: this.theme.color.border,
      },
    ];
  }

  get borderRightContainerStyle() {
    return [
      styles.borderRightContainer,
      {
        width: this.theme.layout.borderWidthPixel,
      },
    ];
  }

  get dotStyle() {
    return [styles.dot, {backgroundColor: this.theme.color.border}];
  }

  render() {
    const data = this.state.searchData
      ? this.state.searchData
      : this.state.data;
    return (
      <ScreenWrapper>
        <Container flex>
          {this.state.isLoading && <Loading center />}
          <Container style={this.searchContainerStyle}>
            <Icon
              bundle={BundleIconSetName.FEATHER}
              name="search"
              style={styles.searchIcon}
            />
            <Input
              placeholder={this.props.t('detailModal.searchPlaceholder')}
              style={[
                styles.input,
                this.theme.typography[TypographyType.LABEL_SEMI_HUGE],
              ]}
              onChangeText={this.onChangeText}
              value={this.state.text}
              clearButtonMode="while-editing"
            />
          </Container>
          <FlatList
            safeLayout
            data={data}
            keyExtractor={(item, index) => index.toString()}
            numColumns={NUM_COLUMS}
            renderItem={({item, index}) =>
              this.renderPaymentMethodDetail(data, {item, index})
            }
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            ListEmptyComponent={
              !this.state.isLoading && (
                <NoResult
                  iconName={
                    this.state.text
                      ? 'magnify-close'
                      : 'credit-card-remove-outline'
                  }
                  message={
                    this.state.text
                      ? this.props.t('detailModal.informationNotFound')
                      : this.props.t('detailModal.noInformation')
                  }
                />
              )
            }
          />
        </Container>
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    zIndex: 1,
  },
  searchIcon: {
    marginHorizontal: 10,
    fontSize: 22,
  },
  input: {
    flex: 1,
  },

  itemContainer: {
    width: appConfig.device.width / NUM_COLUMS,
    height: appConfig.device.width / NUM_COLUMS,
  },
  itemWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInnerWrapper: {
    justifyContent: 'center',
    padding: 10,
  },
  imageContainer: {
    width: (appConfig.device.width / NUM_COLUMS) * 0.7,
    height: (appConfig.device.width / NUM_COLUMS) * 0.7,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    marginTop: 10,
    textAlign: 'center',
  },
  borderRightContainer: {
    position: 'absolute',
    height: '100%',
    right: -appConfig.device.pixel / 2,
    justifyContent: 'center',
  },
  borderRight: {
    height: '80%',
    width: '100%',
  },
  borderBottom: {
    position: 'absolute',
    width: '80%',
    bottom: -appConfig.device.pixel / 2,
    alignSelf: 'center',
  },
  dotContainer: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    transform: [{rotate: '45deg'}],
  },
  dot: {
    width: 2,
    height: 2,
  },
});

export default withTranslation('paymentMethod')(PaymentMethodDetailModal);
