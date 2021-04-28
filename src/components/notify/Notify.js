/* @flow */

import React, {Component} from 'react';
import {View, StyleSheet, RefreshControl, FlatList} from 'react-native';

// library
import {Actions} from 'react-native-router-flux';
import store from '../../store/Store';
import {reaction} from 'mobx';

// components
import NewItemComponent from './NewItemComponent';
import EventTracker from '../../helper/EventTracker';

class Notify extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true,
      news_type: props.news_type || '',
      navigators: this._setOptionList(),
    };

    reaction(
      () => store.refresh_news,
      () => this._getData(),
    );
    this.eventTracker = new EventTracker();
  }

  _setOptionList() {
    return [
      // {
      //   key: "0",
      //   label: "Tin tức",
      //   desc: "Thông tin TickID",
      //   icon: "calendar",
      //   notify: "new_calendar_news",
      //   onPress: () => {
      //     Actions.notifies_time({
      //       isNotifyTime: true,
      //       news_type: "/47"
      //     });
      //   },
      //   boxIconStyle: [styles.boxIconStyle, {
      //     backgroundColor: "#fa7f50"
      //   }],
      //   iconColor: "#ffffff"
      // },
      // {
      //   key: "1",
      //   label: "Chương trình khuyến mại",
      //   desc: "Khách hàng thân thiết",
      //   icon: "lemon-o",
      //   notify: "new_farm_news",
      //   onPress: () => {
      //     Actions.notifies_farm({
      //       isNotifyTime: true,
      //       news_type: "/46"
      //     });
      //   },
      //   boxIconStyle: [styles.boxIconStyle],
      //   iconColor: "#ffffff"
      // }
    ];
  }

  componentDidMount() {
    setTimeout(() => {
      Actions.refresh({
        title: this.props.title || this.props.t('common:screen.news.mainTitle'),
      });
    });
    this._getData();

    store.getNoitify();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  async _getData(delay) {
    const {t} = this.props;
    try {
      var response = await APIHandler.user_news_list(this.state.news_type, this.props.id);
      if (response && response.status == STATUS_SUCCESS) {
        if (store.deep_link_data) {
          const news = response.data.find(
            (newsItem) => newsItem.id === store.deep_link_data.id,
          );
          if (news) {
            Actions.notify_item({
              title: news.title,
              data: news,
            });
          } else {
            flashShowMessage({
              type: 'danger',
              message: t('getNews.error.message'),
            });
          }
        }
        setTimeout(() => {
          this.setState({
            data: response.data,
            refreshing: false,
            loading: false,
          });
        }, delay || 0);
      }
    } catch (e) {
      console.log(e + ' user_news_list');
    } finally {
      store.setDeepLinkData(null);
    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  render() {
    const {t} = this.props;
    if (this.state.loading) {
      return <Indicator />;
    }

    return (
      <View style={styles.container}>
        {/* {this.props.isNotifyTime ? null :
          (<SelectionList data={this.state.navigators} containerStyle={{ height: 125 }}/>)
        } */}
        {this.state.data != null ? (
          <FlatList
            style={{marginTop: 2}}
            data={this.state.data}
            onEndReached={(num) => {}}
            onEndReachedThreshold={0}
            renderItem={({item, index}) => {
              return <NewItemComponent item={item} />;
            }}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        ) : (
          <CenterText title={t('noNews')} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 0,
  },
  separator: {
    width: '100%',
    height: 2,
    backgroundColor: '#cccccc',
  },
  headerView: {
    backgroundColor: 'rgb(255,255,255)',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContentView: {
    width: Util.size.width - 70,
  },
  titleHeaderTexxt: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  descHeaderTexxt: {
    fontSize: 15,
  },
  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15,
  },
});

export default withTranslation(['news', 'common'])(observer(Notify));
