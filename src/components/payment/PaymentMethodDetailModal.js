import React, {PureComponent} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableHighlight,
  Text,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import EventTracker from '../../helper/EventTracker';
import {APIRequest} from '../../network/Entity';
import Loading from '../Loading';
import store from 'app-store';
import NoResult from '../NoResult';

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

  componentDidMount() {
    this.getPaymentMethodDetail();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
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
    Actions.pop();
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getPaymentMethodDetail();
  };

  renderPaymentMethodDetail(data, {item, index}) {
    const isRightOutermost = (index + 1) % NUM_COLUMS === 0;
    const isLastRow =
      index >= (data.length % NUM_COLUMS) * NUM_COLUMS ||
      data.length < NUM_COLUMS;

    return (
      <TouchableHighlight
        underlayColor="#bababa"
        onPress={() => this.onPressPaymentMethodDetail(item)}
        style={styles.itemContainer}>
        <View style={styles.itemWrapper}>
          {!isRightOutermost && (
            <View style={styles.borderRightContainer}>
              <View style={styles.borderRight} />
            </View>
          )}
          <View style={[styles.itemInnerWrapper]}>
            <View style={styles.imageContainer}>
              <CachedImage source={{uri: item.image}} style={styles.image} />
            </View>
            <Text style={styles.name}>{item.short_name || item.name}</Text>
          </View>
          {!isLastRow && <View style={styles.borderBottom} />}
          {!isLastRow && !isRightOutermost && (
            <View style={styles.dotContainer}>
              <View style={styles.dot} />
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const data = this.state.searchData
      ? this.state.searchData
      : this.state.data;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.isLoading && <Loading center />}
        <View style={styles.searchContainer}>
          <Icon name="search" style={styles.searchIcon} />
          <TextInput
            placeholder="Tìm kiếm..."
            placeholderTextColor={appConfig.colors.placeholder}
            style={styles.input}
            onChangeText={this.onChangeText}
            value={this.state.text}
            clearButtonMode="while-editing"
          />
        </View>
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          numColumns={NUM_COLUMS}
          renderItem={({item, index}) =>
            this.renderPaymentMethodDetail(data, {item, index})
          }
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          style={styles.listContainer}
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
                    ? 'Không tìm thấy thông tin'
                    : 'Chưa có thông tin'
                }
              />
            )
          }
        />
      </SafeAreaView>
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
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 4,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    zIndex: 1,
    ...elevationShadowStyle(5),
  },
  searchIcon: {
    marginHorizontal: 10,
    fontSize: 22,
    color: appConfig.colors.placeholder,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  listContainer: {
    backgroundColor: '#fff',
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
    resizeMode: 'contain',
  },
  name: {
    marginTop: 10,
    textAlign: 'center',
    color: '#333',
    fontSize: 13,
  },
  borderRightContainer: {
    position: 'absolute',
    height: '100%',
    right: -Util.pixel / 2,
    width: Util.pixel,
    justifyContent: 'center',
  },
  borderRight: {
    height: '80%',
    width: '100%',
    backgroundColor: '#ddd',
  },
  borderBottom: {
    position: 'absolute',
    width: '80%',
    height: Util.pixel,
    bottom: -Util.pixel / 2,
    backgroundColor: '#ddd',
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
    backgroundColor: '#888',
  },
});

export default withTranslation()(PaymentMethodDetailModal);
