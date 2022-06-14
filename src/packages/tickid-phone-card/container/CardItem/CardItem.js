import React, {Component} from 'react';
import PropTypes from 'prop-types';
// 3-party libs
import Clipboard from '@react-native-community/clipboard';
import {withTranslation} from 'react-i18next';
// configs
import config from '../../config';
// network
import {internalFetch} from '../../helper/apiFetch';
// helpers
import rnShare from '../../helper/rnShare';
import {showMessage} from '../../constants';
// entities
import Communications from 'app-helper/Communications';
// custom components
import CardItemComponent from '../../component/CardItem';
import ModalOverlay from '../../component/ModalOverlay';
import ListItem from '../../component/ListItem';

const MARK_AS_USED_ACTION = 0;
const MARK_AS_NO_USE_YET_ACTION = 0;
const MARK_AS_PAID_ACTION = 1;
const MARK_AS_NO_PAY_YET_ACTION = 1;
const DELETE_ACTION = 2;
const CANCEL_ACTION = 3;

class CardItem extends Component {
  static propTypes = {
    isPay: PropTypes.bool,
    isUsed: PropTypes.bool,
  };

  static defaultProps = {
    isPay: false,
    isUsed: false,
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
      statusView: props.statusView,
    };
  }

  get isBuyCard() {
    return !!(this.props.cardCode && this.props.cardSeri);
  }

  hideSendCardModal = () => {
    this.setState({sendCardVisible: false});
  };

  hideUseCardNowModal = () => {
    this.setState({useCardNowVisible: false});
  };

  hideCopyCardModal = () => {
    this.setState({copyCardVisible: false});
  };

  handleShowSendCardModal = () => {
    this.setState({
      sendCardVisible: true,
    });
  };

  handleShowUseNowModal = () => {
    this.setState({
      useCardNowVisible: true,
    });
  };

  handleShowCopyCardCodeModal = () => {
    this.setState({
      copyCardVisible: true,
    });
  };

  handleSendAllCardInfo = (cardInfo) => {
    this.hideSendCardModal();
    const message = cardInfo.map((card) => `${card[0]} ${card[1]}`);
    this.sendCard(message.join('\n'));
  };

  handleSendPrepaySyntax = (syntax) => {
    this.hideSendCardModal();
    this.sendCard(syntax);
  };

  handleSendPostpaidSyntax = (syntax) => {
    this.hideSendCardModal();
    this.sendCard(syntax);
  };

  sendCard = (message) => {
    setTimeout(() => {
      rnShare({
        title: this.props.t('sendCard'),
        message,
        successMessage: this.props.t('sendCardSuccess'),
      });
    }, 500);
  };

  handleCallPrepaySyntax = (syntax) => {
    this.hideUseCardNowModal();
    Communications.phonecall(syntax, true);
  };

  handleCallPostpaidSyntax = (syntax) => {
    this.hideUseCardNowModal();
    Communications.phonecall(syntax, true);
  };

  handleCopyCardCodeAndSeri = (cardInfo) => {
    this.hideCopyCardModal();
    const codeAndSeri = cardInfo.map((card) => `${card[0]} ${card[1]}`);
    Clipboard.setString(codeAndSeri);
    showMessage({
      type: 'success',
      message: this.props.t('copiedCardCodeAndSerial'),
    });
  };

  handleCopyCardCode = (cardCode) => {
    this.hideCopyCardModal();
    Clipboard.setString(cardCode);
    showMessage({
      type: 'success',
      message: this.props.t('copiedCardCode'),
    });
  };

  handleCopyCardSeri = (cardSeri) => {
    this.hideCopyCardModal();
    Clipboard.setString(cardSeri);
    showMessage({
      type: 'success',
      message: this.props.t('copiedSerial'),
    });
  };

  handleCopyPrepaySyntax = (prepaySyntax) => {
    this.hideCopyCardModal();
    Clipboard.setString(prepaySyntax);
    showMessage({
      type: 'success',
      message: this.props.t('copiedPrepaidSyntax'),
    });
  };

  handleCopyPostpaidSyntax = (postpaidSyntax) => {
    this.hideCopyCardModal();
    Clipboard.setString(postpaidSyntax);
    showMessage({
      type: 'success',
      message: this.props.t('copiedPostpaidSyntax'),
    });
  };

  handleOnOpenMoreMenu = () => {
    config.route.push(config.routes.modalActionSheet, {
      title: this.props.t('common:otherOptions'),
      options: this.moreOptions,
      cancelButtonIndex: this.isBuyCard ? CANCEL_ACTION : CANCEL_ACTION - 1,
      destructiveButtonIndex: this.isBuyCard
        ? DELETE_ACTION
        : DELETE_ACTION - 1,
      onPress: this.handleSelectMoreOptions,
    });
  };

  renderSendCardModal = () => {
    const allCardInfo = [
      [`${this.props.t('network')}:`, 'Viettel'],
      [`${this.props.t('cardNumber')}:`, this.props.cardCode],
      [`${this.props.t('serialNumber')}:`, this.props.cardSeri],
      [`${this.props.t('rechargeSyntax')}:`, this.props.syntaxPrepaid],
    ];
    return (
      <ModalOverlay
        visible={this.state.sendCardVisible}
        heading={this.props.t('sendCardInfo')}
        onClose={this.hideSendCardModal}>
        <ListItem
          heading={this.props.t('sendFullCardInfo')}
          texts={allCardInfo}
          onPress={() => this.handleSendAllCardInfo(allCardInfo)}
        />
        <ListItem
          heading={this.props.t('cardPrepaidRechargeSyntax')}
          text={this.props.syntaxPrepaid}
          onPress={() => this.handleSendPrepaySyntax(this.props.syntaxPrepaid)}
        />
        <ListItem
          heading={this.props.t('cardPostpaidRechargeSyntax')}
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
        heading={this.props.t('rechargeNow')}
        onClose={this.hideUseCardNowModal}>
        <ListItem
          heading={this.props.t('cardPrepaidRechargeSyntax')}
          text={this.props.syntaxPrepaid}
          onPress={() => this.handleCallPrepaySyntax(this.props.syntaxPrepaid)}
        />
        <ListItem
          heading={this.props.t('cardPostpaidRechargeSyntax')}
          text={this.props.syntaxPostpaid}
          onPress={() =>
            this.handleCallPostpaidSyntax(this.props.syntaxPostpaid)
          }
        />
      </ModalOverlay>
    );
  };

  renderCopyCardModal = () => {
    const cardData = [
      [`${this.props.t('cardNumber')}:`, this.props.cardCode],
      [`${this.props.t('serialNumber')}:`, this.props.cardSeri],
    ];

    return (
      <ModalOverlay
        visible={this.state.copyCardVisible}
        heading={this.props.t('copyCard')}
        onClose={this.hideCopyCardModal}>
        <ListItem
          heading={this.props.t('copyCardCodeAndSerial')}
          texts={cardData}
          onPress={() => this.handleCopyCardCodeAndSeri(cardData)}
        />
        <ListItem
          heading={this.props.t('copyCardCode')}
          text={this.props.cardCode}
          onPress={() => this.handleCopyCardCode(this.props.cardCode)}
        />
        <ListItem
          heading={this.props.t('copySerial')}
          text={this.props.cardSeri}
          onPress={() => this.handleCopyCardSeri(this.props.cardSeri)}
        />
        <ListItem
          heading={this.props.t('copyPrepaidSyntax')}
          text={this.props.syntaxPrepaid}
          onPress={() => this.handleCopyPrepaySyntax(this.props.syntaxPrepaid)}
        />
        <ListItem
          heading={this.props.t('copyPostpaidSyntax')}
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
        options[MARK_AS_USED_ACTION] = this.props.t('markAsUnused');
      } else {
        options[MARK_AS_USED_ACTION] = this.props.t('markAsUsed');
      }
    }
    if (this.state.isPay) {
      options[MARK_AS_PAID_ACTION] = this.props.t('markAsUnpaid');
    } else {
      options[MARK_AS_PAID_ACTION] = this.props.t('markAsPaid');
    }

    options[DELETE_ACTION] = this.props.t('common:delete');
    options[CANCEL_ACTION] = this.props.t('common:cancel');
    return options;
  }

  handleSelectMoreOptions = (index) => {
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
            delete_flag: 1,
          },
        };
        internalFetch(config.rest.changeOrder(this.props.cardId), options).then(
          (response) => {
            showMessage({
              type: response?.status === STATUS_SUCCESS ? 'success' : 'danger',
              message:
                response.message || this.props.t('common:api.error.message'),
            });
            this.setState({
              isDeleted: true,
            });
          },
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
        is_used: this.state.isUsed ? 0 : 1,
      },
    };
    internalFetch(config.rest.changeOrder(this.props.cardId), options).then(
      (response) => {
        showMessage({
          type: response?.status === STATUS_SUCCESS ? 'success' : 'danger',
          message: response.message || this.props.t('common:api.error.message'),
        });
        this.setState({
          isUsed: !!response.data.is_used,
          statusView: response.data.status_view,
        });
      },
    );
  };

  handleMarkAsPaidOrNot = () => {
    const options = {
      method: 'POST',
      body: {
        is_pay: this.state.isPay ? 0 : 1,
      },
    };
    internalFetch(config.rest.changeOrder(this.props.cardId), options).then(
      (response) => {
        showMessage({
          type: response?.status === STATUS_SUCCESS ? 'success' : 'danger',
          message: response.message || this.props.t('common:api.error.message'),
        });
        this.setState({
          isPay: !!response.data.is_pay,
          statusView: response.data.status_view,
        });
      },
    );
  };

  render() {
    if (this.state.isDeleted) {
      return null;
    }
    return (
      <>
        <CardItemComponent
          cardId={this.props.cardId}
          networkType={this.props.networkType}
          networkName={this.props.networkName}
          code={this.props.code}
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
      </>
    );
  }
}

export default withTranslation(['phoneCard', 'common'])(CardItem);
