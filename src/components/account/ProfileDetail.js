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
import EventTracker from '../../helper/EventTracker';

class ProfileDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      logout_loading: false
    };
    this.eventTracker = new EventTracker();
  }

  get sectionData() {
    const { t } = this.props;
    return [
      {
        id: 'id_section_1',
        data: [
          {
            id: 'ho_ten',
            title: t('sections.fullName.title'),
            value: store.user_info.name
          },
          {
            id: 'so_dien_thoai',
            title: t('sections.phoneNumber.title'),
            value: store.user_info.tel
          }
        ]
      },
      {
        id: 'id_section_2',
        data: [
          {
            id: 'ngay_sinh',
            title: t('sections.birthdate.title'),
            value: store.user_info.birth
          },
          {
            id: 'gioi_tinh',
            title: t('sections.gender.title'),
            value: store.user_info.gender
          },
          {
            id: 'email',
            title: t('sections.email.title'),
            value: store.user_info.email
          }
        ]
      },
      {
        id: 'id_section_3',
        data: [
          {
            id: 'dia_chi',
            title: t('sections.address.title'),
            value: store.user_info.address
          }
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
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
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
    Actions.push(appConfig.routes.editProfile, {
      userInfo: this.props.userInfo
    });
  };

  handleLogout = () => {
    const { t } = this.props;

    Alert.alert(
      t('signOut.warningTitle'),
      t('signOut.warningDescription'),
      [
        {
          text: t('signOut.cancel'),
          onPress: () => {}
        },
        {
          text: t('signOut.title'),
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
      const { t } = this.props;
      const response = await APIHandler.user_logout();
      switch (response.status) {
        case STATUS_SUCCESS:
          store.setUserInfo(response.data);
          store.resetCartData();
          store.setRefreshHomeChange(store.refresh_home_change + 1);
          store.setOrdersKeyChange(store.orders_key_change + 1);
          store.resetAsyncStorage();
          flashShowMessage({
            message: t('signOut.successMessage'),
            type: 'success'
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
    const { t } = this.props;

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
                  color="#333"
                  style={{
                    position: 'absolute',
                    right: 15,
                    alignSelf: 'center'
                  }}
                />
              }
              // shadow
              containerStyle={styles.logoutContainerStyle}
              btnContainerStyle={styles.logoutBtn}
              titleStyle={styles.logoutTitleBtn}
              title={t('signOut.title')}
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
    backgroundColor: '#dfdfdf',
    width: '80%'
  },
  logoutTitleBtn: {
    color: '#333'
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

export default withTranslation('profileDetail')(observer(ProfileDetail));
