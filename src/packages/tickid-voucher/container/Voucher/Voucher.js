import React from 'react';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import VoucherComponent from '../../component/Voucher';
import CampaignEntity from '../../entity/CampaignEntity';
import { internalFetch } from '../../helper/apiFetch';

class Voucher extends BaseContainer {
  constructor(props) {
    super(props);

    this.state = {
      refreshing: false,
      provinceSelected: { id: 2, name: 'Hồ Chí Minh' },
      campaigns: [],
      newVoucherNum: 0
    };
  }

  componentWillMount() {
    this.validateRequiredMethods([
      'handlePressVoucher',
      'handlePressMyVoucher',
      'handlePressSelectProvince'
    ]);
  }

  componentDidMount() {
    this.getListCampaigns();
  }

  getListCampaigns = async () => {
    try {
      const response = await internalFetch(config.rest.listCampaigns());
      if (response.status === config.httpCode.success) {
        this.setState({
          campaigns: response.data.campaigns.map(
            campaign => new CampaignEntity(campaign)
          ),
          newVoucherNum: response.data.new_voucher_num
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      this.setState({ refreshing: false });
    }
  };

  handleOnRefresh = () => {
    this.setState({ refreshing: true });
    setTimeout(this.getListCampaigns, 1000);
  };

  handleSetProvince = provinceSelected => {
    this.setState({ provinceSelected });
  };

  render() {
    return (
      <VoucherComponent
        refreshing={this.state.refreshing}
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
      />
    );
  }
}

export default Voucher;
