import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {Table, Row, Col} from 'react-native-table-component';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
//context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import Block from './Block';

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  rulesTitle: {},
  resultsTitle: {},
  table: {
    marginTop: -1,
  },
  tableBorder: {},
  tableHeading: {},
  tableHeadingText: {
    textTransform: 'uppercase',
  },
  tableCellText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontWeight: '500',
  },
  tableEmptyText: {
    fontStyle: 'italic',
    paddingVertical: 20,
  },
});

const TABLE_WIDTH_ARR = [
  (appConfig.device.width - 30) / 2,
  (appConfig.device.width - 30) / 2,
];
class Body extends Component {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  renderResults = () => {
    return (
      <Table style={styles.table} borderStyle={this.tableBorderStyle}>
        <Row
          data={[[this.props.t('body.date')], [this.props.t('body.code')]]}
          widthArr={TABLE_WIDTH_ARR}
          style={this.tableHeadingStyle}
          textStyle={[this.tableCellTextStyle, this.tableHeadingTextStyle]}
        />
        {!!this.props.results.length ? (
          this.props.results.map((result, index) => (
            <Row
              key={index}
              data={[[result.created], [result.prediction_number]]}
              widthArr={TABLE_WIDTH_ARR}
              style={[
                styles.row,
                {
                  backgroundColor:
                    index % 2 && this.theme.color.contentBackgroundWeak,
                },
              ]}
              textStyle={this.tableCellTextStyle}
            />
          ))
        ) : (
          <Col
            data={[[this.props.t('body.noCode')]]}
            style={styles.tableEmpty}
            textStyle={[this.tableCellTextStyle, this.tableEmptyTextStyle]}
          />
        )}
      </Table>
    );
  };

  get tableBorderStyle() {
    return {
      borderWidth: this.theme.layout.borderWidthSmall,
      borderColor: this.theme.color.onBackground,
    };
  }

  get tableHeadingStyle() {
    return mergeStyles(styles.tableHeading, {
      backgroundColor: this.theme.color.persistPrimary,
    });
  }

  get tableCellTextStyle() {
    return mergeStyles(styles.tableCellText, {
      color: this.theme.color.textPrimary,
    });
  }

  get tableHeadingTextStyle() {
    return mergeStyles(styles.tableHeadingText, {
      color: this.theme.color.onPersistPrimary,
    });
  }

  get resultsTitleStyle() {
    return mergeStyles(styles.resultsTitle, {
      color: this.theme.color.persistPrimary,
    });
  }

  get tableEmptyTextStyle() {
    return mergeStyles(styles.tableEmptyText, {
      color: this.theme.color.textTertiary,
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Block
          title={this.props.t('body.rulesTitle')}
          content={this.props.rules}
          iconName="balance-scale"
        />
        <Block
          title={this.props.t('body.prizeStructureTitle')}
          content={this.props.prize}
          iconName="gifts"
        />
        {!!this.props.results && (
          <Block
            title={this.props.t('body.codeList')}
            content={this.props.results}
            customContent={this.renderResults()}
            // iconName="gifts"
          />
        )}
      </View>
    );
  }
}

export default withTranslation('lotteryGame')(Body);
