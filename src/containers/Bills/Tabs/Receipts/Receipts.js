import React, { Component } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  FlatList,
  RefreshControl,
  View
} from 'react-native';
import Loading from '../../../../components/Loading';
import NoResult from '../../../../components/NoResult';
import Receipt from './Receipt';

const NoResultComp = (
  <View style={{ marginTop: '50%' }}>
    <NoResult message="Danh sách phiếu thu đang trống" />
  </View>
);

class Receipts extends Component {
  state = {
    loading: true,
    refreshing: false,
    titleReceipts: '',
    receipts: null
  };
  unmounted = false;

  componentDidMount() {
    this.getReceipts();
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  async getReceipts() {
    const { t } = this.props;
    try {
      const response = await APIHandler.site_receipts_room(
        this.props.siteId,
        this.props.roomId
      );
      console.log(response);
      if (!this.unmounted && response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.setState({
            titleReceipts: response.data.title_receipts,
            receipts: response.data.receipts
          });
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      }
    } catch (error) {
      console.log('get_receipts', error);
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
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getReceipts();
  };

  renderReceipt = ({ item: receipt }) => {
    return (
      <Receipt
        date={receipt.receipt_date}
        content={receipt.content}
        price={receipt.price_view}
        code={receipt.receipt_number}
      />
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {!!this.state.receipts && (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={styles.content}
            data={this.state.receipts}
            renderItem={this.renderReceipt}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
            ListEmptyComponent={NoResultComp}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9ee'
  },
  content: {
    padding: 15,
    paddingBottom: 0
  }
});

export default withTranslation()(Receipts);
