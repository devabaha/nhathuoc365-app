import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ShowBarcodeComponent from '../../component/ShowBarcode';
import CampaignEntity from '../../entity/CampaignEntity';

class ShowBarcode extends Component {
  static propTypes = {
    code: PropTypes.string.isRequired,
    voucher: PropTypes.instanceOf(CampaignEntity).isRequired
  };

  static defaultProps = {
    code: undefined,
    voucher: undefined
  };

  render() {
    return (
      <ShowBarcodeComponent
        code={this.props.code}
        voucher={this.props.voucher}
      />
    );
  }
}

export default ShowBarcode;
