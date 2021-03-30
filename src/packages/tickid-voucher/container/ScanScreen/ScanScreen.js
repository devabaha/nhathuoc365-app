import React from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import BaseContainer from '../BaseContainer';
import ScanScreenComponent from '../../component/ScanScreen';
import { internalFetch } from '../../helper/apiFetch';
import { showMessage } from '../../constants';
import EventTracker from '../../../../helper/EventTracker';

class ScanScreen extends BaseContainer {
  static propTypes = {
    topContentText: PropTypes.string,
    placeholder: PropTypes.string,
    isFromMyVoucher: PropTypes.bool
  };

  static defaultProps = {
    topContentText: '',
    placeholder: '',
    isFromMyVoucher: false
  };

  constructor(props) {
    super(props);

    this.state = {
      showLoading: false
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  handlePressEnterCode = ({ onSendCode }) => {
    const { t } = this.props;
    config.route.push(config.routes.voucherEnterCodeManual, {
      onClose: config.route.pop,
      heading: t('scan.modal.title'),
      placeholder: this.props.placeholder,
      /**
       * In case enter code manual
       * @NOTE: pop 2 times to go back `Voucher Detail` screen
       */
      onSendCode: code => {
        config.route.pop();
        setTimeout(() => {
          config.route.pop();
          setTimeout(() => onSendCode(code), 0);
        }, 0);
      }
    });
  };

  /**
   * In case scan QR code with camera
   * @NOTE: pop 1 time to go back `Voucher Detail` screen
   */
  handleReadedCode = ({ onDone }) => {
    config.route.pop();
    setTimeout(onDone, 0);
  };

  handleShowBarcode = ({ code, voucher }) => {
    config.route.push(config.routes.voucherShowBarcode, {
      code,
      voucher
    });
  };

  handleRefreshMyVoucher() {
    this.props.refreshMyVoucher();
  }

  handleAfterReadedCode = code => {
    this.handleReadedCode({
      code,
      onDone: () =>
        this.props.isFromMyVoucher
          ? this.sendApiSaveCode(code)
          : this.sendApiUseCode(code)
    });
  };

  handleBeforeShowEnterCode = () => {
    this.handlePressEnterCode({
      onSendCode: this.props.isFromMyVoucher
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
    const { t } = this.props;
    try {
      const response = await internalFetch(config.rest.saveVoucher(code));
      if (response.status === config.httpCode.success) {
        showMessage({
          message: response.message,
          type: 'success'
        });
        this.handleRefreshMyVoucher();
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
        () => {
          showMessage({
            message: t('common:api.error.network'),
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
        topContentText={this.props.topContentText}
        t={this.props.t}
      />
    );
  }
}

export default withTranslation(['voucher', 'common'])(ScanScreen);
