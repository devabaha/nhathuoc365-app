import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {isEmpty, isFunction} from 'lodash';
import {Actions} from 'react-native-router-flux';

import appConfig from 'app-config';
import {isValidDate} from 'app-helper';

import Loading from '../Loading';
import {Container} from '../Layout';
import {mergeStyles} from 'src/Themes/helper';

export default class HorizontalInfoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null,
    };
  }

  goToMap() {
    Actions.push(appConfig.routes.modalSearchPlaces, {
      onCloseModal: Actions.pop,
      onPressItem: this._onChangeInputValue,
    });
  }

  openDateTimePicker = (dateValue) => {
    Actions.push(appConfig.routes.modalDateTimePicker, {
      value: new Date(dateValue),
      onSelect: (date) => {
        this.setState({selectedDate: date}, () => {
          if (isFunction(this.props.onSelectedDate)) {
            this.props.onSelectedDate(date);
          }
        });
      },
    });
  };

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
    rightTextStyle,
    isLoading,
  ) => {
    if (isLoading) {
      return (
        <View style={styles.loadingWrapper}>
          <Loading
            wrapperStyle={styles.loadingContainer}
            style={styles.loading}
            size="small"
          />
        </View>
      );
    }
    if (!input && !select) {
      return (
        <Text
          style={[
            styles.detailTitle,
            {
              color: specialColor ? specialColor : appConfig.colors.text,
              height: undefined,
              // paddingVertical: 15,
            },
            !!defaultValue && !value && {color: appConfig.colors.placeholder},
            detailTitleStyle,
            rightTextStyle,
          ]}
          {...inputProps}>
          {value || defaultValue}
        </Text>
      );
    } else if (input) {
      if (mapField) {
        return (
          <TouchableOpacity
            style={{flex: 1, width: '100%'}}
            onPress={this.goToMap.bind(this)}>
            <View pointerEvents="none">
              <TextInput
                style={[styles.detailTitle, detailTitleStyle, rightTextStyle]}
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
          style={[styles.detailTitle, detailTitleStyle, rightTextStyle]}
          value={value}
          placeholder={defaultValue}
          multiline={multiline}
          onChangeText={this._onChangeInputValue}
          {...inputProps}
        />
      );
    } else if (select) {
      if (id === 'ngay_sinh') {
        const dateValue = value || this.state.selectedDate;

        return (
          <View style={styles.btnSelect}>
            <TouchableOpacity
              onPress={() => this.openDateTimePicker(dateValue)}>
              <Text
                style={mergeStyles(
                  styles.btnSelectTitle,
                  detailTitleStyle,
                  rightTextStyle,
                )}>
                {isValidDate(dateValue) ? dateValue : defaultValue}
              </Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={this._onSelectValue}
            style={styles.btnSelect}>
            <Text
              style={{
                fontSize: 14,
                color: isEmpty(value) ? appConfig.colors.placeholder : 'black',
                ...styles.btnSelectTitle,
                ...detailTitleStyle,
                ...rightTextStyle,
              }}
              {...inputProps}>
              {isEmpty(value) ? defaultValue : value}
            </Text>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  };

  _onChangeInputValue = (value) => {
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
        isHidden,
        renderRight,
        isLoading,
        rightTextStyle,
        titleStyle,
        containerStyle: dataContainerStyle,
        isLink,
        leftTitle,
      },
      containerStyle,
      inputProps,
    } = this.props;

    if (isHidden) return null;

    const extraContainerStyle = columnView && styles.columnViewContainer;
    const extraTitleStyle = columnView && styles.columnViewTitle;
    const extraDetailTitleStyle = {
      ...(isLink && styles.link),
      ...(columnView && styles.columnViewValue),
    };

    return (
      <View
        style={[
          styles.container,
          extraContainerStyle,
          // {backgroundColor: disable ? '#eeF0F4' : '#ffffff'},
          {
            backgroundColor: '#fff',
            opacity: disable ? 0.6 : 1,
          },
          containerStyle,
          dataContainerStyle,
        ]}>
        <Container row flex>
          {leftTitle}
          <Text style={[styles.title, extraTitleStyle, titleStyle]}>
            {title}
          </Text>
        </Container>
        {renderRight
          ? renderRight(styles.detailTitle)
          : this._renderRightView(
              id,
              input,
              select && !disable,
              value,
              defaultValue,
              specialColor,
              multiline,
              mapField,
              inputProps,
              extraDetailTitleStyle,
              rightTextStyle,
              isLoading,
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
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  title: {
    fontSize: 14,
    color: '#888',
    textAlign: 'left',
    marginRight: 30,
  },

  detailTitle: {
    // flex: 1,
    height: '100%',
    fontSize: 14,
    color: '#242424',
    paddingLeft: 0,
    textAlign: 'right',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },

  btnSelect: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'flex-end',
    // paddingVertical: 15,
    marginVertical: -15,
  },
  btnSelectTitle: {
    fontSize: 14,
    color: '#242424',
    paddingLeft: 0,
    textAlign: 'right',
    paddingVertical: 15,
    // marginVertical: -15,
  },
  columnViewContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: null,
    paddingBottom: 10,
  },
  columnViewTitle: {
    flex: 0,
    // paddingVertical: 10,
    paddingTop: 15,
    paddingBottom: 10,
    marginTop: -15,
    marginLeft: 0,
  },
  columnViewValue: {
    textAlign: 'left',
    marginRight: 0,
    paddingRight: 0,
    flex: 1,
    width: '100%',
    color: '#242244',
  },

  loadingWrapper: {
    flex: 1,
    alignItems: 'flex-end',
  },
  loadingContainer: {
    position: undefined,
  },
  loading: {
    padding: 0,
  },

  link: {
    color: appConfig.colors.primary,
    textDecorationLine: 'underline',
  },
});
