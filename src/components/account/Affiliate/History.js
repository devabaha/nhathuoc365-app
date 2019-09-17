/* @flow */

import React, { Fragment } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Text
} from 'react-native';

//library
import Icon from 'react-native-vector-icons/FontAwesome';
import Communications from 'react-native-communications';

const History = props => {
  var historyData = props.historyData ? props.historyData : [];
  const historyRender = historyData.map(history => (
    <HistoryRow
      key={history.id}
      id={history.id}
      title={history.name}
      tel={history.tel}
      date={history.created}
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
        <Text>Danh sách mời của tài khoản</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  history_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  history_row_main_content: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10
  },
  history_row_last_content: {
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 16,
    color: '#404040'
  },
  des: {
    fontSize: 12,
    color: '#404040'
  }
});

export default History;

const HistoryRow = props => {
  return (
    <View style={[styles.history_row]}>
      <TouchableHighlight
        onPress={() => Communications.phonecall(props.tel, true)}
        underlayColor="transparent"
      >
        <View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center'
            }
          ]}
        >
          <Icon name="user" color={'#333333'} size={24} />
          <View style={[styles.history_row_main_content]}>
            <Text style={[styles.title]}>{props.title}</Text>
            <Text style={[styles.des]}>{props.tel}</Text>
            <Text style={[styles.des]}>{props.date}</Text>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};
