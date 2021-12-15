import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {ImageButton} from 'src/components/base/Button';

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 50,
    borderRadius: 30,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

const Avatar = ({url, containerStyle, imageStyle, imageProps, onPress}) => {
  const {theme} = useTheme();

  const containerBaseStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderWidth: theme.layout.borderWidthPixel,
      borderColor: theme.color.border,
    });
  }, [theme]);

  return (
    <ImageButton
      disabled={!onPress}
      source={{uri: url}}
      onPress={onPress}
      style={[containerBaseStyle, containerStyle]}
      imageStyle={[styles.image, imageStyle]}
      imageProps={imageProps}
    />
  );
};

export default React.memo(Avatar);
