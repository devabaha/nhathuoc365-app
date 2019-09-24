import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import lodash from 'lodash';
import DatePicker from 'react-native-datepicker';

export default class HorizontalInfoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null
    };
  }

  _renderRightView = (id, input, select, value, defaultValue, specialColor) => {
    if (!input && !select) {
      return (
        <Text
          style={[
            styles.detailTitle,
            { color: specialColor ? specialColor : 'black' }
          ]}
        >
          {value}
        </Text>
      );
    } else if (input) {
      return (
        <TextInput
          style={styles.detailTitle}
          value={value}
          placeholder={defaultValue}
          onChangeText={this._onChangeInputValue}
        />
      );
    } else if (select) {
      if (id === 'ngay_sinh') {
        return (
          <View style={styles.btnSelect}>
            <DatePicker
              style={{ flex: 1 }}
              date={this.state.selectedDate}
              mode="date"
              placeholder={defaultValue}
              format="YYYY/MM/DD"
              confirmBtnText="Xong"
              cancelBtnText="Huỷ"
              showIcon={false}
              customStyles={{
                dateText: {
                  fontSize: 14,
                  color: 'black',
                  position: 'absolute',
                  right: 0
                },
                placeholderText: {
                  fontSize: 14,
                  color: '#989898',
                  position: 'absolute',
                  right: 0
                },
                dateInput: {
                  borderColor: 'transparent'
                }
              }}
              onDateChange={date => {
                this.setState({ selectedDate: date }, () => {
                  if (lodash.isFunction(this.props.onSelectedDate)) {
                    this.props.onSelectedDate(date);
                  }
                });
              }}
            />
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            style={styles.btnSelect}
            onPress={this._onSelectValue}
          >
            <Text
              style={{
                fontSize: 14,
                color: lodash.isEmpty(value) ? '#989898' : 'black'
              }}
            >
              {lodash.isEmpty(value) ? defaultValue : value}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  };

  _onChangeInputValue = value => {
    if (lodash.isFunction(this.props.onChangeInputValue)) {
      this.props.onChangeInputValue(this.props.data, value);
    }
  };

  _onSelectValue = () => {
    if (lodash.isFunction(this.props.onSelectedValue)) {
      this.props.onSelectedValue(this.props.data);
    }
  };

  render() {
    const {
      data: {
        id,
        title,
        value,
        disable,
        input,
        select,
        defaultValue,
        specialColor
      }
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: disable ? '#EAF0F6' : 'white' }
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        {this._renderRightView(
          id,
          input,
          select,
          value,
          defaultValue,
          specialColor
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15
  },

  title: {
    fontSize: 14,
    color: '#989898',
    marginLeft: 20,
    textAlign: 'left',
    flex: 0.4
  },

  detailTitle: {
    flex: 0.6,
    fontSize: 14,
    color: 'black',
    marginRight: 20,
    textAlign: 'right'
  },

  btnSelect: {
    flex: 0.6,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});
