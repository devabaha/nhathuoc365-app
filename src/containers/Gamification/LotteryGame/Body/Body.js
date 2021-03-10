import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import Block from './Block';
import {SUB_COLOR} from '../constants';
import appConfig from 'app-config';
import {Table, Row, Col} from 'react-native-table-component';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  rulesTitle: {
    color: SUB_COLOR,
  },
  resultsTitle: {
    color: appConfig.colors.primary,
  },

  tableBorder: {
    borderWidth: 0.5,
    borderColor: '#888',
  },
  tableHeading: {
    backgroundColor: appConfig.colors.primary,
  },
  tableHeadingText: {
    color: '#fff',
    textTransform: 'uppercase',
  },
  tableCellText: {
    textAlign: 'center',
    color: '#333',
    paddingVertical: 10,
    fontWeight: '500',
  },
  tableEmptyText: {
    fontStyle: 'italic',
    color: '#888',
    paddingVertical: 20
  }
});

const TABLE_WIDTH_ARR = [
  (appConfig.device.width - 30) / 2,
  (appConfig.device.width - 30) / 2,
];
class Body extends Component {
  state = {};

  renderResults = () => {
    return (
      <Table borderStyle={styles.tableBorder}>
        <Row
          data={[['Ngày'], ['Mã']]}
          widthArr={TABLE_WIDTH_ARR}
          style={styles.tableHeading}
          textStyle={[styles.tableCellText, styles.tableHeadingText]}
        />
        {!!this.props.results.length ? (
          this.props.results.map((result, index) => (
            <Row
              key={index}
              data={[[result.created], [result.prediction_number]]}
              widthArr={TABLE_WIDTH_ARR}
              style={[styles.row, index % 2 && {backgroundColor: '#f5f5f5'}]}
              textStyle={styles.tableCellText}
            />
          ))
        ) : (
          <Col
            data={[['Chưa có mã']]}
            style={styles.tableEmpty}
            textStyle={[styles.tableCellText, styles.tableEmptyText]}
          />
        )}
      </Table>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Block
          title="Thể lệ game"
          content={this.props.rules}
          iconName="balance-scale"
          titleStyle={styles.rulesTitle}
          iconStyle={styles.rulesTitle}
        />
        <Block
          title="Cơ cấu giải thưởng"
          content={this.props.prize}
          iconName="gifts"
        />
        {!!this.props.results && (
          <Block
            title="Danh sách mã của bạn"
            content={this.props.results}
            titleStyle={styles.resultsTitle}
            customContent={this.renderResults()}
            // iconName="gifts"
          />
        )}
      </View>
    );
  }
}

export default Body;
