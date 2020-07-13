import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  TouchableHighlight
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/AntDesign';

import appConfig from 'app-config';

import Request from './Request';
import Loading from '../../components/Loading';
import NoResult from '../../components/NoResult';
import Button from '../../components/Button';

const NoResultComp = (
  <View style={{ marginTop: '50%' }}>
    <NoResult message="Danh sách phản ánh đang trống" />
  </View>
);

class Requests extends Component {
  state = {
    loading: true,
    refreshing: false,
    requests: null
  };
  unmounted = false;

  componentDidMount() {
    this.getRequests();
    setTimeout(() => {
      Actions.refresh({
        right: this.renderRight()
      });
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  renderRight() {
    return (
      <View style={styles.nav_right}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={this.createRequest}
        >
          <View style={styles.nav_right_btn}>
            <Icon name="plus" size={22} color="#ffffff" />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  createRequest = () => {
    Actions.push(appConfig.routes.requestCreation, {
      siteId: this.props.siteId,
      roomId: this.props.roomId,
      onRefresh: this.onRefresh
    });
  };

  getRequests = async () => {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_requests_room(
        this.props.siteId,
        this.props.roomId
      );

      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            requests: response.data.requests
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('get_requests', error);
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
  };

  handlePressRequest(request) {
    Actions.push(appConfig.routes.requestDetail, {
      siteId: this.props.siteId,
      roomId: this.props.roomId,
      requestId: request.id,
      title: request.title || this.props.t('screen.requests.detailTitle')
    });
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getRequests();
  };

  renderRequest = ({ item: request }) => {
    return (
      <Request
        wrapperStyle={styles.requestItemWrapper}
        containerStyle={styles.requestItemContainer}
        title={request.title}
        subTitle={request.content}
        status={request.status}
        color={request.color}
        description={request.created}
        onPress={() => this.handlePressRequest(request)}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {!!this.state.requests && (
          <FlatList
            contentContainerStyle={styles.content}
            data={this.state.requests}
            renderItem={this.renderRequest}
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
        <Button
          title="Tạo phản ánh"
          iconLeft={<Icon name="filetext1" style={styles.icon} />}
          onPress={this.createRequest}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  nav_right: {
    paddingRight: 8
  },
  nav_right_btn: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: appConfig.device.isAndroid ? 8 : 4
  },
  content: {
    paddingVertical: 15
  },
  requestItemWrapper: {
    flex: 1,
    marginRight: 16,
    marginBottom: 15
  },
  requestItemContainer: {
    width: '100%'
  },
  icon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 7
  }
});

export default withTranslation()(Requests);
