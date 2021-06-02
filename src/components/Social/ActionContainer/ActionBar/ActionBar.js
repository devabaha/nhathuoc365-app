import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import Container from 'src/components/Layout/Container';
import {SOCIAL_BUTTON_TYPES} from 'src/constants/social';
import Button from './Button';
import Reaction from './Reaction';

const styles = StyleSheet.create({
  container: {
    // height: 100
  },
});

const ActionBar = ({isLiked, disableComment, disableShare, onActionBarPress = () => {}}) => {
  // console.log('render action bar')
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
          title={t('comment')}
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
