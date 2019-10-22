import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import { USE_ONLINE } from '../../constants';
import BaseContainer from '../BaseContainer';
import { internalFetch } from '../../helper/apiFetch';
import MyVoucherComponent from '../../component/MyVoucher';
import CampaignEntity from '../../entity/CampaignEntity';
import { showMessage } from 'react-native-flash-message';

const defaultFn = () => {};

class MyVoucher extends BaseContainer {
  static propTypes = {
    mode: PropTypes.string,
    siteId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onUseVoucherOnlineSuccess: PropTypes.func,
    onUseVoucherOnlineFailure: PropTypes.func
  };

  static defaultProps = {
    mode: '',
    siteId: '',
    onUseVoucherOnlineSuccess: defaultFn,
    onUseVoucherOnlineFailure: defaultFn
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      apiFetching: false,
      campaigns: []
    };
  }

  get isUseOnlineMode() {
    return this.props.mode === USE_ONLINE;
  }

  componentWillMount() {
    this.validateRequiredMethods([
      'handlePressVoucher',
      'handlePressEnterVoucher'
    ]);
  }

  componentDidMount() {
    const showLoading = true;
    this.getMyVouchers(showLoading, this.props.siteId);
  }

  getMyVouchers = async (showLoading = true, siteId = null) => {
    if (showLoading) {
      this.setState({
        apiFetching: true
      });
    }

    try {
      const url = siteId
        ? config.rest.myVouchersBySiteId(siteId)
        : config.rest.myVouchers();
      const response = await internalFetch(url);
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
      this.getMyVouchers(showLoading, this.props.siteId);
    }, 1000);
  };

  useVoucherFetching;

  handlePressUseOnline = async voucher => {
    if (this.useVoucherFetching) return;
    this.useVoucherFetching = true;

    this.setState({
      apiFetching: true
    });

    try {
      const response = await internalFetch(
        config.rest.useVoucherOnline(this.props.siteId, voucher.data.id)
      );
      if (response.status === config.httpCode.success) {
        showMessage({
          type: 'success',
          message: response.message
        });
        this.props.onUseVoucherOnlineSuccess(response.data);
      } else {
        showMessage({
          type: 'danger',
          message: response.message
        });
        this.props.onUseVoucherOnlineFailure(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.useVoucherFetching = false;
      this.setState({
        refreshing: false,
        apiFetching: false
      });
    }
  };

  render() {
    return (
      <MyVoucherComponent
        onPressVoucher={this.handlePressVoucher}
        onPressEnterVoucher={this.handlePressEnterVoucher}
        onPressUseOnline={this.handlePressUseOnline}
        campaigns={this.state.campaigns}
        onRefresh={this.handleOnRefresh}
        refreshing={this.state.refreshing}
        apiFetching={this.state.apiFetching}
        isUseOnlineMode={this.isUseOnlineMode}
      />
    );
  }
}

export default MyVoucher;
