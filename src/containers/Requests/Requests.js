import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
// helpers
import {servicesHandler} from 'src/helper/servicesHandler';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {refresh} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName} from 'src/components/base';
import {SERVICES_TYPE} from 'src/helper/servicesHandler';
// custom components
import Request from './Request';
import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import Button from 'src/components/Button';
import {
  ScreenWrapper,
  FlatList,
  Icon,
  RefreshControl,
  IconButton,
} from 'src/components/base';

/**
 * A list of all request of this site
 *
 * @version 1.0.1
 * @author [Nguyễn Hoàng Minh](https://github.com/minhnguyenit14)
 */
class Requests extends Component {
  static contextType = ThemeContext;

  static propTypes = {
    siteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
  };

  state = {
    loading: true,
    refreshing: false,
    requests: null,
    object: undefined,
  };
  /**
   * @todo will true when component unmount
   * @todo prevent setState or doing anything when component unmounted
   */
  unmounted = false;

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.getRequests();
    setTimeout(() => {
      refresh({
        title: this.props.title || this.props.t('screen.requests.mainTitle'),
        right: this.renderRight(),
      });
    });

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.unmounted = true;

    this.updateNavBarDisposer();
  }

  createRequest = () => {
    servicesHandler({
      type: SERVICES_TYPE.CREATE_REQUEST,
      site_id: this.props.siteId,
      room_id: this.props.roomId,
      object_id: this.props.object_id || this.props.objectId,
      object_type: this.props.object_type || this.props.objectType,
      object: this.state.object || this.props.object,
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
            object: response.data.object,
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

  renderRight() {
    return (
      <View style={styles.nav_right}>
        <IconButton
          bundle={BundleIconSetName.ENTYPO}
          name="plus"
          iconStyle={[styles.iconNavBar, this.iconPlusColor]}
          style={styles.nav_right_btn}
          onPress={this.createRequest}
        />
      </View>
    );
  }

  renderRequest = ({item: request}) => {
    return (
      <Request
        wrapperStyle={styles.requestItemWrapper}
        containerStyle={styles.requestItemContainer}
        tagCode={request.object?.warranty_code}
        tagName={request.object?.title}
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

  renderNoResult = () => {
    return <NoResult message={this.props.t('noResult')} />;
  };

  renderIconBtnCreate = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name="filetext1"
        style={[titleStyle, styles.icon]}
      />
    );
  };

  get iconPlusColor() {
    return {color: this.theme.color.onPrimary};
  }

  render() {
    return (
      <ScreenWrapper>
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
            ListEmptyComponent={this.renderNoResult}
          />
        )}
        {!this.state.loading && (
          <Button
            safeLayout
            title={this.props.t('createRequest')}
            renderIconLeft={this.renderIconBtnCreate}
            onPress={this.createRequest}
          />
        )}
      </ScreenWrapper>
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
    paddingLeft: 8,
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
    marginRight: 7,
  },
  iconNavBar: {
    fontSize: 28,
  },
});

export default withTranslation('request')(Requests);
