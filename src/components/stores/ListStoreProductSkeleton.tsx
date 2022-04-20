import React, {useEffect, useState, useMemo, memo} from 'react';
import {View, StyleSheet} from 'react-native';
// 3 party
import Animated, {
  useValue,
  Easing,
  useCode,
  call,
} from 'react-native-reanimated';
import Shimmer from 'react-native-shimmer';
// configs
import appConfig from 'app-config';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {Container, Skeleton, Typography, FlatList} from 'src/components/base';

const ITEM_WIDTH = appConfig.device.width / 2 - 12;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 9999,
  },
  container: {
    width: appConfig.device.width,
  },
  content: {
    flexGrow: 1,
    paddingTop: 15,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
  },
  itemActionBtn: {
    width: 50,
    height: 50,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  itemInfoContainer: {
    width: '100%',
    padding: 7,
  },
  itemMainInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemLocation: {
    width: '30%',
    height: 8,
    borderRadius: 7,
  },
  itemUnit: {
    width: '10%',
    height: 8,
    borderRadius: 7,
  },
  itemTitle: {
    width: '80%',
    height: 11,
    marginTop: 5,
    borderRadius: 7,
  },
  itemPrice: {
    width: '40%',
    height: 14,
    marginTop: 10,
    borderRadius: 7,
  },
});

const ListStoreProductSkeleton = ({loading}) => {
  const {theme} = useTheme();

  const animatedOpacity = useValue(1);
  const [isShow, setShow] = useState(!loading);

  useEffect(() => {
    Animated.timing(animatedOpacity, {
      toValue: loading ? 1 : 0,
      duration: 200,
      easing: Easing.quad,
    }).start();
  }, [loading]);

  useCode(() => {
    return call([animatedOpacity], ([opacityValue]) => {
      if (opacityValue >= 1) {
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, []);

  const itemActionBtnStyle = useMemo(() => {
    return mergeStyles(styles.itemActionBtn, {
      borderBottomLeftRadius: theme.layout.borderRadiusExtraSmall,
    });
  }, [theme]);

  const renderItemSkeleton = ({item, index}) => {
    return (
      <Container
        style={[
          styles.itemContainer,
          {
            marginRight: index % 2 == 0 ? 8 : 0,
            marginLeft: index % 2 == 0 ? 8 : 0,
          },
        ]}>
        <Skeleton container style={styles.itemImageContainer}>
          <Skeleton content style={itemActionBtnStyle} />
        </Skeleton>
        <Container style={styles.itemInfoContainer}>
          <View style={styles.itemMainInfoContainer}>
            <Skeleton
              container
              style={styles.itemLocation}
            />
            <Skeleton container style={styles.itemUnit} />
          </View>
          <Skeleton container style={styles.itemTitle} />
          <Skeleton content style={styles.itemPrice} />
        </Container>
      </Container>
    );
  };

  return (
    <Animated.View
      pointerEvents={isShow ? 'auto' : 'none'}
      style={[
        styles.wrapper,
        {
          opacity: animatedOpacity,
        },
      ]}>
      <Shimmer>
        <Typography style={styles.container}>
          <FlatList
            style={styles.container}
            contentContainerStyle={[styles.content]}
            data={[1, 2, 3, 4, 5, 6]}
            numColumns={2}
            renderItem={renderItemSkeleton}
            keyExtractor={(item, index) => index.toString()}
          />
        </Typography>
      </Shimmer>
    </Animated.View>
  );
};

export default memo(ListStoreProductSkeleton);
