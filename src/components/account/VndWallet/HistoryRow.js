import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {BaseButton, Typography, Container} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDetailContainer: {
    justifyContent: 'center',
    flex: 1,
    paddingRight: 30,
  },
  historyAmountContainer: {
    justifyContent: 'center',
    maxWidth: '30%',
  },
  amount: {
    fontWeight: 'bold',
    textAlign: 'right',
  },
  beforeBalance: {
    textAlign: 'right',
  },
  des: {
    marginTop: 2,
  },
});

const HistoryRow = (props) => {
  const {theme} = useTheme();

  const {t} = useTranslation();

  _onShowHistoryDetail = () => {
    push(
      appConfig.routes.detailHistoryPayment,
      {
        title: props.title,
        transaction_hash: props.id,
        created: props.date,
        content: props.title,
        amount_view: props.money,
        amount: props.amount,
      },
      theme,
    );
  };

  const historyAmountStyle = useMemo(() => {
    return mergeStyles([styles.des, styles.amount], {
      color: props.amount > 0 ? theme.color.success : theme.color.danger,
    });
  }, [theme, props.amount]);

  const containerStyle = useMemo(() => {
    return mergeStyles(
      styles.container,
      !props.lastRow && {
        borderBottomWidth: theme.layout.borderWidth,
        borderColor: theme.color.border,
      },
    );
  }, [theme, props.lastRow]);

  return (
    <Container>
      <BaseButton
        useTouchableHighlight
        style={containerStyle}
        onPress={_onShowHistoryDetail}>
        <View style={styles.contentContainer}>
          <View style={[styles.historyDetailContainer]}>
            <Typography style={styles.title} type={TypographyType.LABEL_LARGE}>
              {props.title}
            </Typography>
            <Typography
              type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
              style={styles.des}>
              {props.date}
            </Typography>
            <Typography
              numberOfLines={1}
              type={TypographyType.DESCRIPTION_TINY}
              style={styles.des}>
              {props.id}
            </Typography>
          </View>

          <View style={[styles.historyAmountContainer]}>
            <Typography
              type={TypographyType.LABEL_LARGE}
              style={historyAmountStyle}>
              {props.money}
            </Typography>
            <Typography
              type={TypographyType.DESCRIPTION_SMALL}
              style={[styles.des, styles.beforeBalance]}>
              {t('vndWallet:balanceBefore')} {props.balance_view}
            </Typography>
          </View>
        </View>
      </BaseButton>
    </Container>
  );
};

export default HistoryRow;
