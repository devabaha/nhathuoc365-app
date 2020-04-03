import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  ScrollView,
  Text,
  View,
  StyleSheet,
  Image,
  BackHandler
} from 'react-native';
import BgrStatusBar, {
  showBgrStatusIfOffsetTop
} from 'app-packages/tickid-bgr-status-bar';
import successImage from '../../assets/images/success.png';
import SubmitButton from '../../component/SubmitButton';
import { FieldItemWrapper, FieldItem } from '../../component/FieldItem';
import CardItem from '../CardItem';
import config from '../../config';

BuyCardSuccess.propTypes = {
  isBuyCard: PropTypes.bool,
  bookResponse: PropTypes.object,
  serviceId: PropTypes.string,
  historyTitle: PropTypes.string
};

function BuyCardSuccess({
  isBuyCard = false,
  bookResponse = undefined,
  historyTitle = 'Lịch sử nạp',
  serviceId = undefined
}) {
  useEffect(() => {
    function backHandlerListener() {
      return true;
    }
    BackHandler.addEventListener('hardwareBackPress', backHandlerListener);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backHandlerListener);
  });

  const pushToCardBuyed = () => {
    config.route.push(config.routes.cardHistory, {
      serviceId,
      title: historyTitle
    });
  };

  const comeBackHome = () => {
    config.route.pushToMain();
  };

  const handleShowBgrStatusIfOffsetTop = showBgrStatusIfOffsetTop(
    'buy_card_succcess',
    140
  );

  const item = bookResponse.data;

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        scrollEventThrottle={16}
        onScroll={handleShowBgrStatusIfOffsetTop}
      >
        <View style={styles.header}>
          <Image source={successImage} style={styles.successImage} />
          <Text style={styles.successText}>Giao dịch thành công</Text>
        </View>

        <View style={styles.messageWrapper}>
          <Text style={styles.successMessage}>{bookResponse.message}</Text>
        </View>

        <View style={styles.listCards}>
          <View style={styles.listCardHeadingBox}>
            <Text style={styles.heading}>
              {isBuyCard ? 'Thẻ đã mua' : 'Thông tin nạp'}
            </Text>

            <TouchableOpacity
              style={styles.viewCardBuyedBtn}
              onPress={pushToCardBuyed}
            >
              <Text style={styles.viewCardBuyedText}>Xem lịch sử</Text>
            </TouchableOpacity>
          </View>

          <CardItem
            cardId={item.id}
            networkType={item.type}
            networkName={item.name}
            price={item.price_label}
            isPay={!!item.is_pay}
            isUsed={!!item.is_used}
            buyTime={item.created}
            showMoreMenu={false}
            statusView={item.status_view}
            syntaxPrepaid={item.syntax_prepaid}
            syntaxPostpaid={item.syntax_postpaid}
            cardCode={item.data && item.data.code}
            cardSeri={item.data && item.data.serial}
          />
        </View>

        <View style={styles.orderInfoWraper}>
          <FieldItemWrapper separate>
            <FieldItem label="Trạng thái giao dịch" value={item.status_view} />
          </FieldItemWrapper>
          <FieldItemWrapper>
            <FieldItem label="Mã giao dịch" value={item.service_code} />
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
    paddingBottom: config.device.bottomSpace
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
