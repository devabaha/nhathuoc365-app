import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  ScrollView
} from 'react-native';
import Loading from 'app-components/Loading';
import NoResult from 'app-components/NoResult';
import HomeCardList from 'app-components/Home/component/HomeCardList';
import Bill, { QuickPayment } from './Bill';

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
          (prev, next) => (prev.price || prev) + (next.price || 0),
          0
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
      } else {
        throw Error(response);
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

  renderBill(index, bill) {
    return (
      <Bill
        index={index + 1}
        wrapperStyle={styles.billItemWrapper}
        containerStyle={styles.billItemContainer}
        status={bill.status}
        title={bill.title}
        period={bill.payment_period}
        price={bill.price_view}
      />
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
                  {({ item, index }) => this.renderBill(index, item)}
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
                  {({ item, index }) => this.renderBill(index, item)}
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
  billItemWrapper: {
    flex: 1,
    marginRight: 16,
    marginBottom: 15
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
