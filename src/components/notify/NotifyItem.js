import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import store from 'app-store';
import appConfig from 'app-config';
// helpers
import EventTracker from 'app-helper/EventTracker';
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {
  getSocialLikeCount,
  getSocialLikeFlag,
  getSocialCommentsCount,
  handleSocialActionBarPress,
  calculateLikeCountFriendly,
} from 'src/helper/social';
import {CONFIG_KEY, isConfigActive} from 'src/helper/configKeyHandler';
// routing
import {push, refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
import {MEDIA_TYPE} from 'src/constants';
import {SOCIAL_BUTTON_TYPES, SOCIAL_DATA_TYPES} from 'src/constants/social';
// custom components
import ListHeader from '../stores/ListHeader';
import CartFooter from '../cart/CartFooter';
import PopupConfirm from '../PopupConfirm';

import RightButtonNavBar from '../RightButtonNavBar';
import {RIGHT_BUTTON_TYPE} from '../RightButtonNavBar/constants';
import ActionContainer from '../Social/ActionContainer';
import ListStoreProduct from '../stores/ListStoreProduct';
import Loading from '../Loading';
import CustomAutoHeightWebview from '../CustomAutoHeightWebview';
import MediaCarousel from '../item/MediaCarousel';
import {
  ScreenWrapper,
  ScrollView,
  Container,
  Typography,
  Icon,
  RefreshControl,
} from 'src/components/base';

class NotifyItem extends Component {
  static contextType = ThemeContext;
  state = {
    loading: true,
    item: this.props.data,
    item_data: null,
    refreshing: false,
  };
  unmounted = false;
  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get notify() {
    return this.state.item_data || this.state.item || {};
  }

  componentDidMount() {
    this._getData();
    setTimeout(() =>
      refresh({
        right: this.renderRightButton.bind(this),
      }),
    );

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  _onRefresh() {
    this.setState({refreshing: true}, this._getData.bind(this, 1000));
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.data?.id != nextProps.data?.id) {
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

  async _getData(delay) {
    const newsId = this.props.newsId || this.state.item.id;

    try {
      const response = await APIHandler.user_news(newsId);
      if (this.unmounted) return;

      if (response && response.status == STATUS_SUCCESS) {
        if (response.data) {
          store.updateSocialNews(newsId, {
            like_count: response.data.like_count || 0,
            like_flag: response.data.like_flag || 0,
            share_count: response.data.share_count || 0,
            comment_count: response.data.comment_count || 0,
            like_count_friendly: calculateLikeCountFriendly(response.data) || 0,
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
            },
            () =>
              refresh({
                right: this.renderRightButton.bind(this),
              }),
          );
        }, delay || 0);
      }
    } catch (e) {
      console.log(e + ' user_news');
    } finally {
      !this.unmounted &&
        this.setState({
          refreshing: false,
          loading: false,
        });
    }
  }

  getHeaderInfo(infoKey) {
    return this.notify[infoKey];
  }

  renderRightButton() {
    return null;
    return (
      <Container row style={styles.rightButtonNavBarContainer}>
        <RightButtonNavBar type={RIGHT_BUTTON_TYPE.SHOPPING_CART} />
      </Container>
    );
  }

  // tới màn hình chi tiết item
  _goItem(item) {
    push(
      appConfig.routes.item,
      {
        title: item.name,
        item,
      },
      this.theme,
    );
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

  renderIconMap(iconStyle) {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        style={[styles.icon, iconStyle]}
        name="map-marker"
      />
    );
  }

  renderIconClock(iconStyle) {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        style={[styles.icon, iconStyle]}
        name="clock-o"
      />
    );
  }

  render() {
    var {item, item_data} = this.state;
    const {t} = this.props;

    const shopName = this.getHeaderInfo('shop_name');
    const created = this.getHeaderInfo('created');

    const media = [
      {url: this.getHeaderInfo('image_url'), mediaProps: {resizeMode: 'cover'}},
    ];
    if (this.notify?.video) {
      media.unshift({
        type: MEDIA_TYPE.YOUTUBE_VIDEO,
        url: this.notify?.video,
      });
    }

    return (
      <ScreenWrapper style={styles.container}>
        {this.state.loading && <Loading center />}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          style={styles.notify_container}>
          <Container style={styles.notify_image_box}>
            <MediaCarousel
              height="100%"
              data={media}
              showPagination={media.length > 1}
            />
          </Container>

          <Container
            style={{
              paddingBottom: 15,
            }}>
            <View style={styles.notify_content}>
              <Typography
                type={TypographyType.TITLE_HUGE}
                style={styles.notify_heading}>
                {this.getHeaderInfo('title')}
              </Typography>

              <View style={styles.notify_time_box}>
                <Container row>
                  {!!shopName && (
                    <Container row style={styles.notifyBlock}>
                      {/* <Icon name="map-marker" style={styles.icon} /> */}
                      <Typography
                        type={TypographyType.LABEL_MEDIUM_TERTIARY}
                        style={styles.notify_time}
                        renderIconBefore={this.renderIconMap}>
                        {shopName}
                      </Typography>
                    </Container>
                  )}

                  {!!created && (
                    <Container row style={styles.notifyBlock}>
                      <Typography
                        type={TypographyType.LABEL_MEDIUM_TERTIARY}
                        style={styles.notify_time}
                        renderIconBefore={this.renderIconClock}>
                        {created}
                      </Typography>
                    </Container>
                  )}
                </Container>
              </View>

              {!!this.getHeaderInfo('short_content') && (
                <Container style={styles.notify_sort_content_box}>
                  <Typography
                    type={TypographyType.LABEL_LARGE}
                    style={styles.notify_sort_content}>
                    {this.getHeaderInfo('short_content')}
                  </Typography>
                </Container>
              )}
            </View>

            {item_data != null ? (
              <CustomAutoHeightWebview
                containerStyle={styles.webviewContainer}
                content={item_data.content}
              />
            ) : null}
          </Container>

          {item_data != null &&
            item_data.related &&
            item_data.related.length !== 0 && (
              <>
                <ListHeader title={t('relatedItems')} />
                <ListStoreProduct
                  containerStyle={styles.listStoreProductContainer}
                  products={item_data.related}
                />
              </>
            )}
        </ScrollView>

        {!!item_data && (
          <ActionContainer
            style={styles.actionContainer}
            isLiked={getSocialLikeFlag(SOCIAL_DATA_TYPES.NEWS, item_data)}
            likeCount={getSocialLikeCount(SOCIAL_DATA_TYPES.NEWS, item_data)}
            commentsCount={getSocialCommentsCount(
              SOCIAL_DATA_TYPES.NEWS,
              item_data,
            )}
            disableComment={isConfigActive(CONFIG_KEY.DISABLE_SOCIAL_COMMENT)}
            onActionBarPress={(type) =>
              handleSocialActionBarPress(
                SOCIAL_DATA_TYPES.NEWS,
                type,
                item_data,
              )
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
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  notify_container: {},
  notify_content: {
    paddingHorizontal: 15,
  },

  notify_heading: {
    fontWeight: '600',
    marginTop: 15,
  },

  notify_time_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  notify_time: {},
  notify_sort_content_box: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: -15,
    marginTop: 15,
  },
  notify_sort_content: {
    lineHeight: 24,
  },
  notify_image_box: {
    height: appConfig.device.width / 1.75,
    justifyContent: 'center',
    overflow: 'hidden',
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
    marginRight: 10,
  },
  product_related_text: {
    fontSize: 20,
    color: '#2B2B2B',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  actionContainer: {
    paddingBottom: appConfig.device.bottomSpace,
    ...elevationShadowStyle(7),
  },

  listStoreProductContainer: {
    paddingTop: 0,
  },
  webviewContainer: {
    marginTop: 10,
  },
  webview: {
    // marginTop: 15,
    // marginHorizontal: 15,
    width: '100%',
  },

  notifyBlock: {
    marginRight: 15,
  },
  icon: {
    marginRight: 5,
  },
});

export default withTranslation(['news', 'cart'])(observer(NotifyItem));
