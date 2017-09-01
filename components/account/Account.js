/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Touch,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  FlatList,
  RefreshControl
} from 'react-native';

// library
import Icon from 'react-native-vector-icons/FontAwesome';
import { Actions, ActionConst } from 'react-native-router-flux';
import { SocialIcon } from '../../lib/react-native-elements';

// components
import SelectionList from '../SelectionList';

@observer
export default class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: [
        {
          key: 1,
          icon: "heart",
          label: "Ưa thích",
          desc: "Xem sản phẩm đã thích",
          onPress: () => 1,
          boxIconStyle: []
        },
        {
          key: 2,
          icon: "history",
          label: "Mới xem",
          desc: "Sản phẩm đã xem gần đây",
          onPress: () => 1,
          boxIconStyle: []
        },
        {
          key: 3,
          icon: "question-circle",
          label: "Trung tâm trợ giúp",
          desc: "Xem trợ giúp",
          onPress: () => 1,
          boxIconStyle: []
        }
      ],
      refreshing: false
    }

  }

  _onRefresh() {
    this.setState({refreshing: true});

    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1000);
  }

  render() {

    if (false) {
      var avatar = (
        <Image style={styles.profile_avatar} source={{uri: "https://scontent.fhan4-1.fna.fbcdn.net/v/t1.0-9/20228664_1934714413468593_6526539620669280594_n.jpg?oh=05127a03af9c2f04e3301b8d41fbc13f&oe=5A29DD78"}} />
      );
    } else {
      var avatar = (
        <Icon name="user" size={36} color="#666666" />
      );
    }

    return (
      <View style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          >

          <View style={styles.profile_cover_box}>
            <Image style={styles.profile_cover} source={{uri: "https://dantri4.vcmedia.vn/k:c05a76d21c/2016/03/23/1-1458723853381/ve-dep-huyen-dieu-cua-dat-troi-duoi-anh-hoang-hon.jpg"}}>

              <TouchableHighlight
                style={styles.profile_avatar_box}
                underlayColor="#cccccc"
                onPress={() => 1}>
                {avatar}
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => 1}
                style={styles.profile_button_box}>

                <View style={styles.profile_button_login_box}>
                  <Icon name="facebook" size={14} color="#ffffff" />
                  <Text style={styles.profile_button_title}>Đăng nhập với Facebook</Text>
                </View>
              </TouchableHighlight>

            </Image>
          </View>

          <SelectionList
            containerStyle={{
              marginTop: 8
            }}
            data={this.state.options} />

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1"
  },

  profile_cover_box: {
    width: '100%',
    backgroundColor: "#ccc",
    height: 180
  },
  profile_cover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  profile_avatar_box: {
    position: 'absolute',
    bottom: 20,
    left: 24,
    width: 80,
    height: 80,
    backgroundColor: "#cccccc",
    borderWidth: 2,
    borderColor: "#ffffff",
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  },
  profile_avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    resizeMode: 'cover'
  },

  profile_button_box: {
    position: 'absolute',
    bottom: 42,
    right: 15
  },
  profile_button_login_box: {
    backgroundColor: "#4267b2",
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 3
  },
  profile_button_title: {
    fontSize: 14,
    color: "#ffffff",
    marginLeft: 4
  }
});
