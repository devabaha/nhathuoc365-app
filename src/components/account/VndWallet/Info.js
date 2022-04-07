/* @flow */

import React from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, ScrollView, Typography} from 'src/components/base';

const Info = (props) => {
  const {t} = props;

  return (
    <ScrollView
      safeLayout
      directionalLockEnabled
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="always"
      // refreshControl={
      //     <RefreshControl
      //         refreshing={loadingHistory || loadingHistoryWithdraw}
      //         onRefresh={this._getData.bind(this)}
      //     />
      // }
    >
      {!props.loading && (
        <Container style={styles.descriptionContainer}>
          <Typography
            type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
            style={styles.description}>
            {props.content ? props.content : t('tabs.information.message')}
          </Typography>
        </Container>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: appConfig.device.width,
  },
  descriptionContainer: {
    padding: 15,
  },
  description: {
    marginBottom: 2,
  },
});

export default withTranslation('vndWallet')(Info);
