import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Clipboard } from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import Communications from 'react-native-communications';
import CardItemComponent from '../../component/CardItem';
import ModalOverlay from '../../component/ModalOverlay';
import { showMessage } from 'react-native-flash-message';
import ListItem from '../../component/ListItem';
import { internalFetch } from '../../helper/apiFetch';
import rnShare from '../../helper/rnShare';
import config from '../../config';

const MARK_AS_USED_ACTION = 0;
const MARK_AS_NO_USE_YET_ACTION = 0;
const MARK_AS_PAID_ACTION = 1;
const MARK_AS_NO_PAY_YET_ACTION = 1;
const DELETE_ACTION = 2;
const CANCEL_ACTION = 3;

class CardItem extends Component {
  static propTypes = {
    isPay: PropTypes.bool,
    isUsed: PropTypes.bool
  };

  static defaultProps = {
    isPay: false,
    isUsed: false
  };

  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      sendCardVisible: false,
      useCardNowVisible: false,
      copyCardVisible: false,
      isDeleted: false,
      isPay: props.isPay,
      isUsed: props.isUsed,
      statusView: props.statusView
    };
  }

  get isBuyCard() {
    return !!(this.props.cardCode && this.props.cardSeri);
  }

  hideSendCardModal = () => {
    this.setState({ sendCardVisible: false });
  };

  hideUseCardNowModal = () => {
    this.setState({ useCardNowVisible: false });
  };

  hideCopyCardModal = () => {
    this.setState({ copyCardVisible: false });
  };

  handleShowSendCardModal = () => {
    this.setState({
      sendCardVisible: true
    });
  };

  handleShowUseNowModal = () => {
    this.setState({
      useCardNowVisible: true
    });
  };

  handleShowCopyCardCodeModal = () => {
    this.setState({
      copyCardVisible: true
    });
  };

  handleSendAllCardInfo = cardInfo => {
    this.hideSendCardModal();
    const message = cardInfo.map(card => `${card[0]} ${card[1]}`);
    setTimeout(() => {
      rnShare({
        title: 'Gửi thẻ nạp',
        message: message.join('\n'),
        successMessage: 'Gửi thẻ nạp thành công!'
      });
    }, 500);
  };

  handleSendPrepaySyntax = syntax => {
    this.hideSendCardModal();
    setTimeout(() => {
      rnShare({
        title: 'Gửi thẻ nạp',
        message: syntax,
        successMessage: 'Gửi thẻ nạp thành công!'
      });
    }, 500);
  };

  handleSendPostpaidSyntax = syntax => {
    this.hideSendCardModal();
    setTimeout(() => {
      rnShare({
        title: 'Gửi thẻ nạp',
        message: syntax,
        successMessage: 'Gửi thẻ nạp thành công!'
      });
    }, 500);
  };

  handleCallPrepaySyntax = syntax => {
    this.hideUseCardNowModal();
    Communications.phonecall(syntax, true);
  };

  handleCallPostpaidSyntax = syntax => {
    this.hideUseCardNowModal();
    Communications.phonecall(syntax, true);
  };

  handleCopyCardCodeAndSeri = cardInfo => {
    this.hideCopyCardModal();
    const codeAndSeri = cardInfo.map(card => `${card[0]} ${card[1]}`);
    Clipboard.setString(codeAndSeri);
    showMessage({
      type: 'info',
      message: 'Đã sao chép mã thẻ và số seri'
    });
  };

  handleCopyCardCode = cardCode => {
    this.hideCopyCardModal();
    Clipboard.setString(cardCode);
    showMessage({
      type: 'info',
      message: 'Đã sao chép mã thẻ'
    });
  };

  handleCopyCardSeri = cardSeri => {
    this.hideCopyCardModal();
    Clipboard.setString(cardSeri);
    showMessage({
      type: 'info',
      message: 'Đã sao chép số seri'
    });
  };

  handleCopyPrepaySyntax = prepaySyntax => {
    this.hideCopyCardModal();
    Clipboard.setString(prepaySyntax);
    showMessage({
      type: 'info',
      message: 'Đã sao chép cú pháp nạp trả trước'
    });
  };

  handleCopyPostpaidSyntax = postpaidSyntax => {
    this.hideCopyCardModal();
    Clipboard.setString(postpaidSyntax);
    showMessage({
      type: 'info',
      message: 'Đã sao chép cú pháp nạp trả sau'
    });
  };

  handleOnOpenMoreMenu = () => {
    this.refActionSheet.show();
  };

  renderSendCardModal = () => {
    const allCardInfo = [
      ['Nhà mạng:', 'Viettel'],
      ['Số thẻ:', this.props.cardCode],
      ['Số seri:', this.props.cardSeri],
      ['Cú pháp nạp:', this.props.syntaxPrepaid]
    ];
    return (
      <ModalOverlay
        visible={this.state.sendCardVisible}
        heading="Gửi thông tin thẻ nạp"
        onClose={this.hideSendCardModal}
      >
        <ListItem
          heading="Gửi toàn bộ thông tin thẻ"
          texts={allCardInfo}
          onPress={() => this.handleSendAllCardInfo(allCardInfo)}
        />
        <ListItem
          heading="Cú pháp nạp thẻ trả trước"
          text={this.props.syntaxPrepaid}
          onPress={() => this.handleSendPrepaySyntax(this.props.syntaxPrepaid)}
        />
        <ListItem
          heading="Cú pháp nạp thẻ trả sau"
          text={this.props.syntaxPostpaid}
          onPress={() =>
            this.handleSendPostpaidSyntax(this.props.syntaxPostpaid)
          }
        />
      </ModalOverlay>
    );
  };

  renderUseCardNowModal = () => {
    return (
      <ModalOverlay
        visible={this.state.useCardNowVisible}
        heading="Nạp ngay"
        onClose={this.hideUseCardNowModal}
      >
        <ListItem
          heading="Cú pháp nạp thẻ trả trước"
          text={this.props.syntaxPrepaid}
          onPress={() => this.handleCallPrepaySyntax(this.props.syntaxPrepaid)}
        />
        <ListItem
          heading="Cú pháp nạp thẻ trả sau"
          text={this.props.syntaxPostpaid}
          onPress={() =>
            this.handleCallPostpaidSyntax(this.props.syntaxPostpaid)
          }
        />
      </ModalOverlay>
    );
  };

  renderCopyCardModal = () => {
    return (
      <ModalOverlay
        visible={this.state.copyCardVisible}
        heading="Sao chép thẻ nạp"
        onClose={this.hideCopyCardModal}
      >
        <ListItem
          heading="Sao chép mã thẻ và số seri"
          texts={[
            ['Số thẻ:', this.props.cardCode],
            ['Số seri:', this.props.cardSeri]
          ]}
          onPress={() =>
            this.handleCopyCardCodeAndSeri([
              ['Số thẻ:', this.props.cardCode],
              ['Số seri:', this.props.cardSeri]
            ])
          }
        />
        <ListItem
          heading="Sao chép mã thẻ"
          text={this.props.cardCode}
          onPress={() => this.handleCopyCardCode(this.props.cardCode)}
        />
        <ListItem
          heading="Sao chép số seri"
          text={this.props.cardSeri}
          onPress={() => this.handleCopyCardSeri(this.props.cardSeri)}
        />
        <ListItem
          heading="Sao chép cú pháp nạp thẻ trả trước"
          text={this.props.syntaxPrepaid}
          onPress={() => this.handleCopyPrepaySyntax(this.props.syntaxPrepaid)}
        />
        <ListItem
          heading="Sao chép cú pháp nạp thẻ trả sau"
          text={this.props.syntaxPostpaid}
          onPress={() =>
            this.handleCopyPostpaidSyntax(this.props.syntaxPostpaid)
          }
        />
      </ModalOverlay>
    );
  };

  get moreOptions() {
    const options = [];

    if (this.isBuyCard) {
      if (this.state.isUsed) {
        options[MARK_AS_USED_ACTION] = 'Đánh dấu là chưa dùng';
      } else {
        options[MARK_AS_USED_ACTION] = 'Đánh dấu là đã dùng';
      }
    }
    if (this.state.isPay) {
      options[MARK_AS_PAID_ACTION] = 'Đánh dấu là chưa thanh toán';
    } else {
      options[MARK_AS_PAID_ACTION] = 'Đánh dấu là đã thanh toán';
    }

    options[DELETE_ACTION] = 'Xóa';
    options[CANCEL_ACTION] = 'Đóng lại';
    return options;
  }

  handleSelectMoreOptions = index => {
    switch (this.isBuyCard ? index : index + 1) {
      case MARK_AS_USED_ACTION:
      case MARK_AS_NO_USE_YET_ACTION:
        this.handleMarkAsUsedOrNot();
        break;
      case MARK_AS_PAID_ACTION:
      case MARK_AS_NO_PAY_YET_ACTION:
        this.handleMarkAsPaidOrNot();
        break;
      case DELETE_ACTION:
        const options = {
          method: 'POST',
          body: {
            delete_flag: 1
          }
        };
        internalFetch(config.rest.changeOrder(this.props.cardId), options).then(
          response => {
            showMessage({
              type: 'success',
              message: response.message
            });
            this.setState({
              isDeleted: true
            });
          }
        );
        break;
      case CANCEL_ACTION:
        break;
    }
  };

  handleMarkAsUsedOrNot = () => {
    const options = {
      method: 'POST',
      body: {
        is_used: this.state.isUsed ? 0 : 1
      }
    };
    internalFetch(config.rest.changeOrder(this.props.cardId), options).then(
      response => {
        showMessage({
          type: 'success',
          message: response.message
        });
        this.setState({
          isUsed: !!response.data.is_used,
          statusView: response.data.status_view
        });
      }
    );
  };

  handleMarkAsPaidOrNot = () => {
    const options = {
      method: 'POST',
      body: {
        is_pay: this.state.isPay ? 0 : 1
      }
    };
    internalFetch(config.rest.changeOrder(this.props.cardId), options).then(
      response => {
        showMessage({
          type: 'success',
          message: response.message
        });
        this.setState({
          isPay: !!response.data.is_pay,
          statusView: response.data.status_view
        });
      }
    );
  };

  render() {
    if (this.state.isDeleted) {
      return null;
    }
    return (
      <Fragment>
        <CardItemComponent
          cardId={this.props.cardId}
          networkType={this.props.networkType}
          networkName={this.props.networkName}
          price={this.props.price}
          isBuyCard={this.isBuyCard}
          buyTime={this.props.buyTime}
          cardCode={this.props.cardCode}
          cardSeri={this.props.cardSeri}
          isUsed={this.state.isUsed}
          isPay={this.state.isPay}
          showMoreMenu={this.props.showMoreMenu}
          statusView={this.state.statusView}
          onUseNow={this.handleShowUseNowModal}
          onSendCard={this.handleShowSendCardModal}
          onOpenMoreMenu={this.handleOnOpenMoreMenu}
          onCopyCardCode={this.handleShowCopyCardCodeModal}
        />

        {this.renderSendCardModal()}

        {this.renderUseCardNowModal()}

        {this.renderCopyCardModal()}

        <ActionSheet
          ref={ref => (this.refActionSheet = ref)}
          title={'Tùy chọn khác'}
          options={this.moreOptions}
          cancelButtonIndex={this.isBuyCard ? CANCEL_ACTION : CANCEL_ACTION - 1}
          destructiveButtonIndex={
            this.isBuyCard ? DELETE_ACTION : DELETE_ACTION - 1
          }
          onPress={this.handleSelectMoreOptions}
        />
      </Fragment>
    );
  }
}

export default CardItem;
