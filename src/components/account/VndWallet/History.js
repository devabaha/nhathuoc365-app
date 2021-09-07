/* @flow */

import React, {Fragment} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Actions} from 'react-native-router-flux';

import Loading from '../../Loading';
import appConfig from 'app-config';

const History = (props) => {
  const {t} = props;
  var historyData = props.historyData ? props.historyData : [];
  function renderHistory({item: history, index}) {
    return (
      <HistoryRow
        id={history.transaction_hash}
        title={history.content}
        date={history.created}
        amount={history.amount}
        balance_view={history.balance_view}
        money={history.amount_view}
      />
    );
  }
  return (
    <View style={styles.container}>
      {props.loading ? null : historyData.length ? (
        <FlatList
          data={historyData}
          renderItem={renderHistory}
          keyExtractor={(item) => item.transaction_hash}
        />
      ) : (
        <Text style={styles.note}>{t('tabs.history.message')}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Util.size.width,
  },
  history_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    width: '100%',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  history_row_main_content: {
    justifyContent: 'center',
    flex: 1,
    paddingRight: 30,
  },
  history_row_last_content: {
    justifyContent: 'center',
    maxWidth: '30%',
  },
  title: {
    fontSize: 16,
    color: appConfig.colors.text,
    fontWeight: '500',
    marginBottom: 3,
  },
  des: {
    fontSize: 12,
    color: appConfig.colors.typography.secondary,
    marginTop: 2,
  },
  sub: {
    color: appConfig.colors.text,
  },
  note: {
    padding: 15,
    fontSize: 16,
    marginBottom: 2,
  },
});

export default withTranslation('vndWallet')(History);

const HistoryRow = (props) => {
  _onShowHistoryDetail = () => {
    Actions.push(appConfig.routes.detailHistoryPayment, {
      title: props.title,
      transaction_hash: props.id,
      created: props.date,
      content: props.title,
      amount_view: props.money,
      amount: props.amount,
    });
  };

  return (
    <TouchableHighlight
      underlayColor={'rgba(0,0,0,.05)'}
      style={[styles.history_row]}
      onPress={_onShowHistoryDetail}>
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
          },
        ]}>
        <View style={[styles.history_row_main_content]}>
          <Text style={[styles.title]}>{props.title}</Text>
          <Text style={[styles.des, styles.sub]}>{props.date}</Text>
          <Text numberOfLines={1} style={[styles.des]}>
            {props.id}
          </Text>
        </View>

        <View style={[styles.history_row_last_content]}>
          <Text
            style={[
              styles.des,
              {
                fontWeight: 'bold',
                fontSize: 16,
                right: 0,
                textAlign: 'right',
              },
              {
                color:
                  props.amount > 0
                    ? appConfig.colors.status.success
                    : appConfig.colors.status.danger,
              },
            ]}>
            {props.money}
          </Text>
          <Text
            style={[
              styles.des,
              {
                color: appConfig.colors.typography.secondary,
                fontSize: 12,
                textAlign: 'right',
              },
            ]}>
            Trước đó: {props.balance_view}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};
