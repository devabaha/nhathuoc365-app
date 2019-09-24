import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Linking,
  RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';
import HTML from 'react-native-render-html';
import APIHandler from '../services/services';
import Indicator from './Indicator';
import { SCREEN_WIDTH } from '../services/constants';

class ServiceDetail extends Component {
  static propTypes = {
    onPressOrder: PropTypes.func,
    onPressLink: PropTypes.func
  };

  static defaultProps = {
    onPressOrder: () => {},
    onPressLink: url => {
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          console.log('Cannot open: ' + url);
        }
      });
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowIndicator: false,
      isRefreshing: false,
      service: null
    };
  }

  componentDidMount() {
    this._getData();
  }

  async _getData() {
    try {
      const service = this.props.service;
      const { isRefreshing } = this.state;
      if (!isRefreshing) {
        this.setState({ isShowIndicator: true });
      }
      var response = await APIHandler.getServiceDetail(service.id);
      if (response && response.status == 200) {
        this.setState({
          service: response.service,
          isShowIndicator: false,
          isRefreshing: false
        });
      } else {
        Toast.show(response.message);
        this.setState({
          service: null,
          isShowIndicator: false,
          isRefreshing: false
        });
      }
    } catch (e) {
      this.setState({
        service: null,
        isShowIndicator: false,
        isRefreshing: false
      });
    }
  }

  _onPressOrderNow() {
    this.props.onPressOrder(this.state.service);
  }

  _onPressLink = url => {
    this.props.onPressLink(url);
  };

  _onRefresh() {
    this.setState({ isRefreshing: true }, function() {
      this._getData();
    });
  }

  render() {
    const service = this.state.service;
    const { isShowIndicator } = this.state;
    return (
      <View style={styles.container}>
        <Indicator loading={isShowIndicator} />
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          {service != null ? (
            <View>
              <View style={styles.serviceWrapper}>
                <Image
                  style={styles.serviceImage}
                  source={{ uri: service.image }}
                />
                <View style={styles.nameView}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                </View>
              </View>
              <View style={{ backgroundColor: 'white', marginBottom: 8 }}>
                <HTML
                  html={`<div style="margin-horizontal:8,">${service.description}</div>`}
                  imagesMaxWidth={SCREEN_WIDTH - 16}
                  staticContentMaxWidth={SCREEN_WIDTH - 16}
                  onLinkPress={(event, href) => this._onPressLink(href)}
                />
              </View>
            </View>
          ) : null}
        </ScrollView>
        {service != null ? (
          <View style={styles.orderContainerView}>
            <TouchableOpacity onPress={this._onPressOrderNow.bind(this)}>
              <View style={styles.orderView}>
                <Text style={styles.orderText}>ĐẶT NGAY</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    );
  }
}

const categoryWrapperHeight = 180;
const cartImageHeight = 25;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
    backgroundColor: '#F9F9F9'
  },
  serviceWrapper: {
    flex: 1,
    height: categoryWrapperHeight,
    flexDirection: 'column-reverse'
  },
  serviceImage: {
    flex: 1
  },
  nameView: {
    width: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  serviceName: {
    flex: 1,
    color: 'white',
    fontSize: 15,
    textAlign: 'left',
    paddingVertical: 8,
    marginHorizontal: 8,
    fontWeight: '500'
  },
  orderContainerView: {
    backgroundColor: 'white'
  },
  orderView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#772F80',
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10
  },
  orderText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    paddingVertical: 14
  },
  cartImage: {
    height: cartImageHeight,
    width: cartImageHeight,
    marginHorizontal: 8
  }
});

export default ServiceDetail;
