import React, {memo, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import CenterIcon from './CenterIcon';

const styles = StyleSheet.create({
  icon: {
    fontSize: 20,
  },
});

const IconSelectedAlbum = () => {
  const {theme} = useTheme();

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: theme.color.accent2,
    });
  }, [theme]);

  return <CenterIcon name="check" style={iconStyle} />;
};

export default memo(IconSelectedAlbum);
