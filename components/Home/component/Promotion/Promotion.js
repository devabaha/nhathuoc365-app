import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableHighlight, StyleSheet, Animated } from 'react-native';
import Swiper from 'react-native-swiper';

const PROMOTION_WIDTH = Util.size.width - 32;

function Promotion(props) {
  const [paginationLeft] = useState(new Animated.Value(0));

  function renderItem(promotion, index) {
    return (
      <View key={index} style={styles.promotionItem}>
        <TouchableHighlight
          onPress={() => props.onPress(promotion.news)}
          underlayColor="transparent"
        >
          <CachedImage
            source={{ uri: promotion.banner }}
            style={styles.bannerImage}
          />
        </TouchableHighlight>
      </View>
    );
  }

  function handleAnimation(index, total) {
    const animationConfig = {
      toValue: (index * PROMOTION_WIDTH) / total,
      duration: 250
    };
    Animated.timing(paginationLeft, animationConfig).start();
  }

  function renderPagination(index, total) {
    handleAnimation(index, total);
    return (
      <View style={styles.paginationWrapper}>
        <Animated.View
          style={[
            styles.pagination,
            {
              left: paginationLeft,
              width: PROMOTION_WIDTH / total
            }
          ]}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        autoplay
        autoplayTimeout={3}
        borderRadius={8}
        width={PROMOTION_WIDTH}
        backgroundColor="#fff"
        showsPagination={true}
        renderPagination={renderPagination}
      >
        {props.data.map((promotion, index) => renderItem(promotion, index))}
      </Swiper>
    </View>
  );
}

Promotion.propTypes = {
  data: PropTypes.array.isRequired
};

Promotion.defaultProps = {
  data: []
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 128,
    marginTop: 68,
    paddingHorizontal: 16
  },
  bannerImage: {
    width: Util.size.width,
    height: Util.size.width * 0.4
  },
  promotionItem: {
    width: Util.size.width,
    alignItems: 'center'
  },
  paginationWrapper: {
    width: PROMOTION_WIDTH,
    height: 16,
    position: 'relative',
    top: -16,
    overflow: 'hidden',
    borderRadius: 8
  },
  pagination: {
    height: 2,
    backgroundColor: '#007aff',
    position: 'absolute',
    bottom: 0
  }
});

export default Promotion;
