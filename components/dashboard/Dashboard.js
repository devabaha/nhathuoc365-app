import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableHighlight,
  FlatList,
  RefreshControl
} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import Modal from 'react-native-modalbox';

import {
  ItemList
} from './ItemList';

export default class Dashboard extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);

    this.state = {
      stores: null,
      refreshing: false
    }
  }

  componentDidMount() {
    this._getData();
  }

  _getData = async () => {
    try {
      var response = await ADMIN_APIHandler.user_home();

      if (response && response.status == STATUS_SUCCESS) {
        this.setState({
          stores: response.data
        });
      }

    } catch (e) {
      console.warn(e);
    } finally {

    }
  }

  _onRefresh() {
    this.setState({
      refreshing: true
    }, () => {
      setTimeout(() => {
        this.setState({
          refreshing: false
        });

        this.props.increment();
      }, 1000);
    });
  }

  itemListOnPress = (item) => {
    Actions.sale_menu({
      item_data: item,
      title: item.name.toUpperCase()
    });
  }

  render() {
    var {stores} = this.state;
    var {homeState, increment} = this.props;

    return (
      <View style={styles.container}>
        {stores ? (
          <FlatList
            data={stores}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => <ItemList itemListOnPress={this.itemListOnPress} item={item} index={index} />}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
            />
        ) : (
          <Indicator size="small" />
        )}
      </View>
    );
  }
}

const CONTENT_WIDTH = Util.size.width;
const POPUP_WIDTH = Util.size.width * 0.9;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0
  },
  dashboardContainer: {
    flex: 1,
    // marginTop: isIOS ? 20 : 0,
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  popupDashboard: {
    width: POPUP_WIDTH,
    height: POPUP_WIDTH + 60
  },
  content: {
    width: POPUP_WIDTH,
    height: POPUP_WIDTH + 60,
  },
  iconBox: {
    width: POPUP_WIDTH / 3,
    height: POPUP_WIDTH / 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  iconTitle: {
    marginTop: 16,
    fontSize: 14,
    color: "#404040"
  },

  storeBox: {
    width: '100%',
    height: 60,
    flexDirection: 'row',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
    backgroundColor: "#ebebeb"
  },
  storeInfoBox: {
    flex: 1
  },
  storeImg: {
    width: 44,
    height: 44,
    marginTop: 6,
    marginLeft: 8
  },
  storeName: {
    fontSize: 16,
    marginTop: 4,
    marginLeft: 8
  },
  storeAddress: {
    fontSize: 12,
    marginLeft: 8,
    marginTop: 2
  }
});
