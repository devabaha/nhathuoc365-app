import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text,
  View
} from 'react-native';
import APIHandler from '../../../network/APIHandler';
import Loading from '../../../components/Loading';
import NoResult from '../../../components/NoResult';
import HomeCardList from '../../../components/Home/component/HomeCardList';
import Bill from '../../Room/Body/Bill';
import QuickPayment from '../../Room/Body/Bill/QuickPayment';
import { isArray } from 'lodash';

class Bills extends Component {
  state = {
    loading: true,
    refreshing: false,
    billsComplete: null,
    billsInComplete: null,
    titleBillsComplete: '',
    titleBillsInComplete: ''
  };
  unmounted = false;

  get isBillsEmpty() {
    return (
      !!this.state.billsComplete &&
      !!this.state.billsInComplete &&
      this.state.billsInComplete.length === 0 &&
      this.state.billsComplete === 0
    );
  }

  get hasIncompleteBills() {
    return (
      !!this.state.billsInComplete && this.state.billsInComplete.length !== 0
    );
  }

  get totalBillIncompletePrice() {
    return (
      numberFormat(
        this.state.billsInComplete.reduce(
          (prev, next) => (prev.price || prev) + next.price
        )
      ) + 'đ'
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
      this.setState({
        billsComplete: isArray(response.data.bills_complete)
          ? response.data.bills_complete
          : null,
        titleBillsComplete: response.data.title_bills_complete,
        billsInComplete: isArray(response.data.bills_incomplete)
          ? response.data.bills_incomplete
          : null,
        titleBillsInComplete: response.data.title_bills_incomplete
      });
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

  renderBill(index, bill, bills) {
    return (
      <View style={styles.billWrapper}>
        <Text style={styles.billIndex}>{index + 1}.</Text>
        <Bill
          wrapperStyle={styles.billItemWrapper}
          containerStyle={styles.billItemContainer}
          status={bill.status}
          title={bill.title}
          period={bill.payment_period}
          price={bill.price_view}
          // onPress={() => this.props.onPressBill(bill)}
        />
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentScrollView}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh}
            />
          }
        >
          {!!this.isBillsEmpty ? (
            <NoResult />
          ) : (
            <>
              {!!this.state.billsInComplete && (
                <HomeCardList
                  flatListProps={{ scrollEnabled: false }}
                  title={`${this.state.titleBillsInComplete} (${this.state.billsInComplete.length})`}
                  headerStyle={styles.billsHeader}
                  onShowAll={false}
                  horizontal={false}
                  data={this.state.billsInComplete}
                  extraComponent={
                    this.hasIncompleteBills ? (
                      <QuickPayment
                        prefix={'Tổng tiền:   '}
                        price={this.totalBillIncompletePrice}
                        onPress={this.props.onPayBill}
                      />
                    ) : null
                  }
                >
                  {({ item, index }) =>
                    this.renderBill(index, item, this.state.billsInComplete)
                  }
                </HomeCardList>
              )}
              {!!this.state.billsComplete && (
                <HomeCardList
                  flatListProps={{ scrollEnabled: false }}
                  title={`${this.state.titleBillsComplete} (${this.state.billsComplete.length})`}
                  headerStyle={styles.billsHeader}
                  onShowAll={false}
                  horizontal={false}
                  data={this.state.billsComplete}
                >
                  {({ item, index }) =>
                    this.renderBill(index, item, this.state.billsComplete)
                  }
                </HomeCardList>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
    height: '100%'
  },
  contentScrollView: {
    flexGrow: 1
  },
  billsHeader: {
    marginBottom: 16
  },
  billWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 15
  },
  billItemWrapper: {
    flex: 1
  },
  billItemContainer: {
    width: '100%'
  },
  billIndex: {
    fontSize: 13,
    marginTop: 15,
    width: 20
  }
});

export default withTranslation()(Bills);
