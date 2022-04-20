import React, {memo, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {IMAGE_SIZE} from '../constants';
// custom components
import {ImageButton} from 'src/components/base';

const styles = StyleSheet.create({
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    overflow: 'hidden',
  },
});

const ImageItems = ({style, uri, onPress}) => {
  const {theme} = useTheme();

  const imageContainerStyle = useMemo(() => {
    return {
      borderWidth: theme.layout.borderWidthSmall,
      borderColor: theme.color.border,
      borderRadius: theme.layout.borderRadiusExtraSmall,
    };
  }, [theme]);

  return (
    <View style={[styles.imageContainer, imageContainerStyle, style]}>
      <ImageButton useTouchableHighlight source={{uri}} onPress={onPress} />
    </View>
  );
};

export default memo(ImageItems);
