import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// custom components
import {
  BundleIconSetName,
  Container,
  IconButton,
  Typography,
  TypographyType,
} from 'src/components/base';
import Pressable from 'src/components/Pressable';
import Avatar from '../Avatar';

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  textContainer: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
  },
  placeholder: {
    paddingVertical: 5,
  },
  icon: {
    fontSize: 24,
  },

  title: {
    fontWeight: '600',
  },
});

const PleasePost = ({
  avatar,
  title,
  placeholder,
  containerStyle,
  onPressAvatar,
  onPressContent,
  onPressImages,
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('social');
  placeholder === undefined && (placeholder = t('pleasePost'));

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.icon, {
      color: theme.color.success,
    });
  }, [theme]);

  return (
    <Container row style={[styles.container, containerStyle]}>
      <Avatar url={avatar} onPress={onPressAvatar} />
      <Pressable style={styles.textContainer} onPress={onPressContent}>
        {!!title && (
          <Typography
            type={TypographyType.LABEL_LARGE}
            numberOfLines={2}
            style={styles.title}>
            {title}
          </Typography>
        )}
        {!!placeholder && (
          <Typography
            type={TypographyType.DESCRIPTION_MEDIUM}
            style={styles.placeholder}>
            {placeholder}
          </Typography>
        )}
      </Pressable>

      <IconButton
        disabled={!onPressImages}
        hitSlop={HIT_SLOP}
        onPress={onPressImages}
        bundle={BundleIconSetName.IONICONS}
        name="images"
        iconStyle={iconStyle}
      />
    </Container>
  );
};

export default React.memo(PleasePost);
