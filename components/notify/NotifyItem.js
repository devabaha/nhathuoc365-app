/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import AutoHeightWebView from 'react-native-autoheight-webview';
import store from '../../store/Store';

@observer
export default class NotifyItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      item: props.data,
      item_data: null
    }
  }

  componentDidMount() {
    this._getData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.id != nextProps.data.id) {
      this.setState({
        loading: true,
        item: nextProps.data,
        item_data: null
      }, () => {
        this._getData();
      });
    }
  }

  _getData(delay) {
    this.setState({
      loading: true
    }, async () => {
      try {
        var response = await APIHandler.user_news(this.state.item.id);

        if (response && response.status == STATUS_SUCCESS) {
          setTimeout(() => {

            this.setState({
              item_data: response.data,
              refreshing: false,
              loading: false
            });
          }, delay || 0);
        }
      } catch (e) {
        console.warn(e + ' user_news');

        store.addApiQueue('user_news', this._getData.bind(this, delay));
      } finally {

      }
    });
  }

  render() {
    var {item, item_data} = this.state;

    return (
      <View style={styles.container}>
        <ScrollView style={styles.notify_container}>
          <View style={styles.notify_image_box}>
            <CachedImage mutable style={styles.notify_image} source={{uri: item.image_url}} />
          </View>

          <View style={styles.notify_content}>
            <Text style={styles.notify_heading}>{item.title}</Text>

            <View style={styles.notify_time_box}>
              <Text style={styles.notify_time}>
                <Icon name="clock-o" size={11} color="#666666" />
                {' ' + item.created + '    '}
                <Icon name="map-marker" size={12} color="#666666" />
                {' ' + item.shop_name}
              </Text>
            </View>

            <View style={styles.notify_sort_content_box}>
              <Text style={styles.notify_sort_content}>{item.short_content}</Text>
            </View>
          </View>

          {item_data != null ? (
            <AutoHeightWebView
              onError={() => console.log('on error')}
              onLoad={() => console.log('on load')}
              onLoadStart={() => console.log('on load start')}
              onLoadEnd={() => console.log('on load end')}
              onShouldStartLoadWithRequest={result => {
                console.log(result)
                return true;
              }}
              style={{
                paddingHorizontal: 6
              }}
              onHeightUpdated={height => this.setState({ height })}
              source={{ html: item_data.content }}
              customScript={`

                `}
              customStyle={`
                * {
                  font-family: 'arial';
                }
                a {
                  pointer-events:none;
                  text-decoration: none !important;
                  color: #404040 !important;
                }
                p {
                  font-size: 15px;
                  line-height: 24px
                }
                img {
                  max-width: 100% !important;
                }`} />
          ) : (
            <Indicator size="small" />
          )}

        </ScrollView>
      </View>
    );
  }
}

const html_styles = StyleSheet.create({
  p: {
    color: "#404040",
    fontSize: 14,
    lineHeight: 24
  },
  a: {
    fontWeight: '300',
    color: DEFAULT_COLOR,
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0,
    backgroundColor: "#ffffff"
  },
  notify_container: {
    paddingBottom: 8,
    marginBottom: 8
  },
  notify_content: {
    paddingHorizontal: 15
  },

  notify_heading: {
    fontSize: 16,
    color: "#000000",
    fontWeight: '500',
    lineHeight: 24,
    marginTop: 20,
  },

  notify_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  notify_time: {
    marginLeft: 4,
    fontSize: 12,
    color: "#666666"
  },
  notify_sort_content_box: {
    marginTop: 20
  },
  notify_sort_content: {
    color: "#000000",
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '500'
  },
  notify_full_content: {
    color: "#404040",
    lineHeight: 24,
    fontSize: 14
  },
  notify_image_box: {
    width: '100%',
    height: Util.size.height / 3,
    backgroundColor: "#cccccc"
  },
  notify_image: {
    flex: 1,
    resizeMode: 'cover'
  }
});
