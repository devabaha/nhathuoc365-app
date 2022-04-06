import React, {memo, useMemo} from 'react';
import {StyleSheet, Platform} from 'react-native';
// 3-party libs
import {Picker as RNPicker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next';
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
import {Container, TextButton, FlatList} from 'src/components/base';
import NoResult from 'src/components/NoResult';

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
  androidPicker: {
    flexGrow: 1,
    paddingVertical: 15,
  },
  androidDataRow: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  androidDataRowSelected: {},
  androidDataText: {
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  androidDataTextSelected: {
    fontWeight: 'bold',
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
});

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
  getAndroidItemLayout = undefined,
  listEmptyTitle = '',
  listEmptyIconName = undefined,
  listEmptyIconBundle = undefined,
  listEmptyIconSize = undefined,
}) => {
  const {theme} = useTheme(ThemeContext);
  const {t} = useTranslation();

  const pickerContainerStyle = useMemo(() => {
    return {
      backgroundColor: theme.color.surface,
    };
  }, [theme]);

  const androidSelectedRowStyle = useMemo(() => {
    return mergeStyles(styles.androidDataRowSelected, {
      backgroundColor: rgbaToRgb(hexToRgba(theme.color.primary, 0.1)),
    });
  }, [theme]);

  const androidDataTextUnselectedStyle = useMemo(() => {
    return {
      color: theme.color.textSecondary,
    };
  });

  const androidDataTextSelectedStyle = useMemo(() => {
    return {
      color: theme.color.primary,
    };
  });

  const languagePickerItemStyle = mergeStyles(styles.languagePickerItem, {
    color: theme.color.textPrimary,
  });

  const androidButtonTypoProps = useMemo(() => {
    return {type: TypographyType.TITLE_SEMI_LARGE};
  }, []);

  const listEmptyStyle = useMemo(() => {
    return mergeStyles(styles.listEmptyTitle, listEmptyTitleStyle);
  }, [listEmptyTitleStyle]);

  const renderAndroidData = ({item, index}) => {
    const isSelected = item.value === selectedValue;

    return (
      <TextButton
        key={index}
        useTouchableHighlight
        onPress={() => onValueChange(item.value, index)}
        style={[
          styles.androidDataRow,
          isSelected && androidSelectedRowStyle,
          androidItemStyle,
        ]}
        typoProps={androidButtonTypoProps}
        titleStyle={[
          styles.androidDataText,
          androidDataTextUnselectedStyle,
          isSelected && [
            styles.androidDataTextSelected,
            androidDataTextSelectedStyle,
          ],
          androidItemTextStyle,
        ]}>
        {item.label}
      </TextButton>
    );
  };

  const renderIosItem = () => {
    return data.map((lang, index) => (
      <RNPicker.Item key={index} label={lang.label} value={lang.value} />
    ));
  };

  const renderListEmpty = () => {
    return (
      <Container center>
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

  switch (Platform.OS) {
    case 'ios':
      return !!data?.length ? (
        <Container noBackground style={pickerContainerStyle}>
          <LinearGradient
            style={styles.pickerMask}
            colors={[theme.color.surface, hexToRgba(theme.color.surface, 0)]}
            locations={[0.3, 1]}
          />
          <RNPicker
            selectedValue={selectedValue}
            style={styles.picker}
            itemStyle={languagePickerItemStyle}
            onValueChange={onValueChange}>
            {renderIosItem()}
          </RNPicker>
        </Container>
      ) : (
        renderListEmpty()
      );
    case 'android':
      return (
        <Container centerVertical>
          <FlatList
            ref={refList}
            safeLayout
            style={styles.picker}
            data={data}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            renderItem={renderAndroidData}
            keyExtractor={(_, index) => index.toString()}
            ListEmptyComponent={renderListEmpty}
            onScrollToIndexFailed={(e) => {
              console.log(e);
            }}
            initialNumToRender={androidInitNumToRender}
            getItemLayout={getAndroidItemLayout}
            initialScrollIndex={androidInitScrollIndex}
          />
        </Container>
      );
    default:
      return null;
  }
};

export default memo(Picker);
