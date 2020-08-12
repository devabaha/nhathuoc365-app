import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  Easing,
  Animated
} from 'react-native';
import Loading from '../../../../components/Loading';
import NoResult from '../../../../components/NoResult';
import HomeCardList from '../../../../components/Home/component/HomeCardList';
import Bill, { QuickPayment } from './Bill';

class Bills extends Component {
  state = {
    loading: true,
    refreshing: false,
    billsComplete: null,
    billsInComplete: null,
    quickPaymentHeight: undefined,
    inCompleteBillsScrollY: 0,
    scrollViewHeight: 0,
    titleBillsComplete: '',
    titleBillsInComplete: '',
    scrollY: new Animated.Value(0),
    animatedQuickPaymentTranslateY: new Animated.Value(0)
  };
  unmounted = false;

  get isBillsEmpty() {
    return (
      !!this.state.billsComplete &&
      !!this.state.billsInComplete &&
      this.state.billsInComplete.length === 0 &&
      this.state.billsComplete.length === 0
    );
  }

  get hasIncompleteBills() {
    return (
      !!this.state.billsInComplete && this.state.billsInComplete.length !== 0
    );
  }

  get hasCompleteBills() {
    return !!this.state.billsComplete && this.state.billsComplete.length !== 0;
  }

  get totalBillIncompletePrice() {
    return vndCurrencyFormat(
      this.state.billsInComplete.reduce(
        (prev, next) => (prev.price || prev) + (next.price || 0),
        0
      )
    );
  }

  componentDidMount() {
    this.getBills();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  getBills = async () => {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_bills_room(
        this.props.siteId,
        this.props.roomId
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            billsComplete: response.data.bills_complete,
            titleBillsComplete: response.data.title_bills_complete,
            billsInComplete: response.data.bills_incomplete,
            titleBillsInComplete: response.data.title_bills_incomplete
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (err) {
      console.log('get_all_bills', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      !this.unmounted &&
        this.setState({
          loading: false,
          refreshing: false
        });
    }
  };

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getBills();
  };

  handleLayoutInCompleteBills = e => {
    const { y, height } = e.nativeEvent.layout;
    this.setState({
      inCompleteBillsScrollY: height
    });
  };

  handleLayoutScrollView = e => {
    this.setState({
      scrollViewHeight: e.nativeEvent.layout.height
    });
  };

  handleLayoutQuickPayment = e => {
    const { height } = e.nativeEvent.layout;
    this.setState({
      quickPaymentHeight: height
    });
    this.state.animatedQuickPaymentTranslateY.setValue(height);
    Animated.timing(this.state.animatedQuickPaymentTranslateY, {
      toValue: 0,
      duration: 300,
      easing: Easing.quad,
      useNativeDriver: true,
      delay: 100
    }).start();
  };

  renderBill(index, bill) {
    return (
      <Bill
        disabled
        index={index + 1}
        wrapperStyle={styles.billItemWrapper}
        status={bill.status}
        title={bill.title}
        period={bill.payment_period}
        price={bill.price_view}
      />
    );
  }

  renderQuickPayment = () => {
    return (
      <QuickPayment
        prefix={'Tổng tiền:   '}
        price={this.totalBillIncompletePrice}
        onPress={this.props.onPayBill}
      />
    );
  };

  renderQuickPaymentShortcut() {
    const positionY =
      this.state.inCompleteBillsScrollY - this.state.scrollViewHeight;
    const extraStyle =
      this.state.inCompleteBillsScrollY &&
      this.state.scrollViewHeight &&
      positionY > 0
        ? {
            position: 'absolute',
            bottom: 15,
            width: '100%',
            zIndex: 1,
            opacity: this.state.scrollY.interpolate({
              inputRange: [0, positionY - 1, positionY],
              outputRange: [1, 1, 0]
            }),
            transform: [
              {
                translateY: this.state.scrollY.interpolate({
                  inputRange: [positionY, positionY + 1],
                  outputRange: [0, this.state.quickPaymentHeight || 0],
                  extrapolateLeft: 'clamp'
                })
              }
            ]
          }
        : {
            position: 'absolute',
            opacity: 0
          };

    const wrapperStyle = {
      transform: [
        {
          translateY: this.state.animatedQuickPaymentTranslateY
        }
      ]
    };
    return (
      <Animated.View
        onLayout={this.handleLayoutQuickPayment}
        style={extraStyle}
      >
        <Animated.View style={wrapperStyle}>
          {this.renderQuickPayment()}
        </Animated.View>
      </Animated.View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {!!this.hasIncompleteBills && this.renderQuickPaymentShortcut()}
        <Animated.ScrollView
          contentContainerStyle={styles.contentScrollView}
          onLayout={this.handleLayoutScrollView}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.state.scrollY
                  }
                }
              }
            ],
            { useNativeDriver: true }
          )}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {!!this.isBillsEmpty ? (
            <NoResult message="Danh sách hóa đơn đang trống" />
          ) : (
            <>
              {!!this.hasIncompleteBills && (
                <HomeCardList
                  onLayout={this.handleLayoutInCompleteBills}
                  flatListProps={{
                    scrollEnabled: false
                  }}
                  title={`${this.state.titleBillsInComplete} (${this.state.billsInComplete.length})`}
                  headerStyle={styles.billsHeader}
                  onShowAll={false}
                  horizontal={false}
                  data={this.state.billsInComplete}
                  extraComponent={this.renderQuickPayment()}
                >
                  {({ item, index }) => this.renderBill(index, item)}
                </HomeCardList>
              )}
              {!!this.hasCompleteBills && (
                <HomeCardList
                  flatListProps={{ scrollEnabled: false }}
                  title={`${this.state.titleBillsComplete} (${this.state.billsComplete.length})`}
                  headerStyle={styles.billsHeader}
                  onShowAll={false}
                  horizontal={false}
                  data={this.state.billsComplete}
                >
                  {({ item, index }) => this.renderBill(index, item)}
                </HomeCardList>
              )}
            </>
          )}
        </Animated.ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  contentScrollView: {
    flexGrow: 1
  },
  billsHeader: {
    marginBottom: 16
  },
  billItemWrapper: {
    flex: 1,
    marginRight: 16,
    marginBottom: 15
  },
  billIndex: {
    fontSize: 13,
    marginTop: 15,
    width: 20
  }
});

export default withTranslation()(Bills);
