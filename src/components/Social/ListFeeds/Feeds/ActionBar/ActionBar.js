import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Container from 'src/components/Layout/Container';
import Button from './Button';
import Reaction from './Reaction';

const styles = StyleSheet.create({
  container: {
    // height: 30
  },
});

const ActionBar = () => {
  // console.log('render action bar')
  const {t} = useTranslation('social');

  const handlePress = useCallback(() => {}, []);

  return (
    <Container row style={styles.container}>
      <Reaction
        title={t('feeds.like')}
        iconName="like2"
        onPress={handlePress}
      />
      <Button title={t('feeds.comment')} iconName="message1" />
      <Button title={t('feeds.share')} iconName="sharealt" />
    </Container>
  );
};

export default React.memo(ActionBar);
