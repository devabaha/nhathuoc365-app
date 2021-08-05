/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  Animated,
  Easing,
} from 'react-native';

import appConfig from 'app-config';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import {Container} from '../Layout';
import Loading from '../Loading';
import {servicesHandler} from 'app-helper/servicesHandler';

export default class NotifyItemComponent extends Component {
  static defaultProps = {
    onPress: () => {},
  };

  state = {
    isRead: this.props.notify.open_flag,
    loading: false,
  };

  handlePressNotify = () => {
    this.props.onPress();

    const service = {
      ...this.props.notify,
      callback: () => this.setState({loading: true}),
    };

    servicesHandler(service, this.props.t, () => {
      this.setState({loading: false});
    });

    setTimeout(() => this.setState({isRead: true}), 1000);
  };

  render() {
    return (
      <TouchableHighlight
        disabled={this.state.loading}
        underlayColor="#ddd"
        onPress={this.handlePressNotify}
        style={this.state.isRead == 0 && styles.store_result_item_active}>
        <>
          {this.state.loading && (
            <Loading center size="small" wrapperStyle={styles.loadingWrapper} />
          )}
          <Animated.View style={[styles.store_result_item]}>
            {this.state.isRead == 0 && (
              <Animated.View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: hexToRgbA(appConfig.colors.primary, 0.15),
                }}
              />
            )}
            <View style={styles.store_result_item_image_box}>
              <CachedImage
                mutable
                style={styles.store_result_item_image}
                source={{uri: this.props.notify.image_url}}
              />
            </View>

            <View style={styles.store_result_item_content}>
              <View style={styles.store_result_item_content_box}>
                <Text numberOfLines={2} style={styles.store_result_item_title}>
                  {this.props.notify.title}
                </Text>
                <Container row style={styles.subTitleContainer}>
                  <Text
                    numberOfLines={1}
                    style={styles.store_result_item_create}>
                    <Icon name="map-marker" size={10} color="#666666" />
                    {' ' + this.props.notify.shop_name + '    '}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={styles.store_result_item_create}>
                    <Icon name="clock-o" size={10} color="#666666" />
                    {' ' + this.props.notify.created}
                  </Text>
                </Container>
                {!!this.props.notify.content && (
                  <Text numberOfLines={2} style={styles.store_result_item_desc}>
                    {this.props.notify.content}
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>
        </>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  stores_result_box: {
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  store_result_item: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexDirection: 'row',
  },
  store_result_item_active: {
    backgroundColor: '#f1f1f1',
  },
  store_result_item_image_box: {
    // backgroundColor: '#fff',
    width: 70,
    height: 70,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 15,
    borderColor: '#ccc',
    borderWidth: 0.5,
  },
  store_result_item_image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  store_result_item_content: {
    flex: 1,
    alignSelf: 'center',
  },
  store_result_item_content_box: {
    // flex: 1,
  },
  store_result_item_title: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  store_result_item_create: {
    color: '#666666',
    fontSize: 11,
  },
  store_result_item_desc: {
    marginTop: 8,
    color: '#333',
    fontSize: 12,
  },
  store_result_item_time: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },

  subTitleContainer: {
    flexWrap: 'wrap',
    marginTop: 5,
  },
  loadingWrapper: {
    backgroundColor: hexToRgbA('#f5f5f5', 0.4),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingRight: 10,
  },
});
