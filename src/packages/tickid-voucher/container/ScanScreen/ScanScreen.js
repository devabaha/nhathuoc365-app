import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import ScanScreenComponent from '../../component/ScanScreen';
import { internalFetch } from '../../helper/apiFetch';
import { showMessage } from 'react-native-flash-message';

class ScanScreen extends BaseContainer {
  static propTypes = {
    voucher: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showLoading: false
    };
  }

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
      onDone: () =>
        this.isFromMyVoucher
          ? this.sendApiSaveCode(code)
          : this.sendApiUseCode(code)
    });
  };

  handleBeforeShowEnterCode = () => {
    this.handlePressEnterCode({
      onSendCode: this.isFromMyVoucher
        ? this.sendApiSaveCode
        : this.sendApiUseCode
    });
  };

  apiSending;

  sendApiUseCode = async code => {
    if (this.apiSending) return;

    this.apiSending = true;

    this.setState({
      showLoading: true
    });

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
        showMessage({
          message: response.message,
          type: 'danger'
        });
      }
    } catch (error) {
      console.log(error);
      this.setState({
        showLoading: false
      });
      this.apiSending = false;
    }
  };

  sendApiSaveCode = async code => {
    if (this.apiSending) return;

    this.apiSending = true;

    this.setState({
      showLoading: true
    });

    try {
      const response = await internalFetch(config.rest.useVoucher(code));
      if (response.status === config.httpCode.success) {
        showMessage({
          message: 'Bạn đã nhận thành công voucher này.',
          type: 'success'
        });
      } else {
        showMessage({
          message: response.message,
          type: 'danger'
        });
      }
    } catch (error) {
      console.log(error);
      this.setState(
        {
          showLoading: false
        },
        function() {
          showMessage({
            message: 'Kết nối tới máy chủ thất bại. Vui lòng thử lại sau',
            type: 'danger'
          });
        }
      );
      this.apiSending = false;
    }
  };

  render() {
    return (
      <ScanScreenComponent
        onReadedCode={this.handleAfterReadedCode}
        onPressEnterCode={this.handleBeforeShowEnterCode}
        showLoading={this.state.showLoading}
        topContentText={this.topContentText}
      />
    );
  }
}

export default ScanScreen;
