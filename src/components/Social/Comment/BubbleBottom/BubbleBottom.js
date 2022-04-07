import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet} from 'react-native';
// configs
import appConfig from 'app-config';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
// custom components
import {TypographyType, BundleIconSetName} from 'src/components/base';
import {Container, Icon, Typography} from 'src/components/base';
import FloatingIcons from '../../FloatingIcons';
import ActionBtn from './ActionBtn';

const styles = StyleSheet.create({
  wrapperContainer: {
    marginTop: 5,
    paddingLeft: 10,
  },
  wrapper: {
    justifyContent: 'space-between',
  },
  container: {},
  time: {
    marginRight: 15,
  },

  pendingContainer: {
    marginTop: appConfig.device.isIOS ? 5 : 3,
    marginBottom: 3,
  },
  pendingIcon: {
    fontSize: 7,
    marginRight: 5,
  },
  pendingMessage: {},
  icon: {
    position: 'absolute',
    right: 0,
  },
});

const BubbleBottom = ({
  isLoading,
  isPending,
  pendingMessage,
  bottomMainTitleStyle,
  message,
  isLiked,
  totalReaction,
  onActionPress = () => {},
}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('social');
  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  const onPressReaction = useCallback(
    (type) => {
      switch (type) {
        case SOCIAL_BUTTON_TYPES.LIKE:
          if (!liked) {
            hapticFeedBack();
          }
          setLiked(!liked);
          break;
      }
      onActionPress(type);
    },
    [liked],
  );

  const renderPendingIcon = useCallback((titleStyle) => {
    return (
      <Icon
        bundle={BundleIconSetName.FONT_AWESOME}
        name="circle"
        style={[titleStyle, styles.pendingIcon]}
      />
    );
  }, []);

  const pendingMessageStyle = useMemo(() => {
    return {color: theme.color.warning};
  }, [theme]);

  return (
    <Container noBackground style={styles.wrapperContainer}>
      {isPending && (
        <Container noBackground row style={styles.pendingContainer}>
          <Typography
            type={TypographyType.LABEL_SMALL}
            style={pendingMessageStyle}
            renderIconBefore={renderPendingIcon}>
            {pendingMessage}
          </Typography>
        </Container>
      )}
      <Container noBackground row style={styles.wrapper}>
        <Container noBackground row style={styles.container}>
          <Typography
            type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
            style={[styles.time, bottomMainTitleStyle]}>
            {message}
          </Typography>

          {!isLoading && (
            <>
              <ActionBtn
                title={t('like')}
                highlight={liked}
                onPress={() => onPressReaction(SOCIAL_BUTTON_TYPES.LIKE)}
              />
              <ActionBtn
                title={t('reply')}
                onPress={() => onPressReaction(SOCIAL_BUTTON_TYPES.REPLY)}
              />
            </>
          )}
        </Container>

        {(!!liked || !!totalReaction) && (
          <FloatingIcons
            wrapperStyle={styles.icon}
            icons="like1"
            prefixTitle={totalReaction}
          />
        )}
      </Container>
    </Container>
  );
};

export default React.memo(BubbleBottom);
