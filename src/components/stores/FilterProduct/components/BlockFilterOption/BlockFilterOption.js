import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated, Easing} from 'react-native';
// 3-party libs
import {isEmpty} from 'lodash';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import ButtonTag from '../ButtonTag';
import {TextButton, Typography, Icon} from 'src/components/base';

const styles = StyleSheet.create({
  title: {
    marginBottom: 10,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  block: {
    marginBottom: 15,
  },

  tagsContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%',
  },

  btnTagContainer: {
    marginBottom: 10,
  },

  showMoreContainer: {
    alignSelf: 'flex-end',
  },
  showMoreTitle: {},
  showMoreIcon: {
    fontSize: 11,
    marginLeft: 5,
  },
});

const BlockFilterOption = ({
  title,
  tags: tagsProp = [],
  selectedItems,
  renderTag,
  customCheckSelected,
  onPressTag = () => {},
  renderExtraFooter = () => null,
}) => {
  const {t} = useTranslation();

  const isShowFooter = useCallback(() => {
    return tagsProp.length > 4;
  }, [tagsProp.length]);

  const getInitTags = useCallback(() => {
    return tagsProp.slice(0, 4);
  }, [tagsProp]);

  const [containerWidth, setContainerWidth] = useState(0);
  const [tags, setTags] = useState(getInitTags());
  const [animatedVisible] = useState(new Animated.Value(0));
  const prevContainerWidth = useRef(0);

  useEffect(() => {
    if (!prevContainerWidth.current && !!containerWidth) {
      Animated.timing(animatedVisible, {
        toValue: 1,
        duration: 200,
        easing: Easing.quad,
        useNativeDriver: true,
      }).start();
    }
  }, [containerWidth]);

  const canShowMore = useCallback(() => {
    return tags.length < tagsProp.length;
  }, [tagsProp.length, tags.length]);

  const handleContainerLayout = (e) => {
    setContainerWidth(e.nativeEvent.layout.width);
  };

  const handlePressShowMore = () => {
    if (canShowMore()) {
      setTags(tagsProp);
    } else {
      setTags(getInitTags());
    }
  };

  const renderTags = () => {
    if (!containerWidth) return null;

    return tags.map((tag, index) => {
      if (typeof renderTag === 'function') {
        return renderTag(tag, index);
      }

      const isSelected =
        typeof customCheckSelected === 'function'
          ? customCheckSelected(tag, index)
          : !isEmpty(selectedItems)
          ? selectedItems[tag.tag_id]?.id === tag.id
          : false;

      const extraStyle = {
        width: (containerWidth - 10) / 2,
        marginRight: (index + 1) % 2 !== 0 ? 9.8 : 0,
      };

      return (
        <View key={index} style={[styles.btnTagContainer, extraStyle]}>
          <ButtonTag
            text={tag.tag}
            onPress={onPressTag(tag)}
            checked={isSelected}
          />
        </View>
      );
    });
  };

  const renderIconShowMore = (titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        style={[titleStyle, styles.showMoreIcon]}
        name={canShowMore() ? 'down' : 'up'}
      />
    );
  };

  const renderFooter = () => {
    return (
      <TextButton
        style={styles.showMoreContainer}
        typoProps={{type: TypographyType.LABEL_SEMI_MEDIUM_TERTIARY}}
        titleStyle={styles.showMoreTitle}
        renderIconRight={renderIconShowMore}
        hitSlop={HIT_SLOP}
        onPress={handlePressShowMore}>
        {canShowMore()
          ? `${t('showMore')} (${tagsProp.length - tags.length})`
          : t('showLess')}
      </TextButton>
    );
  };

  const animatedVisibleStyle = useRef({
    opacity: animatedVisible,
  });

  return (
    <Animated.View
      onLayout={handleContainerLayout}
      style={[styles.block, animatedVisibleStyle.current]}>
      <Typography
        type={TypographyType.LABEL_MEDIUM_TERTIARY}
        style={styles.title}>
        {title}
      </Typography>
      <View style={styles.tagsContainer}>{renderTags()}</View>
      {isShowFooter() && renderFooter()}
      {renderExtraFooter()}
    </Animated.View>
  );
};

export default React.memo(BlockFilterOption);
