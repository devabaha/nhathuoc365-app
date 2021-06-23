import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/AntDesign';
import Animated, {call, Easing, timing} from 'react-native-reanimated';

import appConfig from 'app-config';
import {isEmpty, isEqual} from 'lodash';
import store from 'app-store';
import {showDrawer} from '../../Drawer';
import FilterDrawer from './FilterDrawer';
import Container from '../../Layout/Container';

const SORT_OPTIONS = [
  {id: 1, name: 'Phổ biến', value: 'ordering', isSelected: false, order: 'asc'},
  {id: 2, name: 'Bán chạy', value: 'sales', isSelected: false, order: 'desc'},
  {id: 3, name: 'Mới nhất', value: 'created', isSelected: false, order: 'desc'},
  {
    id: 4,
    name: 'Giá từ thấp đến cao',
    value: 'price',
    isSelected: false,
    order: 'asc',
  },
  {
    id: 5,
    name: 'Giá từ cao đến thấp',
    value: 'price',
    isSelected: false,
    order: 'desc',
  },
];

function FilterProduct({
  titleLeft = 'Sắp xếp',
  titleRight = 'Lọc',
  options: optionsProp = SORT_OPTIONS,
  animatedScrollY = new Animated.Value(0),
  animatedContentOffsetY = new Animated.Value(0),
  wrapperStyle,
  onValueSort,
  selectedFilter,
  onLayout
}) {
  const [options, setOptions] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState({});

  const showAnimating = useRef(false);
  const hideAnimating = useRef(false);
  const translateY = useRef(new Animated.Value(0));

  useEffect(() => {
    setOptions(optionsProp);
  }, []);

  const handleRemoveTag = (tag) => () => {
    const newFilterSelected = Object.keys(selectedFilter).reduce((obj, key) => {
      return {
        ...obj,
        ...(isEqual(selectedFilter[key], tag)
          ? {}
          : {
              [key]: selectedFilter[key],
            }),
      };
    }, {});
    store.setSelectedFilter(newFilterSelected);
  };

  const handleOpenModal = () => {
    Actions.push(appConfig.routes.filterProduct, {
      defaultSelected: defaultSelected,
      data: options,
      title: titleLeft,
      onSelectValueSort: (selected) => {
        const isNotSelected = defaultSelected?.id !== selected.id;

        const newData = options.map((i) => ({
          ...i,
          isSelected: i.id === selected.id && isNotSelected,
        }));
        setDefaultSelected(isNotSelected ? selected : {});
        setOptions(newData);

        onValueSort?.(selected);
      },
    });
  };

  const animating = (toValue, callback = () => {}) => {
    timing(translateY.current, {
      toValue,
      duration: 350,
      easing: Easing.quad,
    }).start(({finished}) => callback(finished));
  };

  const scrollListener = (scrollingValue, offsetValue) => {
    const diff = Math.round(scrollingValue - offsetValue);
    if (
      diff > 100
      // && !forceShowingAnimating
    ) {
      if (hideAnimating.current) return;
      hideAnimating.current = true;
      showAnimating.current = false;
      animating(1);
    } else if (diff < -100) {
      if (showAnimating.current) return;
      hideAnimating.current = false;
      showAnimating.current = true;
      animating(0);
    } else if (diff === 0) {
      // forceShowingAnimating = false;
    }
  };

  const animatedWrapperStyle = useRef({
    // transform: [
    //   {
    //     translateY: concat(
    //       interpolate(translateY.current, {
    //         inputRange: [0, 1],
    //         outputRange: [0, -100],
    //       }),
    //       '%',
    //     ),
    //   },
    // ],
  });

  return (
    <>
      <Animated.Code
        exec={call(
          [animatedScrollY, animatedContentOffsetY],
          ([scrollingValue, offsetValue]) =>
            scrollListener(scrollingValue, offsetValue),
        )}
      />
      <Animated.View
        onLayout={onLayout}
        style={[styles.wrapper, animatedWrapperStyle.current, wrapperStyle]}>
        <View style={styles.container}>
          <TouchableOpacity
            hitSlop={HIT_SLOP}
            style={styles.btnFilterLeft}
            onPress={handleOpenModal}>
            <Text style={styles.title}>{titleLeft}</Text>
            <Container
              row
              centerVertical={false}
              style={styles.valueTextContainer}>
              {!isEmpty(defaultSelected) && (
                <Text style={styles.valueText}>{defaultSelected.name}</Text>
              )}
              <Icon name="down" style={[styles.icon, styles.smallIcon]} />
            </Container>
          </TouchableOpacity>

          <Container row centerVertical={false}>
            <TouchableOpacity
              hitSlop={HIT_SLOP}
              style={styles.btnFilterRight}
              onPress={() => {
                // Actions.drawerOpen();
                showDrawer({
                  content: <FilterDrawer />,
                });
              }}>
              <Icon name="filter" style={styles.icon} />
              <Text style={[styles.title, styles.titleRight]}>
                {titleRight}
              </Text>
            </TouchableOpacity>
          </Container>
        </View>
        {!isEmpty(selectedFilter) ? (
          <View style={styles.tagWrapper}>
            {Object.values(selectedFilter).map((tag, index) => (
              <TouchableOpacity
                onPress={handleRemoveTag(tag)}
                key={index}
                style={styles.tagSelected}>
                <Text style={styles.tag}>{tag.tag}</Text>
                <View style={styles.removeTagContainer}>
                  <Icon
                    name="close"
                    style={[styles.icon, styles.smallIcon, styles.activeIcon]}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    width: '100%',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  btnFilterLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  divider: {
    width: 0.5,
    height: '100%',
    backgroundColor: '#ccc',
    marginRight: 5,
  },
  btnFilterRight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderLeftWidth: 0.5,
    borderColor: '#ccc',
    paddingLeft: 10,
  },
  title: {
    color: '#555',
    marginRight: 5,
  },
  valueTextContainer: {
    flex: 0.8,
  },
  valueText: {
    color: '#242424',
    marginRight: 5,
    fontWeight: '600',
  },
  titleRight: {
    marginLeft: 5,
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 5,
    paddingHorizontal: 10,
  },
  tag: {
    color: '#333',
    fontSize: 12,
    paddingHorizontal: 4,
  },
  tagSelected: {
    marginRight: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.15),
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 5,
    overflow: 'hidden',
  },

  removeTagContainer: {
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.85),
    margin: -5,
    padding: 3,
    marginLeft: 5,
  },
  smallIcon: {
    fontSize: 14,
    alignSelf: 'center',
  },
  icon: {
    color: '#555',
    fontSize: 18,
  },
  activeIcon: {
    color: '#fff',
  },
});

export default React.memo(FilterProduct);
