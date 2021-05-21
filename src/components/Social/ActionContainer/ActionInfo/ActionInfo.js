import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Container from 'src/components/Layout/Container';
import Pressable from 'src/components/Pressable';
import FloatingIcons from 'src/components/Social/FloatingIcons ';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: Util.pixel,
    borderColor: '#ddd',
    paddingVertical: 5,
    justifyContent: 'space-between',
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
  text: {
    fontSize: 13,
    color: '#666',
  },
});

const FLOATING_ICONS = [
  {
    name: 'like1',
  },
];

const ActionInfo = ({
  totalReaction,
  totalComments,
  isLiked,
  disableComment,
  onPressTotalComments = () => {},
}) => {
  const {t} = useTranslation('social');

  return (
    <Container row style={styles.container}>
      {!!isLiked || !!totalReaction ? (
        <Container row style={styles.block}>
          <FloatingIcons
            icons={FLOATING_ICONS}
            wrapperStyle={styles.floatingIcons}
          />
          <Text style={styles.text}>
            {!!isLiked && t('self')}
            {!!totalReaction && !!isLiked && ' ' + t('and') + ' '}
            {!!totalReaction &&
              totalReaction + (!!isLiked ? ' ' + t('others') : '')}
          </Text>
        </Container>
      ) : (
        <Container />
      )}

      {!disableComment && !!totalComments && (
        <Pressable style={styles.end} onPress={onPressTotalComments}>
          <Container row style={styles.block}>
            <Text style={styles.text}>
              {totalComments} {t('comment')}
            </Text>
          </Container>
        </Pressable>
      )}
    </Container>
  );
};

export default React.memo(ActionInfo);
