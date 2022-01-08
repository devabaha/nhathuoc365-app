import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// configs
import store from 'app-store';
// helpers
import {servicesHandler} from 'app-helper/servicesHandler';
import EventTracker from 'app-helper/EventTracker';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import ListServices from 'src/components/Home/component/ListServices';
import Loading from 'src/components/Loading';
import {
  ScreenWrapper,
  RefreshControl,
  ScrollView,
  Container,
} from 'src/components/base';
import NoResult from 'src/components/NoResult';

const styles = StyleSheet.create({
  serviceList: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
  },
});

class AllServices extends Component {
  static contextType = ThemeContext;

  state = {
    loading: true,
    refreshing: false,
    services: null,
  };
  getServicesRequest = new APIRequest();
  requests = [this.getServicesRequest];
  eventTracker = new EventTracker();
  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  componentDidMount() {
    this.getServices();
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
    this.eventTracker.clearTracking();
    this.updateNavBarDisposer();
  }

  async getServices() {
    const {t} = this.props;

    try {
      this.getServicesRequest.data = APIHandler.user_get_services();
      const response = await this.getServicesRequest.promise();
      console.log(response);

      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            services: response.data.services || [],
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message'),
        });
      }
    } catch (err) {
      console.log('get_services', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message'),
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

  handlePressService = (service) => {
    const {t} = this.props;
    servicesHandler(service, t);
  };

  onRefresh = () => {
    this.setState({refreshing: true});
    this.getServices();
  };

  render() {
    return (
      <ScreenWrapper>
        {this.state.loading && <Loading center />}
        <Container flex>
          <ScrollView
            safeLayout
            refreshControl={
              <RefreshControl
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
              />
            }>
            {!!this.state.services ? (
              <ListServices
                containerStyle={styles.serviceList}
                listService={this.state.services}
                notify={store.notify}
                onItemPress={this.handlePressService}
              />
            ) : (
              !this.state.loading && (
                <NoResult message={this.props.t('noResult')} />
              )
            )}
          </ScrollView>
        </Container>
      </ScreenWrapper>
    );
  }
}

export default withTranslation()(AllServices);
