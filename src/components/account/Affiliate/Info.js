/* @flow */

import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';

const Info = props => {
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
      <View style={[{ paddingLeft: 10, marginTop: 10 }]}>
        <Text style={[styles.des]}>
          {props.content
            ? props.content
            : 'Giới thiệu chương trình tiếp thị liên kết'}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    color: '#404040'
  },
  des: {
    fontSize: 16,
    marginBottom: 2
  },
  notice: {
    fontSize: 18,
    color: '#404040',
    marginBottom: 2
  }
});

export default Info;
