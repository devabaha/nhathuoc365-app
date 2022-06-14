import React, {memo, useMemo} from 'react';
import {StyleSheet, Platform} from 'react-native';
// 3-party libs
import {Picker as RNPicker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
import {WheelPicker} from '@delightfulstudio/react-native-wheel-picker-android';
// configs
import appConfig from 'app-config';
// helpers
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {rgbaToRgb, hexToRgba} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container} from 'src/components/base';
import NoResult from 'src/components/NoResult';
import AndroidPicker from './AndroidPicker';

const styles = StyleSheet.create({
  pickerMask: {
    zIndex: 1,
    height: 30,
    width: '100%',
    position: 'absolute',
  },
  picker: {
    width: '100%',
    ...Platform.select({
      ios: {
        paddingVertical: 0,
      },
      android: {
        maxHeight: appConfig.device.height * 0.4,
      },
    }),
  },

  listEmptyContainer: {
    flex: undefined,
    width: undefined,
    height: undefined,
    maxHeight: appConfig.device.height * 0.4,
  },
  listEmptyTitle: {
    paddingHorizontal: 20,
  },
  wheelPicker: {
    height: appConfig.device.height * 0.3,
  },
});

const ANDROID_PICKER_FONT_SIZE_RATIO = 38 / 14;

const Picker = ({
  refList = undefined,
  data,
  selectedValue = undefined,
  androidItemStyle = undefined,
  androidInitNumToRender = undefined,
  androidInitScrollIndex = undefined,
  androidItemTextStyle = {},
  listEmptyTitleStyle = {},
  onValueChange = (value, index) => {},
  listEmptyTitle = '',
  listEmptyIconName = undefined,
  listEmptyIconBundle = undefined,
  listEmptyIconSize = undefined,
  androidItemHeight = 50,
  androidVisibleItemsNumber = undefined,
}) => {
  const {theme} = useTheme(ThemeContext);
  const {t} = useTranslation();

  const pickerContainerStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.surface,
    };
  }, [theme]);

  const pickerMaskColors = useMemo(() => {
    return [theme.color.surface, hexToRgba(theme.color.surface, 0)];
  }, [theme]);

  const pickerItemStyle = useMemo(() => {
    return {color: theme.color.textPrimary};
  }, [theme]);

  const listEmptyStyle = useMemo(() => {
    return mergeStyles(styles.listEmptyTitle, listEmptyTitleStyle);
  }, [listEmptyTitleStyle]);

  const androidFormattedData = useMemo(() => {
    return data.map((item) => item.label);
  }, [data]);

  const androidInitPosition = useMemo(() => {
    const position = data.findIndex((item) => {
      return item.value === selectedValue;
    });
    if (position < 0) {
      return 0;
    }
    return position;
  }, [data, selectedValue]);

  const androidItemTextColor = useMemo(() => {
    return theme.typography[TypographyType.LABEL_MEDIUM_SECONDARY].color;
  }, [theme]);

  const androidSelectedItemTextColor = useMemo(() => {
    const color = theme.color.textPrimary;
    return color === '#ffffff' ? '#fffffe' : color;
  }, [theme]);

  const androidItemFontSize = useMemo(() => {
    return (
      theme.typography[TypographyType.LABEL_MEDIUM].fontSize *
      ANDROID_PICKER_FONT_SIZE_RATIO
    );
  }, [theme]);

  const onItemAndroidSelected = (itemData) => {
    const index = itemData.position;
    const itemValue = data[index]?.value;
    onValueChange(itemValue, index);
  };

  const renderIosItem = () => {
    return data.map((item, index) => (
      <RNPicker.Item key={index} label={item.label} value={item.value} />
    ));
  };

  const renderListEmpty = () => {
    return (
      <Container flex center>
        <NoResult
          iconBundle={listEmptyIconBundle}
          iconName={listEmptyIconName}
          iconSize={listEmptyIconSize}
          message={listEmptyTitle || t('noResult')}
          containerStyle={[styles.listEmptyContainer, pickerContainerStyle]}
          textStyle={listEmptyStyle}
        />
      </Container>
    );
  };

  if (!data?.length) {
    return renderListEmpty();
  }

  switch (Platform.OS) {
    case 'ios':
      return (
        <Container noBackground style={pickerContainerStyle}>
          <LinearGradient
            style={styles.pickerMask}
            colors={pickerMaskColors}
            locations={[0.3, 1]}
          />
          <RNPicker
            selectedValue={selectedValue}
            style={styles.picker}
            itemStyle={pickerItemStyle}
            onValueChange={onValueChange}>
            {renderIosItem()}
          </RNPicker>
        </Container>
      );
    case 'android':
      return (
        // <AndroidPicker
        //   refList={refList}
        //   data={data}
        //   itemHeight={androidItemHeight}
        //   visibleItemsNumber={androidVisibleItemsNumber}
        //   renderListEmpty={renderListEmpty}
        //   initNumToRender={androidInitNumToRender}
        //   initScrollIndex={androidInitScrollIndex}
        //   itemStyle={androidItemStyle}
        //   itemTextStyle={androidItemTextStyle}
        //   selectedItemPosition={androidInitPosition}
        //   onValueChange={onValueChange}
        // />

        <WheelPicker
          style={styles.wheelPicker}
          data={androidFormattedData}
          isCurved
          hideIndicator
          onItemSelected={onItemAndroidSelected}
          selectedItemTextColor={androidSelectedItemTextColor}
          selectedItemPosition={androidInitPosition}
          itemTextSize={androidItemFontSize}
          itemTextColor={androidItemTextColor}
          backgroundColor={theme.color.surface}
        />
      );
    default:
      return null;
  }
};

export default memo(Picker);
