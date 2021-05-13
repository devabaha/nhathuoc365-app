import React, {useEffect, useState} from 'react';

import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import Button from 'react-native-button';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {Table, TableWrapper, Row} from 'react-native-table-component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Actions} from 'react-native-router-flux';

import APIHandler from '../../network/APIHandler';
import {APIRequest} from '../../network/Entity';
import ScreenWrapper from '../../components/ScreenWrapper';
import Loading from '../../components/Loading';
import Container from '../../components/Layout/Container';

import appConfig from 'app-config';
import NoResult from '../../components/NoResult';

const styles = StyleSheet.create({
  reload: {
    fontSize: 22,
    color: '#fff',
    right: 12,
  },
  headingContainer: {
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    backgroundColor: '#fff',
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
  itemsRose: {
    flex: 1 / 3,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#999',
  },
  heading: {
    fontSize: 13,
    textAlign: 'center',
  },
  valueText: {
    fontSize: 16,
    paddingVertical: 3,
    fontWeight: 'bold',
  },
  divider: {
    width: 20,
    height: 100,
    backgroundColor: 'red',
  },
});

const CommissionIncomeStatement = (props) => {
  const getCommissionRequest = new APIRequest();
  const requests = [getCommissionRequest];

  const tableHead = [
    'Mã đơn',
    'Giá trị đơn',
    '% Hoa hồng',
    'Hoa hồng',
    'Vị trí',
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
    didMount();

    return unMount;
  }, []);

  const didMount = () => {
    getCommissions();
    setTimeout(() =>
      Actions.refresh({
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
        message: error.message || props.t('common:api.error.message'),
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
    Actions.push(appConfig.routes.modalPicker, {
      title: 'Chọn tháng',
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
      <TouchableOpacity hitSlop={HIT_SLOP} onPress={onHardRefresh}>
        <Ionicons name="ios-reload" style={styles.reload} />
      </TouchableOpacity>
    );
  };

  const renderColumRose = ({item, index}) => {
    return (
      <View style={[styles.itemsRose, {borderRightWidth: index < 2 ? 1 : 0}]}>
        <Text style={styles.heading}>{props.t(item)}</Text>
        <Text style={styles.valueText}>{monthBonus[item]}</Text>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      {isLoading && <Loading center />}

      <Container row padding={15} style={styles.headingContainer}>
        <Button
          containerStyle={styles.yearMonthBtnContainer}
          onPress={openYearMonthPicker}>
          <Container row centerVertical style={styles.selectMonthContainer}>
            <AntDesignIcon name="calendar" style={styles.yearMonthIcon} />
            <Text style={styles.yearMonthTxt}>{selectedMonth}</Text>
          </Container>
        </Button>

        <Container flex style={styles.totalIncomeContainer}>
          <Text style={styles.totalIncomeTitle}>Tổng trong tháng</Text>
          <Text style={styles.incomeTxt}>
            {stats.total_commission_month}
            <Text style={styles.incomeUnitTxt}>
              {' '}
              /{stats.total_cart_accept}
            </Text>
          </Text>
        </Container>
      </Container>
      <View style={{paddingVertical: 10}}>
        <FlatList
          data={tableRose}
          keyExtractor={(i) => i}
          renderItem={renderColumRose}
          numColumns={3}
          scrollEnabled={false}
        />
      </View>

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
          {hasCommissions() && (
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={styles.tableBorder}>
                {commissions.map((rowData, index) => (
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
      {!isLoading && !hasCommissions() && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.noResultContainer]}>
          <NoResult message="Chưa có đơn hàng" />
        </View>
      )}
    </ScreenWrapper>
  );
};

export default withTranslation([
  'commissionIncomeStatement',
  'common',
  'total_revenue',
  'level',
  'total_commission_month',
])(CommissionIncomeStatement);
