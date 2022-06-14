import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
// 3-party libs
import {debounce} from 'lodash';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Container, FlatList, TextButton} from 'src/components/base';

const AndroidPicker = ({
  refList: refListProps,
  data,
  itemHeight,
  visibleItemsNumber,
  renderListEmpty,
  initNumToRender,
  initScrollIndex,
  itemStyle: itemStyleProps,
  itemTextStyle,
  selectedItemPosition,
  onValueChange = () => {},
}) => {
  const {theme} = useTheme();

  const [defaultListHeight, setDefaultListHeight] = useState();

  const innerRefList = useRef();
  const itemSelectedIndex = useRef(0);
  const onViewableItemsChanged = useRef(({viewableItems, changed}) => {
    const index = viewableItems[0]?.index;
    itemSelectedIndex.current = index;
  });

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  });

  useEffect(() => {
    didMount();

    return unMount;
  }, []);

  const didMount = () => {
    const refList = !!refListProps ? refListProps : innerRefList;

    if (refList.current && selectedItemPosition > 0) {
      setTimeout(() => {
        refList.current.scrollToIndex({index: selectedItemPosition});
      }, 200);
    }
  };

  const unMount = () => {};

  const onContainerLayout = (event) => {
    if (visibleItemsNumber !== undefined) {
      return;
    }

    setDefaultListHeight(event.nativeEvent.layout.height);
  };

  const handleOnMomentumScrollEnd = useCallback(() => {
    onValueChange(
      data[itemSelectedIndex.current]?.value,
      itemSelectedIndex.current,
    );
  }, [itemSelectedIndex.current]);

  const handleRefList = (inst) => {
    if (refListProps) {
      refListProps.current = inst;
    }

    innerRefList.current = inst;
  };

  const handlePressItem = debounce((index) => {
    if (innerRefList.current) {
      innerRefList.current.scrollToIndex({index});
    }
  }, 300);

  const buttonTypoProps = useMemo(() => {
    return {type: TypographyType.TITLE_SEMI_LARGE};
  }, []);

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      height:
        visibleItemsNumber !== undefined
          ? visibleItemsNumber * itemHeight
          : defaultListHeight,
    });
  }, [visibleItemsNumber, itemHeight, defaultListHeight]);

  const unselectedViewHeight = useMemo(() => {
    const height =
      visibleItemsNumber === undefined
        ? defaultListHeight
        : itemHeight * visibleItemsNumber;
    return (height - itemHeight) / 2;
  }, [itemHeight, visibleItemsNumber, defaultListHeight]);

  const contentContainerStyle = useMemo(() => {
    return {
      paddingVertical: unselectedViewHeight || 0,
    };
  }, [unselectedViewHeight]);

  const itemStyle = useMemo(() => {
    return mergeStyles(
      [
        styles.rowData,
        {
          height: itemHeight,
        },
      ],
      itemStyleProps,
    );
  }, [itemHeight, itemStyleProps]);

  const highlightMainViewStyle = useMemo(() => {
    return {
      ...StyleSheet.absoluteFill,
      top: unselectedViewHeight || 0,
      height: itemHeight,
      borderTopWidth: theme.layout.borderWidth,
      borderBottomWidth: theme.layout.borderWidth,
      borderColor: theme.color.border,
    };
  }, [theme, itemHeight, unselectedViewHeight]);

  const unselectedViewStyle = useMemo(() => {
    return {
      ...StyleSheet.absoluteFill,
      height: unselectedViewHeight || 0,
      backgroundColor: theme.color.surface,
      opacity: 0.7,
    };
  }, [theme, unselectedViewHeight]);

  const unselectedTopViewStyle = useMemo(() => {
    return mergeStyles(unselectedViewStyle, {
      top: 0,
    });
  }, [unselectedViewStyle]);

  const unselectedBottomViewStyle = useMemo(() => {
    return mergeStyles(unselectedViewStyle, {
      top: (unselectedViewHeight || 0) + itemHeight,
    });
  }, [unselectedViewStyle, unselectedViewHeight, itemHeight]);

  const itemTitleStyle = useMemo(() => {
    return mergeStyles(styles.itemText, itemTextStyle);
  }, [itemTextStyle]);

  const renderSelectedItemHighlight = () => {
    return (
      <>
        <View pointerEvents="none" style={unselectedTopViewStyle} />
        <View pointerEvents="none" style={highlightMainViewStyle} />
        <View pointerEvents="none" style={unselectedBottomViewStyle} />
      </>
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TextButton
        key={index}
        useTouchableHighlight
        onPress={() => handlePressItem(index)}
        style={itemStyle}
        typoProps={buttonTypoProps}
        titleStyle={itemTitleStyle}>
        {item.label}
      </TextButton>
    );
  };

  return (
    <Container style={containerStyle} centerVertical>
      <FlatList
        onLayout={onContainerLayout}
        ref={handleRefList}
        data={data}
        contentContainerStyle={contentContainerStyle}
        scrollEventThrottle={16}
        snapToOffsets={data.map((_, index) => index * itemHeight)}
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged.current}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        viewabilityConfig={viewabilityConfig.current}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={renderListEmpty}
        onScrollToIndexFailed={(e) => {
          console.log(e);
        }}
        pagingEnabled
        initialNumToRender={initNumToRender}
        initialScrollIndex={initScrollIndex}
        getItemLayout={(data, index) => {
          return {
            length: itemHeight,
            offset: itemHeight * index,
            index,
          };
        }}
      />

      {!!data.length && renderSelectedItemHighlight()}
    </Container>
  );
};

export default AndroidPicker;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexGrow: 1,
  },
  rowData: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    textAlign: 'center',
    // fontWeight: 'bold',
  },
});
