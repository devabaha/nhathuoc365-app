/* @flow */

import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  Animated,
} from 'react-native';

import appConfig from 'app-config';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import {Container} from '../Layout';
import Loading from '../Loading';

class NotifyItemComponent extends Component {
  static defaultProps = {
    onPress: () => {},
  };

  state = {
    isRead: this.props.isRead,
    loading: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.image !== this.props.image ||
      nextProps.title !== this.props.title ||
      nextProps.shopName !== this.props.shopName ||
      nextProps.created !== this.props.created ||
      nextProps.content !== this.props.content
    ) {
      return true;
    }

    return false;
  }

  handlePressNotify = () => {
    const service = {
      callback: () => this.setState({loading: true}),
    };

    this.props.onPress(service, () => {
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
                source={{uri: this.props.image}}
              />
            </View>

            <View style={styles.store_result_item_content}>
              <View style={styles.store_result_item_content_box}>
                <Text numberOfLines={2} style={styles.store_result_item_title}>
                  {this.props.title}
                </Text>
                <Container row style={styles.subTitleContainer}>
                  <Text
                    numberOfLines={1}
                    style={styles.store_result_item_create}>
                    <Icon name="map-marker" size={10} color="#666666" />
                    {' ' + this.props.shopName + '    '}
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={styles.store_result_item_create}>
                    <Icon name="clock-o" size={10} color="#666666" />
                    {' ' + this.props.created}
                  </Text>
                </Container>
                {!!this.props.content && (
                  <Text numberOfLines={2} style={styles.store_result_item_desc}>
                    {this.props.content}
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
    backgroundColor: hexToRgbA('#ddd', 0.3),
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingRight: 10,
  },
});

export default NotifyItemComponent;
