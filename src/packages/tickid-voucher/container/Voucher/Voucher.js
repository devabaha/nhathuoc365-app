import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import VoucherComponent from '../../component/Voucher';
import CampaignEntity from '../../entity/CampaignEntity';
import { internalFetch } from '../../helper/apiFetch';
import store from 'app-store';
import { showMessage } from '../../constants';
import EventTracker from '../../../../helper/EventTracker';

class Voucher extends BaseContainer {
  static propTypes = {
    from: PropTypes.oneOf(['home', 'deeplink'])
  };

  static defaultProps = {
    from: undefined
  };

  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      apiFetching: false,
      provinceSelected: '',
      campaigns: [],
      newVoucherNum: 0
    };
    this.eventTracker = new EventTracker();
  }

  get isFromHome() {
    return this.props.from === 'home';
  }

  componentDidMount() {
    this.getListCampaigns();
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handlePressVoucher = campaign => {
    config.route.push(config.routes.voucherDetail, {
      campaignId: campaign.data.id,
      from: this.props.from,
      title: campaign.data.title,
      forceReload: this.getListCampaigns
    });
  };

  handlePressMyVoucher = () => {
    config.route.push(config.routes.myVoucher, {
      from: this.props.from,
      forceReload: this.getListCampaigns
    });
  };

  handlePressSelectProvince = ({ setProvince, provinceSelected }) => {
    config.route.push(config.routes.voucherSelectProvince, {
      provinceSelected: provinceSelected,
      onSelectProvince: setProvince,
      onClose: config.route.pop
    });
  };

  getListCampaigns = async (city = '', showLoading = true) => {
    if (showLoading) {
      this.setState({ apiFetching: true });
    }
    const { t } = this.props;
    try {
      const options = {
        method: 'POST'
      };
      if (city) {
        options.body = { city };
      }
      const response = await internalFetch(
        config.rest.listCampaigns(),
        options
      );
      if (response.status === config.httpCode.success) {
        const campaigns = response.data.campaigns.map(
          campaign => new CampaignEntity(campaign)
        );

        if (store.deep_link_data) {
          const campaign = campaigns.find(
            campaign => campaign.data.id === store.deep_link_data.id
          );
          if (campaign) {
            this.handlePressVoucher(campaign);
          } else {
            showMessage({
              type: 'danger',
              message: t('api.error.notFound')
            });
          }
        }

        this.setState({
          campaigns,
          newVoucherNum: response.data.new_voucher_num,
          provinceSelected: response.data.city
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({
        refreshing: false,
        apiFetching: false
      });
      store.setDeepLinkData(null);
    }
  };

  handleOnRefresh = () => {
    this.setState({ refreshing: true });

    setTimeout(() => {
      const apiFetching = false;
      this.getListCampaigns(this.state.provinceSelected, apiFetching);
    }, 1000);
  };

  handleSetProvince = provinceSelected => {
    this.setState({ provinceSelected });
    this.getListCampaigns(provinceSelected);
  };

  render() {
    return (
      <VoucherComponent
        refreshing={this.state.refreshing}
        apiFetching={this.state.apiFetching}
        provinceSelected={this.state.provinceSelected}
        campaigns={this.state.campaigns}
        newVoucherNum={this.state.newVoucherNum}
        onPressVoucher={this.handlePressVoucher}
        onPressMyVoucher={this.handlePressMyVoucher}
        onRefresh={this.handleOnRefresh}
        onPressSelectProvince={this.handlePressSelectProvince.bind(this, {
          setProvince: this.handleSetProvince,
          provinceSelected: this.state.provinceSelected
        })}
        t={this.props.t}
      />
    );
  }
}

export default withTranslation('voucher')(observer(Voucher));
