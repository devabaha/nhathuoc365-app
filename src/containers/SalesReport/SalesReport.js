import Store from 'app-store';
import React, {memo, useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import APIHandler from 'src/network/APIHandler';
import {APIRequest} from 'src/network/Entity';
import appConfig from 'app-config';
import Container from 'src/components/Layout/Container';
import ScreenWrapper from 'src/components/ScreenWrapper';
import Loading from 'src/components/Loading';
import Button from 'react-native-button';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import NoResult from 'src/components/NoResult';
import {isEmpty} from 'lodash';
import {Actions} from 'react-native-router-flux';

const baseUnit = appConfig.device.width / 2;
const widthArr = [baseUnit, baseUnit];

function SalesReport() {
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState();
  const [dataReport, setDataReport] = useState({});
  const [stats, setStats] = useState({});

  const {t} = useTranslation('salesReport');

  const tableHead = [t('name'), t('total_revenue')];

  const getInvitedRevenueRequest = new APIRequest();
  const requests = [getInvitedRevenueRequest];

  const hasRevenue = () => {
    return Array.isArray(dataReport) && dataReport.length !== 0;
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

  const formatMonths = (months) => {
    return months.map((month) => ({
      label: month,
      value: month,
    }));
  };

  const formatInviter = (datas) => {
    if (isEmpty(datas)) return [];
    return datas.map((item) => [[`${item.name} - ${item.tel}`], [item.total]]);
  };

  const handleSelectMonth = (month) => {
    getInvitedRevenue(month);
  };

  const openYearMonthPicker = () => {
    if (months.length === 0) return;
    Actions.push(appConfig.routes.modalPicker, {
      title: 'Chọn tháng',
      selectedValue: selectedMonth,
      selectedLabel: selectedMonth,
      data: months,
      onSelect: handleSelectMonth,
    });
  };

  useEffect(() => {
    getInvitedRevenue();

    return () => {
      cancelRequests(requests);
    };
  }, []);

  return (
    <ScreenWrapper>
      {loading && <Loading center />}
      <Container style={styles.headingWrapper}>
        <Container row style={styles.headingContainer}>
          <Button
            containerStyle={styles.yearMonthBtnContainer}
            onPress={openYearMonthPicker}>
            <Container row centerVertical style={styles.selectMonthContainer}>
              <AntDesignIcon name="calendar" style={styles.yearMonthIcon} />
              <Text style={styles.yearMonthTxt}>{selectedMonth}</Text>
            </Container>
          </Button>

          <Container flex style={styles.totalIncomeContainer}>
            <Text style={styles.totalIncomeTitle}>Tổng doanh số</Text>
            <Text style={styles.incomeTxt}>{stats.total_revenue}</Text>
          </Container>
        </Container>
      </Container>

      <ScrollView horizontal>
        <View>
          <Table borderStyle={styles.tableBorder}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.tableHeadingText}
            />
          </Table>
          {hasRevenue() && (
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={styles.tableBorder}>
                {dataReport.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={widthArr}
                    style={[
                      styles.row,
                      index % 2 && {backgroundColor: '#f5f5f5'},
                    ]}
                    textStyle={styles.tableCellText}
                  />
                ))}
              </Table>
            </ScrollView>
          )}
        </View>
      </ScrollView>
      {!loading && !hasRevenue() && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.noResultContainer]}>
          <NoResult message="Chưa có danh sách" />
        </View>
      )}
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  reload: {
    fontSize: 22,
    color: '#fff',
    right: 12,
  },
  headingWrapper: {
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  headingContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    paddingBottom: 15,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  header: {
    height: 50,
    backgroundColor: appConfig.colors.primary,
  },
  yearMonthBtnContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  selectMonthContainer: {
    overflow: 'hidden',
    borderRadius: 4,
  },
  yearMonthIcon: {
    height: '100%',
    fontSize: 18,
    color: '#fff',
    padding: 10,
    backgroundColor: appConfig.colors.primary,
  },
  yearMonthTxt: {
    color: '#333',
    padding: 10,
  },
  totalIncomeContainer: {
    alignItems: 'flex-end',
  },
  totalIncomeTitle: {
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1,
    color: '#333',
    marginBottom: 3,
  },
  incomeTxt: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appConfig.colors.primary,
    letterSpacing: 0.6,
  },
  incomeUnitTxt: {
    fontWeight: '300',
    color: '#333',
    fontSize: 12,
    letterSpacing: 0,
  },

  tableHeadingText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tableCellText: {
    textAlign: 'center',
    color: '#333',
  },
  dataWrapper: {
    marginTop: -1,
  },
  row: {
    height: 40,
    backgroundColor: '#fff',
  },

  tableBorder: {
    borderWidth: 0.5,
    borderColor: '#888',
  },
  noResultContainer: {
    marginTop: '50%',
  },
});

export default memo(SalesReport);