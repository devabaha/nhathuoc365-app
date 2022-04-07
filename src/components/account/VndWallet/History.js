import React from 'react';
import {StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import HistoryRow from './HistoryRow';
import {Container, FlatList, Typography} from 'src/components/base';

const History = (props) => {
  const {t} = props;
  const historyData = props.historyData ? props.historyData : [];

  function renderHistory({item: history, index}) {
    const lastRow = index === historyData?.length - 1;

    return (
      <HistoryRow
        id={history.transaction_hash}
        title={history.content}
        date={history.created}
        amount={history.amount}
        balance_view={history.balance_view}
        money={history.amount_view}
        lastRow={lastRow}
      />
    );
  }
  return (
    <Container noBackground flex style={styles.container}>
      <FlatList
        safeLayout
        directionalLockEnabled
        data={historyData || []}
        renderItem={renderHistory}
        keyExtractor={(item) => item.transaction_hash}
        ListEmptyComponent={
          !props.loading && (
            <Container>
              <Typography
                type={TypographyType.DESCRIPTION_MEDIUM_TERTIARY}
                style={styles.note}>
                {t('tabs.history.message')}
              </Typography>
            </Container>
          )
        }
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    width: appConfig.device.width,
  },
  des: {
    marginTop: 2,
  },
  note: {
    padding: 15,
    marginBottom: 2,
  },
});

export default withTranslation('vndWallet')(History);
