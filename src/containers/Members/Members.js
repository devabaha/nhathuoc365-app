import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Actions } from 'react-native-router-flux';
import appConfig from 'app-config';
import store from 'app-store';

import APIHandler from '../../network/APIHandler';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import NoResult from '../../components/NoResult';
import Modal from '../../components/account/Transfer/Payment/Modal';
import Member from './Member';

const NoResultComp = (
  <View style={{ marginTop: '50%' }}>
    <NoResult message="Danh sách thành viên đang trống" />
  </View>
);

class Members extends Component {
  state = {
    loading: true,
    refreshing: false,
    addUserLoading: false,
    members: null,
    modalConfirmVisible: false,
    selectedMember: {}
  };
  unmounted = false;
  stopUserLoading = true;

  componentDidMount() {
    this.getMembers();
  }

  async getMembers() {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_list_user_room(
        this.props.siteId,
        this.props.roomId
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({
              title_users: response.data.title_users,
              members: response.data.users
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('get_members', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  }

  async deleteMember(member_id) {
    const { t } = this.props;
    const data = { member_id };
    try {
      const response = await APIHandler.site_delete_user_room(
        this.props.siteId,
        this.props.roomId,
        data
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            this.setState({
              members: response.data.users
            });
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('delete_members', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false
        });
    }
  }

  onAddMemberPress = () => {
    Actions.push(appConfig.routes.memberModal, {
      title: 'Thêm thành viên',
      btnTitle: 'Thêm',
      placeholder: 'Nhập sđt để thêm thành viên...',
      onCloseModal: Actions.pop,
      siteId: this.props.siteId,
      roomId: this.props.roomId,
      onSuccess: ({ users: members }) => {
        !this.unmounted && this.setState({ members });
      }
    });
  };

  handleMorePress = member => {
    this.setState({
      modalConfirmVisible: true,
      selectedMember: member
    });
  };

  onCloseModal = () => {
    this.setState({
      modalConfirmVisible: false,
      selectedMember: {}
    });
  };

  onOkModal = () => {
    this.setState({ loading: true });
    this.deleteMember(this.state.selectedMember.id);
    this.onCloseModal();
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getMembers();
  };

  renderMember = ({ item: member }) => {
    return (
      <Member
        avatar={member.avatar}
        title={member.name}
        subTitle={member.tel}
        isMemberAsOwner={this.props.owner_id === member.id}
        isUserAsOwner={this.props.owner_id === store.user_info.id}
        onMorePress={() => this.handleMorePress(member)}
      />
    );
  };

  render() {
    const isUserAsOwner = this.props.owner_id === store.user_info.id;
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {!!this.state.members && (
          <FlatList
            data={this.state.members}
            renderItem={this.renderMember}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            ListEmptyComponent={NoResultComp}
          />
        )}
        {isUserAsOwner && (
          <Button
            title="Thêm thành viên"
            iconLeft={<Icon name="user-plus" style={styles.icon} />}
            onPress={this.onAddMemberPress}
          />
        )}
        <Modal
          visible={this.state.modalConfirmVisible}
          title="Chú ý!"
          content={`Bạn có chắc chắn muốn xóa${` ${this.state.selectedMember.name} `}khỏi căn hộ không?`}
          okText="Xóa"
          cancelText="Hủy"
          onRequestClose={this.onCloseModal}
          onCancel={this.onCloseModal}
          onOk={this.onOkModal}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#fff'
  },
  icon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 7
  }
});

export default withTranslation()(Members);
