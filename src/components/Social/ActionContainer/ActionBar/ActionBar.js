import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
// constants
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
// custom components
import Button from './Button';
import Reaction from './Reaction';
import {Container} from 'src/components/base';

const styles = StyleSheet.create({
  container: {},
});

const ActionBar = ({
  isLiked,
  commentTitle,
  disableComment,
  disableShare,
  onActionBarPress = () => {},
}) => {
  const {t} = useTranslation('social');

  const onActionPress = useCallback((type) => {
    onActionBarPress(type);
  }, []);

  return (
    <Container row style={styles.container}>
      <Reaction
        title={t('like')}
        iconName="like2"
        isLiked={isLiked}
        onPress={() => onActionPress(SOCIAL_BUTTON_TYPES.LIKE)}
      />
      {!disableComment && (
        <Button
          title={commentTitle || t('comment')}
          iconName="message1"
          onPress={() => onActionPress(SOCIAL_BUTTON_TYPES.COMMENT)}
        />
      )}
      {!disableShare && (
        <Button
          title={t('share')}
          iconName="sharealt"
          onPress={() => onActionPress(SOCIAL_BUTTON_TYPES.SHARE)}
        />
      )}
    </Container>
  );
};

export default React.memo(ActionBar);
