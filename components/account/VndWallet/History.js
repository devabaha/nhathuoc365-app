/* @flow */

import React, { Fragment } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";

//library
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";

const History = props => {
  var historyData = props.historyData ? props.historyData : [];
  const historyRender = historyData.map(history => (
    <HistoryRow
      key={history.transaction_hash}
      id={history.transaction_hash}
      title={history.content}
      date={history.created}
      amount={history.amount}
      balance_view={history.balance_view}
      money={history.amount_view}
    />
  ));
  return (
    <ScrollView
      contentContainerStyle={{
        padding: 15,
        width: Util.size.width
      }}
      keyboardShouldPersistTaps="always"
      // refreshControl={
      //     <RefreshControl
      //         refreshing={loadingHistory || loadingHistoryWithdraw}
      //         onRefresh={this._getData.bind(this)}
      //     />
      // }
    >
      {historyData.length ? (
        historyRender
      ) : (
        <Text>Tài khoản chưa có giao dịch</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  history_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    paddingTop: 10,
    width: "100%",
    borderBottomWidth: Util.pixel,
    borderColor: "#dddddd"
  },
  history_row_main_content: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10
  },
  history_row_last_content: {
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  title: {
    fontSize: 16,
    color: "#404040"
  },
  des: {
    fontSize: 12,
    color: "#404040"
  }
});

export default History;

const HistoryRow = props => {
  _onShowHistoryDetail = () => {
    Actions.detail_history_payment({
      transaction_hash: props.id,
      created: props.date,
      content: props.title,
      amount_view: props.money
    });
  };

  return (
    <TouchableOpacity
      style={[styles.history_row]}
      onPress={this._onShowHistoryDetail}
    >
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: "center"
          }
        ]}
      >
        <Icon
          name={
            props.amount > 0 ? "chevron-circle-right" : "chevron-circle-left"
          }
          color={"#333333"}
          size={24}
        />
        <View style={[styles.history_row_main_content]}>
          <Text style={[styles.title]}>
            {props.title.substring(0, 25) + "..."}
          </Text>
          <Text style={[styles.des]}>{props.date}</Text>
          <Text style={[styles.des]}>
            Txid: {props.id.substring(0, 25) + "..."}
          </Text>
        </View>
      </View>

      <Fragment>
        <View style={[styles.history_row_last_content]}>
          <Text
            style={[
              styles.des,
              {
                fontWeight: "bold",
                fontSize: 16,
                position: "absolute",
                top: -6,
                right: 0
              }
            ]}
          >
            {props.money}
          </Text>
          <Text
            style={[
              styles.des,
              {
                color: "#cc9900",
                fontSize: 12,
                position: "absolute",
                top: 10,
                right: 0
              }
            ]}
          >
            Trước đó: {props.balance_view}
          </Text>
        </View>
      </Fragment>
    </TouchableOpacity>
  );
};
