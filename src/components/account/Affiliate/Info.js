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
      {!props.loading && (
        <Text style={[styles.des]}>
          {props.content ? props.content : props.t('info.content')}
        </Text>
      )}
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

export default withTranslation('affiliate')(Info);
