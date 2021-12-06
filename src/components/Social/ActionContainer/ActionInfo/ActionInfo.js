import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// helper
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constant
import {TypographyType} from 'src/components/base';
// custom components
import {Container, Typography} from 'src/components/base';
import Pressable from 'src/components/Pressable';
import FloatingIcons from 'src/components/Social/FloatingIcons';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  extraBottom: {
    paddingVertical: 5,
  },
  block: {
    paddingVertical: 5,
    height: 30,
  },
  end: {
    // marginLeft: 'auto'
  },
  floatingIcons: {
    marginRight: 5,
  },
  totalReaction: {},
  text: {},
});

const FLOATING_ICONS = [
  {
    name: 'like1',
  },
];

const ActionInfo = ({
  totalReaction,
  totalComments,
  totalCommentsTitle,
  isLiked,
  disableComment,
  hasInfoExtraBottom = true,
  onPressTotalComments = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('social');

  const hasContent =
    !!isLiked || !!totalReaction || (!disableComment && !!totalComments);

  const extraBottomStyle = useMemo(() => {
    return mergeStyles(styles.extraBottom, {
      borderBottomWidth: theme.layout.borderWidthPixel,
      borderColor: theme.color.border,
    });
  }, [theme]);

  return (
    <Container
      row
      style={[
        styles.container,
        (hasInfoExtraBottom || hasContent) && extraBottomStyle,
      ]}>
      {!!isLiked || !!totalReaction ? (
        <Container row style={styles.block}>
          <FloatingIcons
            icons={FLOATING_ICONS}
            wrapperStyle={styles.floatingIcons}
          />
          <Typography
            type={TypographyType.DESCRIPTION_SEMI_MEDIUM}
            style={styles.text}>
            {!!isLiked && t('self')}
            {!!totalReaction && !!isLiked && ' ' + t('and') + ' '}
            {!!totalReaction &&
              totalReaction + (!!isLiked ? ' ' + t('others') : '')}
          </Typography>
        </Container>
      ) : (
        <Container />
      )}

      {!disableComment && !!totalComments && (
        <Pressable style={styles.end} onPress={onPressTotalComments}>
          <Container row style={styles.block}>
            <Typography
              type={TypographyType.DESCRIPTION_SEMI_MEDIUM}
              style={styles.text}>
              {totalComments} {totalCommentsTitle || t('comments')}
            </Typography>
          </Container>
        </Pressable>
      )}
    </Container>
  );
};

export default React.memo(ActionInfo);
