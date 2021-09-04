import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  RefreshControl,
  View,
  TouchableHighlight,
} from 'react-native';
import PropTypes from 'prop-types';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/AntDesign';

import appConfig from 'app-config';

import Request from './Request';
import Loading from '../../components/Loading';
import NoResult from '../../components/NoResult';
import Button from '../../components/Button';
import {servicesHandler, SERVICES_TYPE} from 'src/helper/servicesHandler';
import {REQUEST_TYPE} from 'src/constants';

/**
 * A list of all request of this site
 *
 * @version 1.0.1
 * @author [Nguyễn Hoàng Minh](https://github.com/minhnguyenit14)
 */
class Requests extends Component {
  static propTypes = {
    siteId: PropTypes.string.isRequired,
  };
  state = {
    loading: true,
    refreshing: false,
    requests: null,
  };
  /**
   * @todo will true when component unmount
   * @todo prevent setState or doing anything when component unmounted
   */
  unmounted = false;

  componentDidMount() {
    this.getRequests();
    setTimeout(() => {
      Actions.refresh({
        title: this.props.title || this.props.t('screen.requests.mainTitle'),
        right: this.renderRight(),
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
          onPress={this.createRequest}>
          <View style={styles.nav_right_btn}>
            <Icon name="plus" size={22} color="#ffffff" />
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  createRequest = () => {
    servicesHandler({
      type: SERVICES_TYPE.CREATE_REQUEST,
      site_id: this.props.siteId,
      room_id: this.props.roomId,
      object_id: this.props.object_id || this.props.objectId,
      request_type: this.props.request_type || this.props.requestType,
      onRefresh: (request) => {
        this.getRequests();
        setTimeout(() =>
          servicesHandler({
            type: SERVICES_TYPE.REQUEST_DETAIL,
            site_id: this.props.siteId,
            room_id: this.props.roomId,
            request_id: request.id,
          }),
        );
      },
    });
  };

  getRequests = async () => {
    const {t} = this.props;
    try {
      const response = await APIHandler.site_requests_room(
        this.props.siteId,
        this.props.roomId,
      );

      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            requests: response.data.requests,
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      }
    } catch (error) {
      console.log('get_requests', error);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false,
        });
    }
  };

  handlePressRequest(request) {
    servicesHandler({
      type: SERVICES_TYPE.REQUEST_DETAIL,
      site_id: this.props.siteId || this.props.site_id,
      room_id: this.props.roomId || this.props.room_id,
      request_id: request.id,
      callbackReload: this.getRequests,
    });
  }

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getRequests();
  };

  renderRequest = ({item: request}) => {
    return (
      <Request
        wrapperStyle={styles.requestItemWrapper}
        containerStyle={styles.requestItemContainer}
        title={request.title}
        subTitle={request.content}
        status={request.status}
        adminName={request.admin_id && request.admin_name}
        bgColor={request.color}
        textColor={request.textColor}
        description={request.created}
        subDescription={request.room_code}
        type={request.request_type}
        noti={request.unread}
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
          title="Tạo yêu cầu"
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
    justifyContent: 'flex-end',
  },
  nav_right: {
    paddingRight: 8,
  },
  nav_right_btn: {
    paddingVertical: 1,
    paddingHorizontal: 8,
    paddingTop: appConfig.device.isAndroid ? 8 : 4,
  },
  content: {
    paddingVertical: 15,
  },
  requestItemWrapper: {
    flex: 1,
    marginRight: 16,
    marginBottom: 15,
    width: undefined,
  },
  requestItemContainer: {},
  icon: {
    fontSize: 18,
    color: '#fff',
    marginRight: 7,
  },
});

export default withTranslation()(Requests);

/**
 * Component for no requests display
 */
const NoResultComp = (
  <View style={{marginTop: '50%'}}>
    <NoResult message="Danh sách yêu cầu đang trống" />
  </View>
);
