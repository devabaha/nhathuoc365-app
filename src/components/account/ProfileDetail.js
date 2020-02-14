import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  SectionList,
  TouchableHighlight,
  Alert
} from 'react-native';
import store from '../../store/Store';
import HorizontalInfoItem from './HorizontalInfoItem';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from '../Button';
import appConfig from 'app-config';
import Loading from '../Loading';

class ProfileDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logout_loading: false
    };
  }

  get sectionData() {
    return [
      {
        id: 'id_section_1',
        data: [
          { id: 'ho_ten', title: 'Họ & tên', value: store.user_info.name },
          {
            id: 'so_dien_thoai',
            title: 'Số điện thoại',
            value: store.user_info.tel
          }
        ]
      },
      {
        id: 'id_section_2',
        data: [
          { id: 'ngay_sinh', title: 'Ngày sinh', value: store.user_info.birth },
          {
            id: 'gioi_tinh',
            title: 'Giới tính',
            value: store.user_info.gender
          },
          { id: 'email', title: 'Email', value: store.user_info.email }
        ]
      },
      {
        id: 'id_section_3',
        data: [
          { id: 'dia_chi', title: 'Địa chỉ', value: store.user_info.address }
        ]
      }
    ];
  }

  componentDidMount() {
    setTimeout(() =>
      Actions.refresh({
        right: this._renderRightButton
      })
    );
  }

  _renderRightButton = () => {
    return (
      <TouchableHighlight
        style={styles.rightBtnEdit}
        underlayColor="transparent"
        onPress={this._onShowEditProfile}
      >
        <Icon name="edit" size={24} color="#ffffff" />
      </TouchableHighlight>
    );
  };

  _onShowEditProfile = () => {
    Actions.edit_profile({
      userInfo: this.props.userInfo
    });
  };

  handleLogout = () => {
    Alert.alert(
      'Lưu ý',
      'Bạn sẽ không nhận được thông báo khuyến mãi từ các cửa hàng của bạn cho tới khi đăng nhập lại.',
      [
        {
          text: 'Huỷ',
          onPress: () => {}
        },
        {
          text: 'Đăng xuất',
          onPress: this.logout,
          style: 'destructive'
        }
      ],
      { cancelable: false }
    );
  };

  logout = async () => {
    this.setState({
      logout_loading: true
    });
    try {
      const response = await APIHandler.user_logout();
      switch (response.status) {
        case STATUS_SUCCESS:
          store.setUserInfo(response.data);
          store.resetCartData();
          store.setRefreshHomeChange(store.refresh_home_change + 1);
          store.setOrdersKeyChange(store.orders_key_change + 1);
          store.resetAsyncStorage();
          flashShowMessage({
            message: 'Đăng xuất thành công',
            type: 'info'
          });
          Actions.reset(appConfig.routes.sceneWrapper);
          break;
        default:
          console.log('default');
      }
    } catch (error) {
      console.log(error);
      store.addApiQueue('user_logout', this.logout.bind(this));
    } finally {
      this.setState({
        logout_loading: false
      });
    }
  };

  _renderSectionSeparator = () => {
    return <View style={styles.separatorSection} />;
  };

  _renderItemSeparator = () => {
    return <View style={styles.separatorItem} />;
  };

  _renderItems = ({ item, index, section }) => {
    return <HorizontalInfoItem data={item} />;
  };

  render() {
    const sections = this.sectionData;

    return (
      <SafeAreaView style={styles.container}>
        <SectionList
          style={{ flex: 1 }}
          renderItem={this._renderItems}
          ListFooterComponent={() => (
            <Button
              iconRight={
                <IconMaterialCommunity
                  name="logout-variant"
                  size={24}
                  color="#242424"
                  style={{
                    position: 'absolute',
                    right: 15,
                    alignSelf: 'center'
                  }}
                />
              }
              shadow
              containerStyle={styles.logoutContainerStyle}
              btnContainerStyle={styles.logoutBtn}
              titleStyle={styles.logoutTitleBtn}
              title="Đăng xuất"
              onPress={this.handleLogout}
            />
          )}
          SectionSeparatorComponent={this._renderSectionSeparator}
          ItemSeparatorComponent={this._renderItemSeparator}
          sections={sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          extraData={store.user_info}
        />

        {this.state.logout_loading && <Loading center />}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
    width: '100%',
    backgroundColor: '#EFEFF4'
  },
  logoutBtn: {
    marginBottom: 10,
    backgroundColor: '#bababa',
    width: '80%'
  },
  logoutTitleBtn: {
    color: '#242424'
  },
  separatorSection: {
    width: '100%',
    height: 5
  },
  logoutContainerStyle: {
    marginTop: 50
  },
  separatorItem: {
    height: 1,
    backgroundColor: '#EFEFF4'
  },
  rightBtnEdit: {
    right: 10
  }
});

export default observer(ProfileDetail);
