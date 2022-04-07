import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Clipboard from '@react-native-community/clipboard';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {updateNavbarTheme} from 'src/Themes/helper/updateNavBarTheme';
import EventTracker from 'app-helper/EventTracker';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// custom components
import HorizontalInfoItem from './HorizontalInfoItem';
import {ScreenWrapper, SectionList, TypographyType} from 'src/components/base';

class DetailHistoryPayment extends Component {
  static contextType = ThemeContext;

  eventTracker = new EventTracker();

  updateNavBarDisposer = () => {};

  get theme() {
    return getTheme(this);
  }

  get sections() {
    return [
      {
        id: 'id_section_1',
        data: [
          {
            id: 'ma_giao_dich',
            title: this.props.t('detailHistory.transactionCode'),
            value: this.props.transaction_hash,
            select: true,
            rightTextStyle: [
              {
                maxWidth: '65%',
                right: 0,
                left: 40,
              },
              this.theme.typography[TypographyType.LABEL_SEMI_MEDIUM],
            ],
          },
          {
            id: 'thoi_gian',
            title: this.props.t('detailHistory.time'),
            value: this.props.created,
          },
        ],
      },
      {
        id: 'id_section_2',
        data: [
          {
            id: 'noi_dung',
            title: this.props.t('detailHistory.content'),
            value: this.props.content,
          },
        ],
      },
      {
        id: 'id_section_3',
        data: [
          {
            id: 'thay_doi',
            title: this.props.t('detailHistory.change'),
            value: this.props.amount_view,
            rightTextStyle: [
              this.theme.typography[TypographyType.LABEL_LARGE],
              {
                fontWeight: 'bold',
                color:
                  this.props.amount > 0
                    ? this.theme.color.success
                    : this.theme.color.danger,
              },
            ],
          },
        ],
      },
    ];
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();

    this.updateNavBarDisposer = updateNavbarTheme(
      this.props.navigation,
      this.theme,
    );
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();

    this.updateNavBarDisposer();
  }

  handleSelectValue = (transaction) => {
    Clipboard.setString(transaction.value);
    Toast.show(this.props.t('copied'));
  };

  _renderSectionSeparator = () => {
    return <View style={styles.separatorSection} />;
  };

  _renderItemSeparator = () => {
    return <View style={styles.separatorItem} />;
  };

  _renderItems = ({item, index, section}) => {
    return (
      <HorizontalInfoItem
        data={item}
        onSelectedValue={this.handleSelectValue}
      />
    );
  };

  render() {
    return (
      <ScreenWrapper style={styles.container}>
        <SectionList
          safeLayout
          style={styles.sectionList}
          renderItem={this._renderItems}
          SectionSeparatorComponent={this._renderSectionSeparator}
          ItemSeparatorComponent={this._renderItemSeparator}
          sections={this.sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
      </ScreenWrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
    width: '100%',
  },

  sectionList: {
    flex: 1,
  },

  separatorSection: {
    width: '100%',
    height: 5,
  },

  separatorItem: {
    height: 1,
  },
});

export default withTranslation('vndWallet')(observer(DetailHistoryPayment));
