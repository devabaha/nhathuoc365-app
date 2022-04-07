import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType} from 'src/components/base';
// custom components
import {Typography} from 'src/components/base';
import Container from 'src/components/Layout/Container';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  title: {
    fontWeight: 'bold',
  },
});

const Overlay = ({title}) => {
  const {theme} = useTheme();

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      backgroundColor: theme.color.overlay30,
    });
  }, [theme]);

  const titleStyle = useMemo(() => {
    return mergeStyles(styles.title, {color: theme.color.onOverlay});
  }, [theme]);

  return (
    <Container center style={containerStyle}>
      {!!title && (
        <Typography type={TypographyType.LABEL_HUGE} style={titleStyle}>
          +{title}
        </Typography>
      )}
    </Container>
  );
};

export default React.memo(Overlay);
