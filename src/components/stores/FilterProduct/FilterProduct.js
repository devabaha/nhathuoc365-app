import React, {useRef, useState, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Animated, {call, Easing, timing} from 'react-native-reanimated';
import {isEmpty, isEqual} from 'lodash';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// helpers
import {mergeStyles} from 'src/Themes/helper';
import {showDrawer} from 'src/components/Drawer';
// routing
import {push} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {
  BundleIconSetName,
  TypographyType,
} from 'src/components/base';
// custom components
import FilterDrawer from './FilterDrawer';
import {
  AppFilledButton,
  BaseButton,
  Container,
  TextButton,
  Typography,
  Icon,
} from 'src/components/base';

const FilterProduct = ({
  options: optionsProp,
  animatedScrollY = new Animated.Value(0),
  animatedContentOffsetY = new Animated.Value(0),
  wrapperStyle,
  onValueSort,
  selectedFilter,
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('filterProduct');

  const SORT_OPTIONS = [
    {
      id: 1,
      name: t('popular'),
      value: 'ordering',
      isSelected: false,
      order: 'asc',
    },
    {
      id: 2,
      name: t('selling'),
      value: 'sales',
      isSelected: false,
      order: 'desc',
    },
    {
      id: 3,
      name: t('new'),
      value: 'created',
      isSelected: false,
      order: 'desc',
    },
    {
      id: 4,
      name: t('priceLowToHigh'),
      value: 'price',
      isSelected: false,
      order: 'asc',
    },
    {
      id: 5,
      name: t('priceHighToLow'),
      value: 'price',
      isSelected: false,
      order: 'desc',
    },
  ];

  const [options, setOptions] = useState(optionsProp || SORT_OPTIONS);
  const [defaultSelected, setDefaultSelected] = useState({});

  const showAnimating = useRef(false);
  const hideAnimating = useRef(false);
  const translateY = useRef(new Animated.Value(0));

  const titleRightTypoProps = {type: TypographyType.LABEL_MEDIUM_TERTIARY};

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
    push(appConfig.routes.filterProduct, {
      defaultSelected: defaultSelected,
      data: options,
      title: t('titleLeft'),
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

  const renderIconFilter = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name="filter"
        style={[titleStyle, styles.icon]}
      />
    );
  };

  const renderIconRemoveTag = () => {
    return (
      <View style={removeTagContainerStyle}>
        <Icon
          bundle={BundleIconSetName.ANT_DESIGN}
          name="close"
          style={[styles.smallIcon, activeIconStyle]}
        />
      </View>
    );
  };

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {color: theme.color.iconInactive});
  }, [theme]);

  const reanimatedWrapperStyle = useMemo(() => {
    return mergeStyles(styles.wrapper, {
      borderColor: theme.color.border,
      borderBottomWidth: theme.layout.borderWidthSmall,
    });
  }, [theme]);

  const btnFilterRightStyle = useMemo(() => {
    return mergeStyles(styles.btnFilterRight, {
      borderColor: theme.color.border,
      borderLeftWidth: theme.layout.borderWidthSmall,
    });
  }, [theme]);

  const tagSelectedStyle = useMemo(() => {
    return mergeStyles(styles.tagSelected, {
      backgroundColor: hexToRgba(theme.color.primaryHighlight, 0.15),
      borderRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  const removeTagContainerStyle = useMemo(() => {
    return mergeStyles(styles.removeTagContainer, {
      backgroundColor: hexToRgba(theme.color.primaryHighlight, 0.85),
    });
  }, [theme]);

  const activeIconStyle = useMemo(() => {
    return mergeStyles(styles.activeIcon, {
      color: theme.color.onPrimaryHighlight,
    });
  }, [theme]);

  const tagStyle = useMemo(() => {
    return theme.typography[TypographyType.LABEL_MEDIUM];
  }, [theme]);

  return (
    <>
      <Animated.Code
        exec={call(
          [animatedScrollY, animatedContentOffsetY],
          ([scrollingValue, offsetValue]) =>
            scrollListener(scrollingValue, offsetValue),
        )}
      />
      <Container
        reanimated
        style={[
          reanimatedWrapperStyle,
          animatedWrapperStyle.current,
          wrapperStyle,
        ]}>
        <View style={styles.container}>
          <BaseButton
            hitSlop={HIT_SLOP}
            style={styles.btnFilterLeft}
            onPress={handleOpenModal}>
            <Typography
              type={TypographyType.LABEL_MEDIUM_TERTIARY}
              style={styles.title}>
              {t('titleLeft')}
            </Typography>
            <Container noBackground row style={styles.valueTextContainer}>
              {!isEmpty(defaultSelected) && (
                <Typography
                  type={TypographyType.LABEL_MEDIUM}
                  style={styles.valueText}>
                  {defaultSelected.name}
                </Typography>
              )}
              <Icon
                bundle={BundleIconSetName.ANT_DESIGN}
                name="down"
                style={[iconStyle, styles.smallIcon]}
              />
            </Container>
          </BaseButton>

          <Container row centerVertical={false}>
            <TextButton
              typoProps={titleRightTypoProps}
              hitSlop={HIT_SLOP}
              style={btnFilterRightStyle}
              titleStyle={[styles.title, styles.titleRight]}
              renderIconLeft={renderIconFilter}
              onPress={() => {
                showDrawer({
                  content: <FilterDrawer />,
                });
              }}>
              {t('titleRight')}
            </TextButton>
          </Container>
        </View>

        {!isEmpty(selectedFilter) ? (
          <View style={styles.tagWrapper}>
            {Object.values(selectedFilter).map((tag, index) => (
              <AppFilledButton
                key={index}
                style={tagSelectedStyle}
                titleStyle={[styles.tag, tagStyle]}
                renderIconRight={renderIconRemoveTag}
                onPress={handleRemoveTag(tag)}>
                {tag.tag}
              </AppFilledButton>
            ))}
          </View>
        ) : null}
      </Container>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  btnFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  btnFilterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  title: {
    marginRight: 5,
  },
  valueTextContainer: {
    flex: 0.8,
  },
  valueText: {
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
    paddingHorizontal: 4,
  },
  tagSelected: {
    marginRight: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 3,
    paddingHorizontal: 5,
    overflow: 'hidden',
  },

  removeTagContainer: {
    margin: -5,
    padding: 3,
    marginLeft: 5,
  },
  smallIcon: {
    fontSize: 14,
    alignSelf: 'center',
  },
  icon: {
    fontSize: 18,
  },
  activeIcon: {},
});

export default React.memo(FilterProduct);
