import React from 'react';
import {View, StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, ScrollView, Typography} from 'src/components/base';
import HistoryRow from './HistoryRow';

const History = (props) => {
  const historyData = props.historyData ? props.historyData : [];
  const {t} = props;

  const historyRender = historyData.map((history) => {
    return (
      <HistoryRow
        key={history.id}
        id={history.id}
        title={history.name}
        tel={history.tel}
        date={history.created}
      />
    );
  });

  return (
    <Container flex>
      <ScrollView
        safeLayout
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="always"
        // refreshControl={
        //     <RefreshControl
        //         refreshing={loadingHistory || loadingHistoryWithdraw}
        //         onRefresh={this._getData.bind(this)}
        //     />
        // }
      >
        {props.loading ? null : historyData.length ? (
          historyRender
        ) : (
          <View style={styles.descriptionContainer}>
            <Typography
              type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
              style={styles.note}>
              {t('tab.referralList.desc')}
            </Typography>
          </View>
        )}
      </ScrollView>
    </Container>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: appConfig.device.width,
  },
  descriptionContainer: {
    padding: 15,
  },
  note: {
    marginBottom: 2,
  },
});

export default withTranslation('affiliate')(History);
