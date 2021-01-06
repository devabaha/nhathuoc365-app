import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import { isEmpty, isFunction } from 'lodash';
import DatePicker from 'react-native-datepicker';
import appConfig from 'app-config';
import { Actions } from 'react-native-router-flux';

export default class HorizontalInfoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null
    };
  }

  goToMap() {
    Actions.push(appConfig.routes.modalSearchPlaces, {
      onCloseModal: Actions.pop,
      onPressItem: this._onChangeInputValue
    });
  }

  _renderRightView = (
    id,
    input,
    select,
    value,
    defaultValue,
    specialColor,
    multiline,
    mapField,
    inputProps,
    detailTitleStyle,
  ) => {
    if (!input && !select) {
      return (
        <Text
          style={[
            styles.detailTitle,
            { color: specialColor ? specialColor : 'black' },
            detailTitleStyle,
            this.props.detailTitleStyle
          ]}
          {...inputProps}
        >
          {value}
        </Text>
      );
    } else if (input) {
      if (mapField) {
        return (
          <TouchableOpacity
            style={{ flex: 1, width: '100%' }}
            onPress={this.goToMap.bind(this)}
          >
            <View pointerEvents="none">
              <TextInput
                style={[
                  styles.detailTitle,
                  detailTitleStyle,
                  this.props.detailTitleStyle
                ]}
                value={value}
                placeholder={defaultValue}
                multiline={multiline}
                onChangeText={this._onChangeInputValue}
                {...inputProps}
              />
            </View>
          </TouchableOpacity>
        );
      }
      return (
        <TextInput
          style={[
            styles.detailTitle,
            detailTitleStyle,
            this.props.detailTitleStyle
          ]}
          value={value}
          placeholder={defaultValue}
          multiline={multiline}
          onChangeText={this._onChangeInputValue}
          {...inputProps}
        />
      );
    } else if (select) {
      if (id === 'ngay_sinh') {
        return (
          <View style={styles.btnSelect}>
            <DatePicker
              style={{ flex: 1, justifyContent: 'center' }}
              date={value || this.state.selectedDate}
              mode="date"
              placeholder={defaultValue}
              format="YYYY-MM-DD"
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
                  color: appConfig.colors.placeholder,
                  position: 'absolute',
                  right: 0
                },
                dateInput: {
                  borderColor: 'transparent'
                }
              }}
              onDateChange={date => {
                this.setState({ selectedDate: date }, () => {
                  if (isFunction(this.props.onSelectedDate)) {
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
                color: isEmpty(value) ? '#989898' : 'black'
              }}
              {...inputProps}
            >
              {isEmpty(value) ? defaultValue : value}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  };

  _onChangeInputValue = value => {
    if (isFunction(this.props.onChangeInputValue)) {
      this.props.onChangeInputValue(this.props.data, value);
    }
  };

  _onSelectValue = () => {
    if (isFunction(this.props.onSelectedValue)) {
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
        specialColor,
        multiline,
        mapField,
        columnView,
        isHidden
      },
      inputProps
    } = this.props;

    if(isHidden) return null;

    const extraContainerStyle = columnView && styles.columnViewContainer;
    const extraTitleStyle = columnView && styles.columnViewTitle;
    const extraDetailTitleStyle = columnView && styles.columnViewValue;

    return (
      <View
        style={[
          styles.container,
          extraContainerStyle,
          { backgroundColor: disable ? '#eeF0F4' : '#ffffff' },
          this.props.containerStyle
        ]}
      >
        <Text style={[styles.title, extraTitleStyle, this.props.titleStyle]}>
          {title}
        </Text>
        {this._renderRightView(
          id,
          input,
          select,
          value,
          defaultValue,
          specialColor,
          multiline,
          mapField,
          inputProps,
          extraDetailTitleStyle,
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center'
    // paddingTop: 15,
    // paddingBottom: 15
  },

  title: {
    fontSize: 14,
    color: '#888',
    marginLeft: 20,
    textAlign: 'left',
    flex: 0.5
  },

  detailTitle: {
    flex: 0.5,
    fontSize: 14,
    color: '#242424',
    marginRight: 20,
    paddingLeft: 0,
    textAlign: 'right'
  },

  btnSelect: {
    flex: 0.6,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  columnViewContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingVertical: 10,
    height: null,
    paddingHorizontal: 20
  },
  columnViewTitle: {
    flex: 0,
    marginLeft: 0,
    marginBottom: 10
  },
  columnViewValue: {
    textAlign: 'left',
    marginRight: 0,
    flex: 1,
    color: '#242244'
  }
});
