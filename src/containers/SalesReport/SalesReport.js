import React, {memo, useEffect, useMemo, useState} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {Table, Row} from 'react-native-table-component';
import {isEmpty} from 'lodash';
// configs
import appConfig from 'app-config';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
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
  Container,
  FlatList,
  ScreenWrapper,
  ScrollView,
  Typography,
  IconButton,
  BaseButton,
  Icon,
} from 'src/components/base';

const dataReportBaseUnit = 170;
const tableDataReportWidthArr = [
  dataReportBaseUnit,
  dataReportBaseUnit,
  dataReportBaseUnit,
  dataReportBaseUnit,
];

const newMembersBaseUnit = 170;
const tableNewMemberWidthArr = [
  newMembersBaseUnit,
  newMembersBaseUnit,
  newMembersBaseUnit,
];

function SalesReport({navigation}) {
  const {theme} = useTheme();

  const {t} = useTranslation('salesReport');

  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [dataReport, setDataReport] = useState({});
  const [stats, setStats] = useState({});
  const [reportRevenue, setReportRevenue] = useState([]);
  const [newReferralMembers, setNewReferralMembers] = useState([]);

  useEffect(() => {
    if (!navigation) return;

    const updateNavBarDisposer = updateNavbarTheme(navigation, theme);

    return updateNavBarDisposer;
  }, [theme]);

  const tableReportHead = [
    t('name'),
    t('phone'),
    t('totalOrders'),
    t('totalRevenue'),
  ];
  const tableNewMembersHead = [t('name'), t('phone'), t('joiningDate')];

  const getInvitedRevenueRequest = new APIRequest();
  const requests = [getInvitedRevenueRequest];

  const hasRevenue = () => {
    return Array.isArray(dataReport) && dataReport.length !== 0;
  };

  const hasNewReferralMembers = () => {
    return Array.isArray(newReferralMembers) && newReferralMembers.length !== 0;
  };

  const getInvitedRevenue = async (month) => {
    const data = {};
    if (month) {
      data.month = month;
    }
    getInvitedRevenueRequest.data = APIHandler.user_invited_revenue(data);
    try {
      const response = await getInvitedRevenueRequest.promise();
      if (response) {
        if (response.status === STATUS_SUCCESS) {
          if (response.data) {
            setMonths(formatMonths(response?.data.list_month));
            setStats(response.data.stats);
            setSelectedMonth(response?.data.month || []);
            setDataReport(formatInviter(response.data.revenue_inviter_users));
            setReportRevenue(
              formatReportRevenue(response.data.report_revenue_in_months),
            );
            setNewReferralMembers(
              formatNewMembers(response.data.list_invited_user_in_months),
            );
          }
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('common:api.error.message'),
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('common:api.error.message'),
        });
      }
    } catch (error) {
      console.log('%cget_commission', 'color:red', error);
      flashShowMessage({
        type: 'danger',
        message: t('common:api.error.message'),
      });
    } finally {
      setLoading(false);
    }
  };

  const formatReportRevenue = (reportRevenue = {}) => {
    return Object.keys(reportRevenue).map((reportKey) => ({
      title: reportKey,
      value: reportRevenue[reportKey],
    }));
  };

  const formatMonths = (months) => {
    return months.map((month) => ({
      label: month,
      value: month,
    }));
  };

  const formatInviter = (inviters) => {
    if (isEmpty(inviters)) return [];
    return inviters.map((item) => [
      [item.name],
      [item.tel],
      [item.count],
      [item.total],
    ]);
  };

  const formatNewMembers = (newMembers) => {
    if (isEmpty(newMembers)) return [];

    return newMembers.map((item) => [[item.name], [item.tel], [item.created]]);
  };

  const handleSelectMonth = (month) => {
    getInvitedRevenue(month);
  };

  const onHardRefresh = () => {
    setLoading(true);
    getInvitedRevenue();
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

  const renderColumnReferral = ({item, index}) => {
    return (
      <View style={columnReferralStyle}>
        <Container flex center style={[referralHeaderContainerStyle]}>
          <Typography type={TypographyType.LABEL_SMALL} style={styles.heading}>
            {/* {index === 0 ? stats['total_revenue_title'] : t(item)} */}
            {item.title}
          </Typography>

          {index > 0 && <View style={referralSeparatorStyle} />}
        </Container>
        <Container noBackground style={[styles.revenueValueContainer]}>
          <Typography
            type={TypographyType.LABEL_LARGE}
            style={styles.valueText}
            numberOfLines={2}>
            {item.value}
          </Typography>
        </Container>
      </View>
    );
  };

  const renderRight = () => {
    return (
      <IconButton
        bundle={BundleIconSetName.IONICONS}
        name="ios-reload"
        iconStyle={reloadButtonStyle}
        hitSlop={HIT_SLOP}
        onPress={onHardRefresh}
      />
    );
  };

  useEffect(() => {
    getInvitedRevenue();

    setTimeout(() =>
      refresh({
        right: renderRight(),
      }),
    );
    return () => {
      cancelRequests(requests);
    };
  }, []);

  const headingContainerStyle = useMemo(() => {
    return mergeStyles(styles.headingContainer, {
      borderBottomWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
    });
  }, [theme]);

  const yearMonthBtnContainerStyle = useMemo(() => {
    return {
      borderWidth: theme.layout.borderWidth,
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
    return mergeStyles(styles.tableHeader, {
      backgroundColor: theme.color.primaryHighlight,
    });
  }, [theme]);

  const tableHeadingTextStyle = useMemo(() => {
    return mergeStyles(styles.tableHeadingText, {
      color: theme.color.onPrimaryHighlight,
    });
  }, [theme]);

  const reportRowStyle = useMemo(() => {
    return mergeStyles(styles.row, {backgroundColor: theme.color.surface});
  }, [theme]);

  const evenReportRowStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.contentBackgroundWeak,
    };
  }, [theme]);

  const tableCellTextStyle = useMemo(() => {
    return mergeStyles(styles.tableCellText, {
      color: theme.color.textPrimary,
    });
  }, [theme]);

  const columnReferralStyle = useMemo(() => {
    return mergeStyles(styles.itemReferral, {
      borderColor: theme.color.border,
    });
  }, [theme]);

  const referralHeaderContainerStyle = useMemo(() => {
    return mergeStyles(styles.referralHeaderContainer, {
      ...evenReportRowStyle,
    });
  }, [theme]);

  const referralSeparatorStyle = useMemo(() => {
    return mergeStyles(styles.referralSeparator, {
      borderBottomColor: theme.color.contentBackgroundWeak,
    });
  }, [theme]);

  const reloadButtonStyle = useMemo(() => {
    return mergeStyles(styles.reload, {
      color: theme.color.onNavBarBackground,
    });
  }, [theme]);

  return (
    <ScreenWrapper>
      {loading && <Loading center />}
      <Container style={styles.headingWrapper}>
        <Container row style={headingContainerStyle}>
          <BaseButton
            style={yearMonthBtnContainerStyle}
            onPress={openYearMonthPicker}>
            <Container row centerVertical style={selectMonthContainerStyle}>
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
              {t('totalTurnover')}
            </Typography>
            <Typography
              type={TypographyType.LABEL_SEMI_HUGE_PRIMARY}
              style={styles.incomeTxt}>
              {stats.total_revenue}
            </Typography>
          </Container>
        </Container>
      </Container>
      {!!reportRevenue?.length && (
        <Container>
          <FlatList
            data={reportRevenue}
            keyExtractor={(i) => i}
            renderItem={renderColumnReferral}
            numColumns={3}
            scrollEnabled={false}
          />
        </Container>
      )}

      <Typography type={TypographyType.TITLE_LARGE} style={styles.reportTitle}>
        {t('referralOrders')}
      </Typography>

      <View style={styles.block}>
        <ScrollView horizontal>
          <View>
            <Table borderStyle={tableBorderStyle}>
              <Row
                data={tableReportHead}
                widthArr={tableDataReportWidthArr}
                style={tableHeaderStyle}
                textStyle={tableHeadingTextStyle}
              />
            </Table>
            {hasRevenue() && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.dataWrapper}>
                <Table borderStyle={tableBorderStyle}>
                  {dataReport.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={tableDataReportWidthArr}
                      style={[reportRowStyle, index % 2 && evenReportRowStyle]}
                      textStyle={tableCellTextStyle}
                    />
                  ))}
                </Table>
              </ScrollView>
            )}
          </View>
        </ScrollView>

        {!loading && !hasRevenue() && (
          <NoResult
            containerStyle={styles.noResultContainer}
            icon={<View />}
            message={t('noReportList')}
          />
        )}
      </View>

      <Typography type={TypographyType.TITLE_LARGE} style={styles.reportTitle}>
        {t('newReferralMembers')}
      </Typography>

      <View style={styles.block}>
        <ScrollView horizontal>
          <View>
            <Table borderStyle={tableBorderStyle}>
              <Row
                data={tableNewMembersHead}
                widthArr={tableNewMemberWidthArr}
                style={tableHeaderStyle}
                textStyle={tableHeadingTextStyle}
              />
            </Table>
            {hasNewReferralMembers() && (
              <Container flex>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  safeLayout
                  style={styles.dataWrapper}>
                  <Table borderStyle={tableBorderStyle}>
                    {newReferralMembers.map((rowData, index) => (
                      <Row
                        key={index}
                        data={rowData}
                        widthArr={tableNewMemberWidthArr}
                        style={[
                          reportRowStyle,
                          index % 2 && evenReportRowStyle,
                        ]}
                        textStyle={tableCellTextStyle}
                      />
                    ))}
                  </Table>
                </ScrollView>
              </Container>
            )}
          </View>
        </ScrollView>

        {!loading && !hasNewReferralMembers() && (
          <NoResult
            containerStyle={styles.noResultContainer}
            icon={<View />}
            message={t('noReportList')}
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
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
  tableHeader: {
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

  itemReferral: {
    flex: 1,
    justifyContent: 'center',
  },
  referralHeaderContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  heading: {
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  referralSeparator: {
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
  revenueValueContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 5,
    paddingVertical: 15,
  },
  valueText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  reportTitle: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    fontWeight: 'bold',
  },
  tableHeadingText: {
    textAlign: 'center',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableCellText: {
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    minHeight: 40,
  },

  block: {
    flex: 1,
  },
  noResultContainer: {
    paddingBottom: 0,
    paddingTop: 0,
    position: 'absolute',
    zIndex: -1,
  },
});

export default memo(SalesReport);
