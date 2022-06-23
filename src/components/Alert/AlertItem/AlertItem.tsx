import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  StyleProp,
  TextStyle,
  AlertButton,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
  Keyboard,
} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
import Animated, {Easing, useValue} from 'react-native-reanimated';
import {BlurView} from '@react-native-community/blur';
// types
import {AlertItemProps} from '.';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {hexToRgba} from 'app-helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Card, Typography} from 'src/components/base';
import AlertItemBtn from './AlertItemBtn';

const styles = StyleSheet.create({
  screenContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenMaskContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  wrapper: {},
  container: {
    overflow: 'hidden',
  },
  title: {
    fontWeight: Platform.select({
      ios: '600',
      default: 'bold',
    }),
  },
  body: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
  },
  btnCancelTitle: {
    fontWeight: 'bold',
  },
  listContentContainer: {
    flexGrow: 1,
  },
  alertItemContainer: {
    flexGrow: 1,
  },
  buttonListContainer: {
    flexDirection: 'row',
  },
  absolute: {
    ...StyleSheet.absoluteFillObject,
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    opacity: Platform.select({
      ios: 0.8,
      default: 1,
    }),
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  separator: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});

const AlertItem = ({
  title,
  message,
  buttons: buttonsProps,
  onClose = () => {},
}: AlertItemProps) => {
  const listRef = useRef<FlatList<AlertButton>>();
  const cancelIndexRef = useRef<number>(0);
  const {theme} = useTheme();
  const {width, height} = useWindowDimensions();
  const {t} = useTranslation();
  const [wrapperWidth, setWrapperWidth] = useState(0);
  const [listContainerHeight, setListContainerHeight] = useState(0);
  const [listContentHeight, setListContentHeight] = useState(0);
  const [headingListContainer, setHeadingContainerHeight] = useState(0);
  const [isRowToColumn, setIsRowToColumn] = useState(false);
  const animatedScale = useValue(0);
  const animatedOpacity = useValue(0);

  const maxHeight = useMemo(() => height * 0.9, [height]);
  const maxWidth = useMemo(() => Math.min(width * 0.7, 270), [height]);

  const separatorDimensions = useMemo(() => {
    return theme.layout.borderWidth;
  }, [theme]);

  const separatorColor = useMemo(() => {
    return theme.color.border;
  }, [theme]);

  const buttons = useMemo<
    (AlertButton & {titleStyle?: StyleProp<TextStyle>})[]
  >(() => {
    let destructiveIndex = -1,
      cancelIndex = -1,
      destructiveBtn = null,
      cancelBtn = null;

    const formattedBtnList = (buttonsProps || []).map((button, index) => {
      const btn: AlertButton = {...button};

      if (btn.style === 'destructive') {
        destructiveIndex = index;
      }

      if (btn.style === 'cancel') {
        cancelIndex = index;
        cancelIndexRef.current = index;
      }

      return btn;
    });

    formattedBtnList.forEach((btn, index) => {
      if (
        (btn.style === 'destructive' && index !== destructiveIndex) ||
        (btn.style === 'cancel' && index !== cancelIndex)
      ) {
        btn.style = 'default';
      }
    });

    if (formattedBtnList.length < 1) {
      formattedBtnList.push({
        text: t('ok'),
        onPress: onClose,
      });
    } else if (formattedBtnList.length === 2) {
      // if (destructiveIndex !== -1 && destructiveIndex !== 1) {
      //   destructiveBtn = formattedBtnList.splice(destructiveIndex, 1, {})[0];
      // }
      if (cancelIndex !== -1 && cancelIndex !== 0) {
        cancelBtn = formattedBtnList.splice(cancelIndex, 1, {})[0];
      }

      // if (destructiveBtn) {
      //   formattedBtnList.push(destructiveBtn);
      // }
      if (cancelBtn) {
        formattedBtnList.unshift(cancelBtn);
      }
    } else {
      if (cancelIndex !== -1 && cancelIndex !== formattedBtnList.length - 1) {
        cancelBtn = formattedBtnList.splice(cancelIndex, 1)[0];
        formattedBtnList.push(cancelBtn);
      }
    }

    return formattedBtnList.filter((btn) => !!btn.text);
  }, [buttonsProps, t, onClose]);

  const itemMinWidth = useMemo(() => {
    return (
      wrapperWidth / buttons.length -
      (separatorDimensions / 2) * (buttons.length - 1)
    );
  }, [wrapperWidth, buttons.length, separatorDimensions]);

  const animate = useCallback((data = {}) => {
    const options = {
      scaleToValue: 1,
      opacityToValue: 1,
      duration: 200,
      easing: Easing.bezier(0.51, 1.07, 0.87, 0.99),
      onFinishScale: () => {},
      onFinishOpacity: () => {},
      ...data,
    };
    Animated.timing(animatedScale, {
      toValue: options.scaleToValue,
      duration: options.duration,
      easing: options.easing,
    }).start(({finished}) => {
      if (finished) {
        options.onFinishScale && options.onFinishScale();
      }
    });
    Animated.timing(animatedOpacity, {
      toValue: options.opacityToValue,
      duration: options.duration,
      easing: options.easing,
    }).start(({finished}) => {
      if (finished) {
        options.onFinishOpacity && options.onFinishOpacity();
      }
    });
  }, []);

  useEffect(() => {
    Keyboard.dismiss();

    animate({
      onFinishScale: () => {
        if (listRef.current && cancelIndexRef.current) {
          setTimeout(() => {
            listRef.current &&
              listRef.current.scrollToIndex({index: buttons.length - 1});
          }, buttons.length * 10);
        }
      },
    });
  }, [buttons, animate]);

  const isInARow = useMemo(() => {
    return buttons.length <= 2;
  }, [buttons.length]);

  const scrollEnabled = useMemo(() => {
    return listContentHeight > listContainerHeight;
  }, [listContentHeight, listContainerHeight]);

  const screenMaskStyle = useMemo(() => {
    return mergeStyles(styles.screenMaskContainer, {
      backgroundColor: hexToRgba(theme.color.coreOverlay, 0.2),
      opacity: animatedOpacity,
    });
  }, [theme]);

  const wrapperBaseStyle = useMemo(() => {
    return mergeStyles(styles.wrapper, {
      width: maxWidth,
      maxHeight,
      borderRadius: theme.layout.borderRadiusHuge,
      opacity: animatedOpacity,
      transform: [
        {
          scale: animatedScale.interpolate({
            inputRange: [0, 1],
            outputRange: [1.3, 1],
          }),
        },
      ],
    });
  }, [theme, maxWidth, maxHeight]);

  const containerBaseStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderRadius: theme.layout.borderRadiusHuge,
    });
  }, [theme]);

  const buttonListContainerStyle = useMemo(() => {
    return mergeStyles(
      styles.buttonListContainer,

      listContentHeight > maxHeight - headingListContainer && {
        height: maxHeight - headingListContainer,
      },
    );
  }, [listContentHeight, headingListContainer, maxHeight, theme]);

  const maskStyle = useMemo(() => {
    return mergeStyles(styles.mask, {
      backgroundColor: theme.color.surface,
    });
  }, [theme]);

  const columnSeparatorStyle = useMemo(() => {
    return mergeStyles(styles.separator, {
      position: 'relative',
      backgroundColor: separatorColor,
      width: separatorDimensions,
    });
  }, [theme, separatorDimensions, separatorColor]);

  const rowSeparatorStyle = useMemo(() => {
    return mergeStyles(styles.mask, {
      backgroundColor: separatorColor,
      height: separatorDimensions,
    });
  }, [theme, separatorDimensions, separatorColor]);

  const handleWrapperLayout = useCallback((e) => {
    setWrapperWidth(e.nativeEvent.layout.width);
  }, []);

  const handleHeadingContainerLayout = useCallback((e) => {
    setHeadingContainerHeight(e.nativeEvent.layout.height);
  }, []);

  const handleListLayout = useCallback((e) => {
    setListContainerHeight(e.nativeEvent.layout.height);
  }, []);

  const handleContentSizeChange = useCallback((listWidth, listHeight) => {
    setListContentHeight(listHeight);
  }, []);

  const timeout = useRef<any>();

  const handleItemLayout = useCallback(
    (e) => {
      clearTimeout(timeout.current);
      const itemWidth = e.nativeEvent.layout.width;
      setIsRowToColumn(Math.floor(itemWidth) > Math.floor(itemMinWidth));
    },
    [itemMinWidth],
  );

  const handlePressBtn = useCallback(
    (btn) => {
      animate({
        opacityToValue: 0,
        onFinishOpacity: onClose,
      });
      btn.onPress && btn.onPress();
    },
    [onClose, animate],
  );

  const renderButton = useCallback(
    ({item: btn, index}) => {
      let btnTitleStyle = {};

      switch (btn.style) {
        case 'cancel':
          btnTitleStyle = styles.btnCancelTitle;
          break;
        case 'destructive':
          btnTitleStyle = {color: theme.color.danger};
          break;
      }

      return (
        <>
          {isInARow && !isRowToColumn && !!index && (
            <View style={columnSeparatorStyle} />
          )}

          <View
            onLayout={handleItemLayout}
            style={[
              isInARow && [
                styles.alertItemContainer,
                {
                  minWidth: itemMinWidth,
                },
              ],
              {
                paddingTop: separatorDimensions,
              },
            ]}>
            {(isInARow || !!index) && <View style={rowSeparatorStyle} />}

            <AlertItemBtn
              title={btn.text}
              titleStyle={btnTitleStyle}
              onPress={() => handlePressBtn(btn)}
            />
          </View>
        </>
      );
    },
    [
      wrapperWidth,
      buttons,
      theme,
      isInARow,
      isRowToColumn,
      itemMinWidth,
      separatorDimensions,
      columnSeparatorStyle,
      rowSeparatorStyle,
      handlePressBtn,
    ],
  );

  return (
    <View style={styles.screenContainer}>
      <Animated.View style={screenMaskStyle} />
      <Card
        shadow
        noBackground
        reanimated
        style={wrapperBaseStyle}
        onLayout={handleWrapperLayout}>
        <View style={containerBaseStyle}>
          {Platform.OS === 'ios' && (
            <BlurView
              style={styles.absolute}
              blurType="light"
              blurAmount={18}
              reducedTransparencyFallbackColor="white"
            />
          )}
          <View style={maskStyle} />
          <View style={styles.body} onLayout={handleHeadingContainerLayout}>
            <Typography type={TypographyType.TITLE_MEDIUM} style={styles.title}>
              {title}
            </Typography>
            {!!message && (
              <Typography
                style={styles.message}
                type={TypographyType.LABEL_SEMI_MEDIUM}>
                {message}
              </Typography>
            )}
          </View>

          <View style={buttonListContainerStyle}>
            {isInARow ? (
              <View style={styles.row}>
                {buttons.map((btn, index) => (
                  <Fragment key={index}>
                    {renderButton({item: btn, index})}
                  </Fragment>
                ))}
              </View>
            ) : (
              <>
                <View style={rowSeparatorStyle} />
                <FlatList
                  ref={listRef}
                  initialNumToRender={30}
                  onScrollToIndexFailed={() => {}}
                  contentContainerStyle={styles.listContentContainer}
                  scrollEnabled={scrollEnabled}
                  onLayout={handleListLayout}
                  onContentSizeChange={handleContentSizeChange}
                  data={buttons}
                  renderItem={renderButton}
                  keyExtractor={(_, index) => String(index)}
                />
              </>
            )}
          </View>
        </View>
      </Card>
    </View>
  );
};

export default AlertItem;
