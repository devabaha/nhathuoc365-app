import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Actions} from 'react-native-router-flux';
import AutoHeightWebView from 'react-native-autoheight-webview';
import ListHeader from '../stores/ListHeader';
import Items from '../stores/Items';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';
import store from '../../store/Store';
import appConfig from 'app-config';
import EventTracker from '../../helper/EventTracker';
import RightButtonNavBar from '../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../RightButtonNavBar/constants';
import Container from '../Layout/Container';
import ActionContainer from '../Social/ActionContainer';
import {
  getSocialLikeCount,
  getSocialLikeFlag,
  getSocialCommentsCount,
  handleSocialActionBarPress,
  calculateLikeCountFriendly,
} from 'src/helper/social';
import {SOCIAL_BUTTON_TYPES, SOCIAL_DATA_TYPES} from 'src/constants/social';
import {CONFIG_KEY, isConfigActive} from 'src/helper/configKeyHandler';

class NotifyItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      item: props.data,
      item_data: null,
      refreshing: false,
    };
    this.eventTracker = new EventTracker();
  }

  get notify() {
    return this.state.item_data || this.state.item || {};
  }

  componentDidMount() {
    this._getData();
    setTimeout(() =>
      Actions.refresh({
        right: this.renderRightButton.bind(this),
      }),
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  _onRefresh() {
    this.setState({refreshing: true}, this._getData.bind(this, 1000));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data.id != nextProps.data.id) {
      this.setState(
        {
          loading: true,
          item: nextProps.data,
          item_data: null,
        },
        () => {
          this._getData();
        },
      );
    }
  }

  _getData(delay) {
    this.setState(
      {
        loading: true,
      },
      async () => {
        try {
          var response = await APIHandler.user_news(this.state.item.id);

          if (response && response.status == STATUS_SUCCESS) {
            if (response.data) {
              store.updateSocialNews(this.state.item.id, {
                like_count: response.data.like_count || 0,
                like_flag: response.data.like_flag || 0,
                share_count: response.data.share_count || 0,
                comment_count: response.data.comment_count || 0,
                like_count_friendly:
                  calculateLikeCountFriendly(response.data) || 0,
              });
            }
            if (!this.state.item_data) {
              this.eventTracker.logCurrentView({
                params: {
                  id: response.data.id,
                  name: response.data.title,
                },
              });
            }

            setTimeout(() => {
              this.setState(
                {
                  item_data: response.data,
                  refreshing: false,
                  loading: false,
                },
                () =>
                  Actions.refresh({
                    right: this.renderRightButton.bind(this),
                  }),
              );
            }, delay || 0);
          }
        } catch (e) {
          console.log(e + ' user_news');
        }
      },
    );
  }

  getHeaderInfo(infoKey) {
    const item = this.state.item || {};
    const item_data = this.state.item_data || {};
    return item[infoKey] || item_data[infoKey];
  }

  renderRightButton() {
    return (
      <Container row style={styles.rightButtonNavBarContainer}>
        <RightButtonNavBar
          type={RIGHT_BUTTON_TYPE.SHARE}
          shareTitle={this.notify.title}
          shareURL={this.notify.url}
        />
      </Container>
    );
  }

  render() {
    var {item, item_data} = this.state;
    const {t} = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          style={styles.notify_container}>
          <View style={styles.notify_image_box}>
            <CachedImage
              mutable
              style={styles.notify_image}
              source={{uri: this.getHeaderInfo('image_url')}}
            />
          </View>

          <View
            style={{
              backgroundColor: '#ffffff',
              paddingBottom: 16,
            }}>
            <View style={styles.notify_content}>
              <Text style={styles.notify_heading}>
                {this.getHeaderInfo('title')}
              </Text>

              <View style={styles.notify_time_box}>
                <Text style={styles.notify_time}>
                  <Icon name="clock-o" size={11} color="#666666" />
                  {' ' + this.getHeaderInfo('created') + '    '}
                  <Icon name="map-marker" size={12} color="#666666" />
                  {' ' + this.getHeaderInfo('shop_name')}
                </Text>
              </View>

              <View style={styles.notify_sort_content_box}>
                <Text style={styles.notify_sort_content}>
                  {this.getHeaderInfo('short_content')}
                </Text>
              </View>
            </View>

            {item_data != null ? (
              <AutoHeightWebView
                onError={() => console.log('on error')}
                onLoad={() => console.log('on load')}
                onLoadStart={() => console.log('on load start')}
                onLoadEnd={() => console.log('on load end')}
                onShouldStartLoadWithRequest={(result) => {
                  console.log(result);
                  return true;
                }}
                style={{
                  paddingHorizontal: 6,
                  marginHorizontal: 15,
                  width: appConfig.device.width - 30,
                }}
                onHeightUpdated={(height) => this.setState({height})}
                source={{html: item_data.content}}
                zoomable={false}
                scrollEnabled={false}
                viewportContent={'width=device-width, user-scalable=no'}
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
                  }`}
              />
            ) : (
              <Indicator size="small" />
            )}
          </View>

          {item_data != null &&
            item_data.related &&
            item_data.related.length !== 0 && (
             
                <FlatList
                  onEndReached={(num) => {}}
                  onEndReachedThreshold={0}
                  style={[styles.items_box]}
                ListHeaderComponent={() => (
                  <ListHeader title={`—  ${t('relatedItems')}  —`} />
                )}
                  data={item_data.related}
                  renderItem={({item, index}) => (
                    <Items
                      item={item}
                      index={index}
                      onPress={this._goItem.bind(this, item)}
                      containerStyle={{
                        width: appConfig.device.width / 2 - 20,
                      }}
                      imageStyle={{
                        width: appConfig.device.width / 2 - 30,
                        height: appConfig.device.width / 2 - 30,
                      }}
                    />
                  )}
                  horizontal={true}
                  keyExtractor={(item) => item.id}
                  style={{overflow: 'visible'}}
                  contentContainerStyle={{
                    paddingHorizontal: 5,
                    paddingVertical: 20,
                  }}
                />
            )}
        </ScrollView>

        {!!item_data && (
          <ActionContainer
            style={styles.actionContainer}
            isLiked={getSocialLikeFlag(SOCIAL_DATA_TYPES.NEWS, item_data)}
            likeCount={getSocialLikeCount(SOCIAL_DATA_TYPES.NEWS, item_data)}
            commentsCount={getSocialCommentsCount(SOCIAL_DATA_TYPES.NEWS, item_data)}
            disableComment={isConfigActive(CONFIG_KEY.DISABLE_SOCIAL_COMMENT)}
            onActionBarPress={(type) =>
              handleSocialActionBarPress(SOCIAL_DATA_TYPES.NEWS, type, item_data)
            }
            hasInfoExtraBottom={false}
            onPressTotalComments={() =>
              handleSocialActionBarPress(
                SOCIAL_DATA_TYPES.NEWS,
                SOCIAL_BUTTON_TYPES.COMMENT,
                item_data,
                false,
              )
            }
          />
        )}

        {/* {item_data != null && item_data.related && (
          <CartFooter
            prefix="item"
            confirmRemove={this._confirmRemoveCartItem.bind(this)}
          />
        )} */}

        <PopupConfirm
          ref_popup={(ref) => (this.refs_modal_delete_cart_item = ref)}
          title={t('cart:popup.remove.message')}
          height={110}
          otherClose={false}
          noConfirm={() => {
            if (this.refs_modal_delete_cart_item) {
              this.refs_modal_delete_cart_item.close();
            }
          }}
          yesConfirm={this._removeCartItem.bind(this)}
        />
      </View>
    );
  }

  // tới màn hình chi tiết item
  _goItem(item) {
    Actions.item({
      title: item.name,
      item,
    });
  }

  _confirmRemoveCartItem(item) {
    this.cartItemConfirmRemove = item;

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.open();
    }
  }

  async _removeCartItem() {
    if (!this.cartItemConfirmRemove) {
      return;
    }

    if (this.refs_modal_delete_cart_item) {
      this.refs_modal_delete_cart_item.close();
    }

    var item = this.cartItemConfirmRemove;

    try {
      const data = {
        quantity: 0,
        model: item.model,
      };

      var response = await APIHandler.site_cart_update(
        store.store_id,
        item.id,
        data,
      );

      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {
          action(() => {
            store.setCartData(response.data);
            // prev item in list
            if (isAndroid && store.cart_item_index > 0) {
              var index = store.cart_item_index - 1;
              store.setCartItemIndex(index);
              Events.trigger(NEXT_PREV_CART, {index});
            }
            flashShowMessage({
              message: response.message,
              type: 'success',
            });
          })();
        }, 450);
      }

      this.cartItemConfirmRemove = undefined;
    } catch (e) {
      console.log(e + ' site_cart_update');
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
  },
  notify_container: {
    // paddingBottom: 8,
    // marginBottom: 8
  },
  notify_content: {
    paddingHorizontal: 15,
  },

  notify_heading: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    lineHeight: 24,
    marginTop: 20,
  },

  notify_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  notify_time: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666666',
  },
  notify_sort_content_box: {
    marginTop: 20,
  },
  notify_sort_content: {
    color: '#000000',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '500',
  },
  notify_full_content: {
    color: '#404040',
    lineHeight: 24,
    fontSize: 14,
  },
  notify_image_box: {
    height: appConfig.device.width / 1.75,
    backgroundColor: '#cccccc',
  },
  notify_image: {
    flex: 1,
    resizeMode: 'cover',
  },

  items_box: {
    // marginBottom: 69,
    // marginTop: 20,
  },
  rightButtonNavBarContainer: {
    marginRight: 5,
  },
  product_related_text: {
    fontSize: 20,
    color: '#2B2B2B',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  actionContainer: {
    backgroundColor: '#fff',
    ...elevationShadowStyle(7),
  },
});

export default withTranslation(['news', 'cart'])(observer(NotifyItem));
