/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet,
  RefreshControl,
  FlatList,
  Alert,
  TouchableOpacity
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import store from '../../store/Store';
import SelectionList from '../SelectionList';
import {reaction} from 'mobx';

// components
import NewItemComponent from './NewItemComponent';

@observer
export default class Notifys extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      refreshing: false,
      loading: true,
      news_type: props.news_type || '',
      navigators: this._setOptionList()
    }

    reaction(() => store.refresh_news, () => this._getData());
  }

  _setOptionList() {
    return [
        {
          key: "0",
          label: "Tin tức",
          desc: "Thông tin MACCACA",
          icon: "calendar",
          notify: "new_calendar_news",
          onPress: () => {
            Actions.notifys_time({ 
              isNotifysTime: true,
              news_type: "/47"
            });
          },
          boxIconStyle: [styles.boxIconStyle, {
            backgroundColor: "#fa7f50"
          }],
          iconColor: "#ffffff"
        },
        {
          key: "1",
          label: "Chương trình khuyến mại",
          desc: "Khách hàng thân thiết MACCACA",
          icon: "lemon-o",
          notify: "new_farm_news",
          onPress: () => {
            Actions.notifys_farm({ 
              isNotifysTime: true,
              news_type: "/46"
            });
          },
          boxIconStyle: [styles.boxIconStyle],
          iconColor: "#ffffff"
        }
      ];
  }

  componentDidMount() {
    this._getData();

    store.getNoitify();
  }

  async _getData(delay) {
    try {
      var response = await APIHandler.user_news_list(this.state.news_type);
      if (response && response.status == STATUS_SUCCESS) {
        setTimeout(() => {

          this.setState({
            data: response.data,
            refreshing: false,
            loading: false
          });
        }, delay || 0);
      }
    } catch (e) {
      console.warn(e + ' user_news_list');

      store.addApiQueue('user_news_list', this._getData.bind(this, delay));
    } finally {

    }
  }

  _onRefresh() {
    this.setState({refreshing: true});

    this._getData(1000);
  }

  render() {
    if (this.state.loading) {
      return <Indicator />
    }

    return (
      <View style={styles.container}>
        {this.props.isNotifysTime ? null :
          (<SelectionList data={this.state.navigators} containerStyle={{ height: 125 }}/>)
        }
        {this.state.data != null ? (
          <FlatList
            style={{marginTop:2}}
            data={this.state.data}
            onEndReached={(num) => {

            }}
            onEndReachedThreshold={0}
            renderItem={({item, index}) => {
              return(
                <NewItemComponent
                  item={item} />
              );
            }}
            keyExtractor={item => item.id}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          />
        ) : (
          <CenterText title="Oops... Chưa có tin tức nào :(" />
        )}

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0,
  },
  separator: {
    width: "100%",
    height: 2,
    backgroundColor: "#cccccc"
  },
  headerView: {
    backgroundColor: "rgb(255,255,255)",
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerContentView: {
    width: Util.size.width - 70
  },
  titleHeaderTexxt: {
    fontSize: 16,
    fontWeight: "bold"
  },
  descHeaderTexxt: {
    fontSize: 15
  },
  boxIconStyle: {
    backgroundColor: DEFAULT_COLOR,
    marginRight: 10,
    marginLeft: 6,
    borderRadius: 15
  },
});
