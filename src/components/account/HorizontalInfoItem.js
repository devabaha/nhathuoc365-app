import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import {isEmpty, isFunction} from 'lodash';
import {Actions} from 'react-native-router-flux';
// configs
import appConfig from 'app-config';
// helpers
import {isValidDate} from 'app-helper';
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// customs components
import {
  Container,
  Typography,
  BaseButton,
  TextButton,
  Input,
} from 'src/components/base';
import Loading from '../Loading';

export default class HorizontalInfoItem extends Component {
  static contextType = ThemeContext;

  state = {
    selectedDate: null,
  };

  get theme() {
    return getTheme(this);
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
        <Typography
          type={TypographyType.LABEL_MEDIUM_TERTIARY}
          style={[
            styles.detailTitle,
            specialColor && {color: specialColor},
            {
              height: undefined,
            },
            !!defaultValue && !value && {color: this.theme.color.placeholder},
            detailTitleStyle,
            rightTextStyle,
          ]}
          {...inputProps}>
          {value || defaultValue}
        </Typography>
      );
    } else if (input) {
      if (mapField) {
        return (
          <BaseButton
            style={{flex: 1, width: '100%'}}
            onPress={this.goToMap.bind(this)}>
            <View pointerEvents="none">
              <Input
                style={[styles.detailTitle, detailTitleStyle, rightTextStyle]}
                value={value}
                placeholder={defaultValue}
                multiline={multiline}
                onChangeText={this._onChangeInputValue}
                {...inputProps}
              />
            </View>
          </BaseButton>
        );
      }
      return (
        <Input
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
            <TextButton
              onPress={() => this.openDateTimePicker(dateValue)}
              style={[styles.btnSelectTitle, detailTitleStyle, rightTextStyle]}>
              {isValidDate(dateValue) ? dateValue : defaultValue}
            </TextButton>
          </View>
        );
      } else {
        return (
          <TextButton
            onPress={this._onSelectValue}
            style={styles.btnSelect}
            titleStyle={[
              isEmpty(value) && {
                color: this.theme.color.placeholder,
              },
              styles.btnSelectTitle,
              detailTitleStyle,
              rightTextStyle,
            ]}
            {...inputProps}>
            {isEmpty(value) ? defaultValue : value}
          </TextButton>
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

  extraTitleStyle = this.props.columnView && styles.columnViewTitle;
  linkStyle = mergeStyles(styles.link, {
    color: this.theme.color.primaryHighlight,
  });

  extraDetailTitleStyle = [
    this.props.data?.isLink && this.linkStyle,
    this.props.data?.columnView && styles.columnViewValue,
  ];

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
    const containerDisabledStyle = {
      backgroundColor: this.theme.color.disabled,
    };

    return (
      <Container
        style={[
          styles.container,
          extraContainerStyle,
          disable && containerDisabledStyle,
          containerStyle,
          dataContainerStyle,
        ]}>
        <Container noBackground row flex>
          {leftTitle}
          <Typography
            type={TypographyType.LABEL_MEDIUM_TERTIARY}
            style={[styles.title, this.extraTitleStyle, titleStyle]}>
            {title}
          </Typography>
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
              this.extraDetailTitleStyle,
              rightTextStyle,
              isLoading,
            )}
      </Container>
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
    textAlign: 'left',
    marginRight: 30,
  },

  detailTitle: {
    flex: 1,
    height: '100%',
    paddingLeft: 1,
    textAlign: 'right',
    paddingVertical: 0,
    textAlignVertical: 'center',
  },

  btnSelect: {
    marginVertical: -15,
  },
  btnSelectTitle: {
    paddingLeft: 0,
    textAlign: 'right',
    paddingVertical: 15,
  },
  columnViewContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    height: null,
    paddingBottom: 10,
  },
  columnViewTitle: {
    flex: 0,
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
    textDecorationLine: 'underline',
  },
});
