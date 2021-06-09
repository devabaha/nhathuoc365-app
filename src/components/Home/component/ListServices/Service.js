import React, {Component} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';
import Button from 'react-native-button';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {NotiBadge} from '../../../Badges';
import {BASE_SERVICE_DIMENSION, BASE_TITLE_MARGIN} from './constants';
import {IMAGE_ICON_TYPE} from '../../constants';
import Loading from '../../../Loading';
import {SERVICES_TYPE} from '../../../../helper/servicesHandler';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  buttonWrapper: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  itemWrapper: {
    alignItems: 'center',
  },
  iconWrapper: {
    width: BASE_SERVICE_DIMENSION,
    height: BASE_SERVICE_DIMENSION,
    borderRadius: 16,
    backgroundColor: '#eee',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  title: {
    textAlign: 'center',
    marginTop: BASE_TITLE_MARGIN,
    ...appConfig.styles.typography.sub
  },
  notifyWrapper: {
    right: -8,
    top: -8,
    minWidth: 20,
    height: 20,
  },
  notifyLabel: {
    fontSize: 12,
  },
  loading: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,.2)',
  },
});

class Service extends Component {
  state = {
    loading: false,
  };

  handlePress(service) {
    if (this.state.loading) return;
    const {type} = service;
    if (
      !!this.props.selfRequest &&
      (type === SERVICES_TYPE.OPEN_SHOP ||
        type === SERVICES_TYPE.PRODUCT_DETAIL)
    ) {
      this.setState({
        loading: true,
      });
      this.handleSelfRequest(service);
    } else {
      this.props.onPress(service);
    }
  }

  handleSelfRequest(service) {
    this.props.selfRequest(service, () => {
      !this.unmounted && this.setState({loading: false});
    });
  }

  render() {
    const {
      service,
      containerStyle,
      itemStyle,
      notiLabel,
      isShowNoti,
      titleStyle,
    } = this.props;

    return (
      <Button
        onPress={this.handlePress.bind(this, service)}
        containerStyle={[styles.buttonWrapper, containerStyle]}>
        <View style={styles.itemWrapper}>
          <View>
            <View style={[styles.iconWrapper, itemStyle]}>
              {this.state.loading && (
                <Loading size="small" center containerStyle={styles.loading} />
              )}
              {service.iconType === IMAGE_ICON_TYPE ? (
                <Image style={styles.icon} source={{uri: service.icon}} />
              ) : (
                <MaterialCommunityIcons
                  name={service.icon}
                  color="#fff"
                  size={32}
                />
              )}
            </View>
            <NotiBadge
              containerStyle={styles.notifyWrapper}
              labelStyle={styles.notifyLabel}
              label={notiLabel}
              show={isShowNoti}
              alert
              animation
            />
          </View>
          <Text style={[styles.title, titleStyle]}>{service.title}</Text>
        </View>
      </Button>
    );
  }
}

export default Service;
