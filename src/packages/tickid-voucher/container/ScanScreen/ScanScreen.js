import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import ScanScreenComponent from '../../component/ScanScreen';
import { internalFetch } from '../../helper/apiFetch';
import MessageBar from '@tickid/tickid-rn-message-bar';

class ScanScreen extends BaseContainer {
  static propTypes = {
    voucher: PropTypes.object.isRequired
  };

  componentWillMount() {
    this.validateRequiredMethods([
      'handlePressEnterCode',
      'handleReadedCode',
      'handleShowBarcode'
    ]);
  }

  handleAfterReadedCode = code => {
    this.handleReadedCode({
      code,
      onDone: () => this.sendApiUseCode(code)
    });
  };

  handleBeforeShowEnterCode = () => {
    this.handlePressEnterCode({
      onSendCode: this.sendApiUseCode
    });
  };

  sendApiUseCode = async code => {
    const { voucher } = this.props;
    try {
      const response = await internalFetch(
        config.rest.useVoucher(voucher.data.id, code)
      );
      if (response.status === config.httpCode.success) {
        this.handleShowBarcode({
          code: response.data.campaign.voucher_code,
          voucher
        });
      } else {
        MessageBar.showError({
          message: response.message
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <ScanScreenComponent
        onReadedCode={this.handleAfterReadedCode}
        onPressEnterCode={this.handleBeforeShowEnterCode}
      />
    );
  }
}

export default ScanScreen;
