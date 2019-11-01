import React from 'react';
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image
} from 'react-native';
import BgrStatusBar, {
  showBgrStatusIfOffsetTop
} from 'app-packages/tickid-bgr-status-bar';
import successImage from '../../assets/images/success.png';
import CardItemComponent from '../../component/CardItem';
import SubmitButton from '../../component/SubmitButton';
import { FieldItemWrapper, FieldItem } from '../../component/FieldItem';
import config from '../../config';

BuyCardSuccess.propTypes = {};

BuyCardSuccess.defaultProps = {};

function BuyCardSuccess(props) {
  const pushToCardBuyed = () => {
    config.route.push(config.routes.cardHistory);
  };

  const comeBackHome = () => {
    config.route.pushToMain();
  };

  const handleShowBgrStatusIfOffsetTop = showBgrStatusIfOffsetTop(
    'buy_card_succcess',
    140
  );

  return (
    <View style={styles.container}>
      <ScrollView
        scrollEventThrottle={16}
        onScroll={handleShowBgrStatusIfOffsetTop}
      >
        <View style={styles.header}>
          <Image source={successImage} style={styles.successImage} />
          <Text style={styles.successText}>Giao dịch thành công</Text>
        </View>

        <View style={styles.messageWrapper}>
          <Text style={styles.successMessage}>
            Quý khách đã mua thành công 1 mã thẻ điện thoại Viettel mệnh giá
            10.000đ
          </Text>
        </View>

        <View style={styles.listCards}>
          <View style={styles.listCardHeadingBox}>
            <Text style={styles.heading}>Thẻ đã mua</Text>

            <TouchableOpacity
              style={styles.viewCardBuyedBtn}
              onPress={pushToCardBuyed}
            >
              <Text style={styles.viewCardBuyedText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

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
            cardId="002"
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
        </View>

        <View style={styles.orderInfoWraper}>
          <FieldItemWrapper separate>
            <FieldItem label="Số dư trong ví" value="100.000đ" />
          </FieldItemWrapper>
          <FieldItemWrapper>
            <FieldItem label="Mã giao dịch" value="287346823" />
          </FieldItemWrapper>
        </View>
      </ScrollView>
      <SubmitButton
        onPress={comeBackHome}
        style={styles.comeHomeBtn}
        title="Màn hình chính"
      />

      <BgrStatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    marginBottom: config.device.bottomSpace
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#007575',
    paddingTop: 40,
    paddingBottom: 20
  },
  successImage: {
    width: 72,
    height: 72
  },
  successText: {
    marginTop: 16,
    fontSize: 18,
    color: config.colors.white,
    fontWeight: '600'
  },
  messageWrapper: {
    paddingHorizontal: 14,
    paddingVertical: 20,
    backgroundColor: config.colors.white
  },
  successMessage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    fontWeight: '600'
  },
  listCards: {
    marginTop: 8,
    paddingBottom: 16,
    backgroundColor: config.colors.white
  },
  listCardHeadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  heading: {
    fontWeight: 'bold',
    color: config.colors.black,
    fontSize: 18,
    marginLeft: 16
  },
  viewCardBuyedBtn: {
    padding: 16
  },
  viewCardBuyedText: {
    fontSize: 16,
    color: '#0084ff',
    textAlign: 'center',
    fontWeight: '600'
  },
  orderInfoWraper: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 8
  },
  comeHomeBtn: {
    marginTop: 8
  }

  //25AE88
});

export default BuyCardSuccess;
