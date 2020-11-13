import React, { Component } from 'react';
import { StyleSheet, ScrollView, RefreshControl } from 'react-native';

import store from 'app-store';
import appConfig from 'app-config';
import { servicesHandler } from '../../helper/servicesHandler';
import { APIRequest } from '../../network/Entity';
import ListServices from '../../components/Home/component/ListServices';
import Loading from '../../components/Loading';
import EventTracker from '../../helper/EventTracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  serviceList: {
    backgroundColor: 'transparent'
  },
  serviceContainer: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 5,
    borderRadius: 5
  }
});

class AllServices extends Component {
  state = {
    loading: true,
    refreshing: false,
    services: null
  };
  getServicesRequest = new APIRequest();
  requests = [this.getServicesRequest];
  eventTracker = new EventTracker();

  componentDidMount() {
    this.getServices();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    cancelRequests(requests);
    this.eventTracker.clearTracking();
  }

  async getServices() {
    try {
      this.getServicesRequest.data = APIHandler.user_get_services();
      const response = await this.getServicesRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            services: response.data.services
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message')
        });
      }
    } catch (err) {
      console.log('get_services', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loading: false,
        refreshing: false
      });
    }
  }

  handlePressService = service => {
    const { t } = this.props;
    servicesHandler(service, t);
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getServices();
  };

  render() {
    return (
      <>
        {this.state.loading && <Loading center />}
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              onRefresh={this.onRefresh}
              refreshing={this.state.refreshing}
            />
          }
        >
          {!!this.state.services && (
            <ListServices
              containerStyle={styles.serviceList}
              listService={this.state.services}
              notify={store.notify}
              onItemPress={this.handlePressService}
            />
          )}
        </ScrollView>
      </>
    );
  }
}

export default withTranslation()(AllServices);
