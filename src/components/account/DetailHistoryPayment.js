import React, {Component} from 'react';
import {View, StyleSheet, SectionList} from 'react-native';

import appConfig from 'app-config';

import HorizontalInfoItem from './HorizontalInfoItem';
import EventTracker from '../../helper/EventTracker';
import Clipboard from '@react-native-community/clipboard';

class DetailHistoryPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: [
        {
          id: 'id_section_1',
          data: [
            {
              id: 'ma_giao_dich',
              title: 'Mã giao dịch',
              value: this.props.transaction_hash,
              select: true,
              rightTextStyle: {
                fontSize: 13,
              },
            },
            {
              id: 'thoi_gian',
              title: 'Thời gian',
              value: this.props.created,
            },
          ],
        },
        {
          id: 'id_section_2',
          data: [
            {
              id: 'noi_dung',
              title: 'Nội dung',
              value: this.props.content,
              rightTextStyle: {
                fontWeight: '500',
              },
            },
          ],
        },
        {
          id: 'id_section_3',
          data: [
            {
              id: 'thay_doi',
              title: 'Thay đổi',
              value: this.props.amount_view,
              rightTextStyle: {
                fontWeight: 'bold',
                fontSize: 16,
                color:
                  this.props.amount > 0
                    ? appConfig.colors.status.success
                    : appConfig.colors.status.danger,
              },
            },
          ],
        },
      ],
    };
    this.eventTracker = new EventTracker();
  }

  componentDidMount() {
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
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
      <View style={styles.container}>
        <SectionList
          style={{flex: 1}}
          renderItem={this._renderItems}
          SectionSeparatorComponent={this._renderSectionSeparator}
          ItemSeparatorComponent={this._renderItemSeparator}
          sections={this.state.sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    marginBottom: 0,
    width: '100%',
    backgroundColor: '#EFEFF4',
  },

  separatorSection: {
    width: '100%',
    height: 5,
  },

  separatorItem: {
    height: 1,
    backgroundColor: '#EFEFF4',
  },

  rightBtnEdit: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
  },

  txtEdit: {
    fontSize: 14,
    color: '#ffffff',
  },
});

export default withTranslation()(observer(DetailHistoryPayment));
