import React, { Component } from 'react';
import { ScrollView, View, Text, StyleSheet, Clipboard } from 'react-native';
import Communications from 'react-native-communications';
import ActionSheet from 'react-native-actionsheet';
import CardItemComponent from '../../component/CardItem';
import ModalOverlay from '../../component/ModalOverlay';
import { showMessage } from 'react-native-flash-message';
import ListItem from '../../component/ListItem';
import rnShare from '../../helper/rnShare';
import config from '../../config';

const MARK_AS_USED_ACTION = 0;
const MARK_AS_NO_USE_YET_ACTION = 0;
const DELETE_ACTION = 1;
const CANCEL_ACTION = 2;

class CardHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cards: [],
      sendCardVisible: false,
      useCardNowVisible: false,
      copyCardVisible: false
    };
  }

  getCardById(cardId) {
    return this.state.cards.find(card => card.id === cardId);
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
    return (
      <ModalOverlay
        visible={this.state.sendCardVisible}
        heading="Gửi thông tin thẻ nạp"
        onClose={this.hideSendCardModal}
      >
        <ListItem
          heading="Gửi toàn bộ thông tin thẻ"
          texts={[
            ['Nhà mạng:', 'Viettel'],
            ['Số thẻ:', '983479345873645'],
            ['Số seri:', '05679347537'],
            ['Cú pháp nạp:', '*100*983479345873645#']
          ]}
          onPress={() =>
            this.handleSendAllCardInfo([
              ['Nhà mạng:', 'Viettel'],
              ['Số thẻ:', '983479345873645'],
              ['Số seri:', '05679347537'],
              ['Cú pháp nạp:', '*100*983479345873645#']
            ])
          }
        />
        <ListItem
          heading="Cú pháp nạp thẻ trả trước"
          text="*100*37563487536#"
          onPress={() => this.handleSendPrepaySyntax('*100*37563487536#')}
        />
        <ListItem
          heading="Cú pháp nạp thẻ trả sau"
          text="*199*37563487536#"
          onPress={() => this.handleSendPostpaidSyntax('*199*37563487536#')}
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
          text="*100*37563487536#"
          onPress={() => this.handleCallPrepaySyntax('*100*37563487536#')}
        />
        <ListItem
          heading="Cú pháp nạp thẻ trả sau"
          text="*199*37563487536#"
          onPress={() => this.handleCallPostpaidSyntax('*199*37563487536#')}
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
          texts={[['Số thẻ:', '983479345873645'], ['Số seri:', '05679347537']]}
          onPress={() =>
            this.handleCopyCardCodeAndSeri([
              ['Số thẻ:', '983479345873645'],
              ['Số seri:', '05679347537']
            ])
          }
        />
        <ListItem
          heading="Sao chép mã thẻ"
          text="37563487536"
          onPress={() => this.handleCopyCardCode('37563487536')}
        />
        <ListItem
          heading="Sao chép số seri"
          text="05679347537"
          onPress={() => this.handleCopyCardSeri('05679347537')}
        />
        <ListItem
          heading="Sao chép cú pháp nạp thẻ trả trước"
          text="*100*37563487536#"
          onPress={() => this.handleCopyPrepaySyntax('*100*37563487536#')}
        />
        <ListItem
          heading="Sao chép cú pháp nạp thẻ trả sau"
          text="*199*37563487536#"
          onPress={() => this.handleCopyPostpaidSyntax('*199*37563487536#')}
        />
      </ModalOverlay>
    );
  };

  get moreOptions() {
    const options = [];
    options[MARK_AS_USED_ACTION] = 'Đánh dấu là đã dùng';
    options[DELETE_ACTION] = 'Xóa';
    options[CANCEL_ACTION] = 'Đóng lại';
    return options;
  }

  handleSelectMoreOptions = index => {
    switch (index) {
      case MARK_AS_USED_ACTION:
      case MARK_AS_NO_USE_YET_ACTION:
        alert('Mark as used');
        break;
      case DELETE_ACTION:
        alert('Delete');
        break;
      case CANCEL_ACTION:
        break;
    }
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>09/2019</Text>

        <CardItemComponent
          cardId="001"
          networkType="viettel"
          networkName="Viettel"
          price="200.000đ"
          buyTime="29/09/2019 - 11:54"
          cardCode="4757865826328"
          cardSeri="1000348293472"
          onUseNow={this.handleShowUseNowModal}
          onSendCard={this.handleShowSendCardModal}
          onOpenMoreMenu={this.handleOnOpenMoreMenu}
          onCopyCardCode={this.handleShowCopyCardCodeModal}
        />

        <CardItemComponent
          cardId="001"
          networkType="viettel"
          networkName="Viettel"
          price="200.000đ"
          buyTime="29/09/2019 - 11:54"
          cardCode="4757865826328"
          cardSeri="1000348293472"
          onUseNow={this.handleShowUseNowModal}
          onSendCard={this.handleShowSendCardModal}
          onOpenMoreMenu={this.handleOnOpenMoreMenu}
          onCopyCardCode={this.handleShowCopyCardCodeModal}
        />

        <CardItemComponent
          cardId="001"
          networkType="viettel"
          networkName="Viettel"
          price="200.000đ"
          buyTime="29/09/2019 - 11:54"
          cardCode="4757865826328"
          cardSeri="1000348293472"
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
          cancelButtonIndex={CANCEL_ACTION}
          destructiveButtonIndex={DELETE_ACTION}
          onPress={this.handleSelectMoreOptions}
        />

        <View style={styles.bottomSpace} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff'
  },
  bottomSpace: {
    marginBottom: 16
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginLeft: 16,
    color: config.colors.black
  }
});

export default CardHistory;
