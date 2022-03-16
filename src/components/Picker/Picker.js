import React, {memo, useMemo} from 'react';
import {StyleSheet, Platform} from 'react-native';
// 3-party libs
import {Picker as RNPicker} from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';
import {useTranslation} from 'react-i18next/';
// helpers
import {useTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
import {rgbaToRgb, hexToRgba} from 'app-helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
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
        maxHeight: 220,
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
  listEmpty: {
    paddingHorizontal: 20,
  },
});

const Picker = ({
  refList = undefined,
  data,
  selectedValue = undefined,
  androidItemStyle = undefined,
  androidInitNumToRender = undefined,
  isDeliverySchedule = false,
  androidItemTextStyle = {},
  onValueChange = (value, index) => {},
  getAndroidItemLayout = undefined,
}) => {
  const {theme} = useTheme(ThemeContext);
  const {t} = useTranslation();
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
    return mergeStyles(
      {
        fontSize: theme.typography[TypographyType.LABEL_MEDIUM].fontSize,
      },
      styles.listEmpty,
    );
  }, [theme]);

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
      <NoResult
        iconBundle={BundleIconSetName.MATERIAL_COMMUNITY_ICONS}
        iconName="clock-alert"
        iconSize={32}
        message={t('common:noTimeDelivery')}
        textStyle={listEmptyStyle}
      />
    );
  };

  switch (Platform.OS) {
    case 'ios':
      return !!data?.length ? (
        <Container noBackground>
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
          />
          {/* <ScrollView
            ref={refList}
            safeLayout
            style={styles.picker}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}>
            <Container center style={styles.androidPicker}>
              {!!data?.length
                ? data.map((item, index) => renderAndroidData({item, index}))
                : isDeliverySchedule
                ? renderListEmpty()
                : null}
            </Container>
          </ScrollView> */}
        </Container>
      );
    default:
      return null;
  }
};

export default memo(Picker);
