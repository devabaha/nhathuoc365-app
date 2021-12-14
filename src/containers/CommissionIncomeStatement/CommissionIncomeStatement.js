import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
// 3-party libs
import {Table, Row} from 'react-native-table-component';
import {isEmpty} from 'lodash';
// configs
import appConfig from 'app-config';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import {mergeStyles} from 'src/Themes/helper';
// routing
import {push, refresh} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// custom components
import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import {
  BaseButton,
  Container,
  ScreenWrapper,
  Icon,
  Typography,
  FlatList,
  ScrollView,
  IconButton,
} from 'src/components/base';

const styles = StyleSheet.create({
  title: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  reload: {
    fontSize: 22,
    right: 12,
  },
  headingWrapper: {
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  headingContainer: {
    paddingBottom: 15,
  },
  header: {
    height: 50,
  },
  selectMonthContainer: {
    overflow: 'hidden',
  },
  yearMonthIcon: {
    height: '100%',
    fontSize: 18,
    padding: 10,
  },
  yearMonthTxt: {
    padding: 10,
  },
  totalIncomeContainer: {
    alignItems: 'flex-end',
  },
  totalIncomeTitle: {
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: 1,
    marginBottom: 3,
  },
  incomeTxt: {
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
  incomeUnitTxt: {
    fontWeight: '300',
    letterSpacing: 0,
  },

  tableHeadingText: {
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableCellText: {
    textAlign: 'center',
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
  },

  noResultContainer: {
    marginTop: '50%',
  },
  itemsRose: {
    flex: 1,
    justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  roseValueContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  valueText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },

  roseHeaderContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  roseSeparator: {
    position: 'absolute',
    transform: [{rotate: '180deg'}],
    bottom: -7,
    left: -5,
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  nextRevenueTitle: {
    paddingVertical: 10,
    textAlign: 'center',
  },
});

const CommissionIncomeStatement = ({navigation}) => {
  const {theme} = useTheme();

  const {t} = useTranslation(['commissionIncomeStatement', 'common']);

  const getCommissionRequest = new APIRequest();
  const requests = [getCommissionRequest];

  const tableHead = [
    t('tableHead.orderCode'),
    t('tableHead.orderPrice'),
    t('tableHead.incomePercent'),
    t('tableHead.income'),
    t('tableHead.position'),
  ];

  const tableRose = ['total_revenue', 'level', 'total_commission_month'];
  const baseUnit = 150;
  const widthArr = [baseUnit, baseUnit, baseUnit, baseUnit, baseUnit * 0.6];

  const [isLoading, setLoading] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState();
  const [months, setMonths] = useState([]);
  const [stats, setStats] = useState({});
  const [monthBonus, setMonthBonus] = useState({});
  const [commissions, setCommissions] = useState([]);

  const hasCommissions = () => {
    return Array.isArray(commissions) && commissions.length !== 0;
  };

  useEffect(() => {
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

  useEffect(() => {
    didMount();

    return unMount;
  }, []);

  const didMount = () => {
    getCommissions();
    setTimeout(() =>
      refresh({
        right: renderRight(),
      }),
    );
  };

  const unMount = () => {
    cancelRequests(requests);
  };

  const getCommissions = async (month) => {
    const data = {};
    if (month) {
      data.month = month;
    }
    getCommissionRequest.data = APIHandler.user_site_cart_commission(data);
    try {
      const responseData = await getCommissionRequest.promise();
      console.log(responseData);
      const data = responseData?.data;
      if (data) {
        setMonths(formatMonths(data.list_month || []));
        setStats(data.stats || {});
        setSelectedMonth(data.month || []);
        setMonthBonus(data.month_bonus || {});
        setCommissions(formatCommission(data?.commissions || []));
      }
    } catch (error) {
      console.log('%cget_commission', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: error.message || t('common:api.error.message'),
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatMonths = (months) => {
    return months.map((month) => ({
      label: month,
      value: month,
    }));
  };

  const formatCommission = (commissions) => {
    return commissions.map((commission) => [
      [commission.cart_code],
      [commission.total_amount],
      [commission.commission],
      [commission.commission_amount],
      [commission.position],
    ]);
  };

  const handleSelectMonth = (month) => {
    getCommissions(month);
  };

  const openYearMonthPicker = () => {
    if (months.length === 0) return;
    push(appConfig.routes.modalPicker, {
      title: t('chooseMonth'),
      selectedValue: selectedMonth,
      selectedLabel: selectedMonth,
      data: months,
      onSelect: handleSelectMonth,
    });
  };

  const onHardRefresh = () => {
    setLoading(true);
    getCommissions();
  };

  const renderRight = () => {
    return (
      <IconButton
        bundle={BundleIconSetName.IONICONS}
        name="ios-reload"
        iconStyle={rightButtonIconStyle}
        hitSlop={HIT_SLOP}
        onPress={onHardRefresh}
      />
    );
  };

  const renderColumRose = ({item, index}) => {
    return (
      <View style={columnRoseStyle}>
        <Container flex center style={styles.roseHeaderContainer}>
          <Typography type={TypographyType.LABEL_SMALL} style={styles.heading}>
            {index === 0 ? monthBonus['total_revenue_title'] : t(item)}
          </Typography>

          {index > 0 && <View style={roseSeparatorStyle} />}
        </Container>
        <Container noBackground style={[styles.roseValueContainer]}>
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={styles.valueText}
            numberOfLines={2}>
            {monthBonus[item]}
          </Typography>
        </Container>
      </View>
    );
  };

  const headingContainerStyle = useMemo(() => {
    return mergeStyles(styles.headingContainer, {
      borderBottomWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const yearMonthBtnContainerStyle = useMemo(() => {
    return {
      borderWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
      borderRadius: theme.layout.borderRadiusSmall,
    };
  }, [theme]);

  const selectMonthContainerStyle = useMemo(() => {
    return mergeStyles(styles.selectMonthContainer, {
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  const yearMonthIconStyle = useMemo(() => {
    return mergeStyles(styles.yearMonthIcon, {
      color: theme.color.onPrimaryHighlight,
      backgroundColor: theme.color.primaryHighlight,
    });
  }, [theme]);

  const tableBorderStyle = useMemo(() => {
    return {
      borderWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    };
  }, [theme]);

  const tableHeaderStyle = useMemo(() => {
    return mergeStyles(styles.header, {
      backgroundColor: theme.color.primaryHighlight,
    });
  }, [theme]);

  const tableHeadingTextStyle = useMemo(() => {
    return mergeStyles(styles.tableHeadingText, {
      color: theme.color.onPrimaryHighlight,
    });
  }, [theme]);

  const tableCellTextStyle = useMemo(() => {
    return mergeStyles(styles.tableCellText, {
      color: theme.color.textPrimary,
    });
  }, [theme]);

  const commissionRowStyle = useMemo(() => {
    return mergeStyles(styles.row, {backgroundColor: theme.color.surface});
  }, [theme]);

  const evenCommissionRowStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.contentBackgroundWeak,
    };
  }, [theme]);

  const nextRevenueTitleStyle = useMemo(() => {
    return mergeStyles(styles.nextRevenueTitle, {
      color: theme.color.danger,
      backgroundColor: theme.color.surface,
    });
  }, [theme]);

  const rightButtonIconStyle = useMemo(() => {
    return mergeStyles(styles.reload, {
      color: theme.color.onNavBarBackground,
    });
  }, [theme]);

  const columnRoseStyle = useMemo(() => {
    return mergeStyles(styles.itemsRose, {
      borderColor: theme.color.border,
    });
  }, [theme]);

  const roseContentContainerStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.surface,
    };
  }, [theme]);

  const roseSeparatorStyle = useMemo(() => {
    return mergeStyles(styles.roseSeparator, {
      borderBottomColor: theme.color.contentBackgroundWeak,
    });
  }, [theme]);

  return (
    <ScreenWrapper>
      {isLoading && <Loading center />}
      <Container style={styles.headingWrapper}>
        <Container noBackground row style={headingContainerStyle}>
          <BaseButton
            style={yearMonthBtnContainerStyle}
            onPress={openYearMonthPicker}>
            <Container
              noBackground
              row
              centerVertical
              style={selectMonthContainerStyle}>
              <Icon
                bundle={BundleIconSetName.ANT_DESIGN}
                name="calendar"
                style={yearMonthIconStyle}
              />
              <Typography
                type={TypographyType.LABEL_MEDIUM}
                style={styles.yearMonthTxt}>
                {selectedMonth}
              </Typography>
            </Container>
          </BaseButton>

          <Container flex style={styles.totalIncomeContainer}>
            <Typography
              type={TypographyType.LABEL_TINY}
              style={styles.totalIncomeTitle}>
              {t('totalCommissionIncome')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_HUGE_PRIMARY}
              style={styles.incomeTxt}>
              {stats.total_commission_month}
              <Typography
                type={TypographyType.DESCRIPTION_SMALL_TERTIARY}
                style={styles.incomeUnitTxt}>
                {' '}
                /{stats.total_cart_accept}
              </Typography>
            </Typography>
          </Container>
        </Container>
      </Container>
      {!isEmpty(monthBonus) && (
        <Container>
          <FlatList
            data={tableRose}
            keyExtractor={(i) => i}
            renderItem={renderColumRose}
            numColumns={3}
            scrollEnabled={false}
          />
          <Typography
            type={TypographyType.DESCRIPTION_MEDIUM}
            style={nextRevenueTitleStyle}>
            {monthBonus.next_total_revenue_title}
          </Typography>
        </Container>
      )}

      <Typography type={TypographyType.TITLE_LARGE} style={styles.title}>
        {t('listOrders')}
      </Typography>

      <ScrollView horizontal>
        <View>
          <Table borderStyle={tableBorderStyle}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={tableHeaderStyle}
              textStyle={tableHeadingTextStyle}
            />
          </Table>
          {hasCommissions() && (
            <ScrollView
              showsVerticalScrollIndicator={false}
              safeLayout
              style={styles.dataWrapper}>
              <Table borderStyle={tableBorderStyle}>
                {commissions.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr}
                    style={[
                      commissionRowStyle,
                      index % 2 && evenCommissionRowStyle,
                    ]}
                    textStyle={tableCellTextStyle}
                  />
                ))}
              </Table>
            </ScrollView>
          )}
        </View>
      </ScrollView>
      {!isLoading && !hasCommissions() && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.noResultContainer]}>
          <NoResult message={t('noOrder')} />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default React.memo(CommissionIncomeStatement);
