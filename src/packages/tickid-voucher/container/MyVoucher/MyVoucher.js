import React from 'react';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import MyVoucherComponent from '../../component/MyVoucher';
import CampaignEntity from '../../entity/CampaignEntity';
import { internalFetch } from '../../helper/apiFetch';

class MyVoucher extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      apiFetching: false,
      campaigns: []
    };
  }

  componentWillMount() {
    this.validateRequiredMethods([
      'handlePressVoucher',
      'handlePressEnterVoucher'
    ]);
  }

  componentDidMount() {
    this.getMyVouchers();
  }

  getMyVouchers = async (showLoading = true) => {
    if (showLoading) {
      this.setState({
        apiFetching: true
      });
    }

    try {
      const response = await internalFetch(config.rest.myVouchers());
      if (response.status === config.httpCode.success) {
        this.setState({
          campaigns: response.data.campaigns.map(
            campaign => new CampaignEntity(campaign)
          )
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        apiFetching: false
      });
    }
  };

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      const showLoading = false;
      this.getMyVouchers(showLoading);
    }, 1000);
  };

  render() {
    return (
      <MyVoucherComponent
        onPressVoucher={this.handlePressVoucher}
        onPressEnterVoucher={this.handlePressEnterVoucher}
        onRefresh={this.handleOnRefresh}
        refreshing={this.state.refreshing}
        apiFetching={this.state.apiFetching}
        campaigns={this.state.campaigns}
      />
    );
  }
}

export default MyVoucher;
