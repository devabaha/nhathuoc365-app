import React from 'react';
import {StyleSheet, Text} from 'react-native';
import Container from 'src/components/Layout/Container';
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
  },
  floatingIcons: {
    marginRight: 5,
  },
  totalReaction: {},
  text: {
    fontSize: 13,
    color: '#666',
    textTransform: 'lowercase',
  },
});

const FLOATING_ICONS = [
  {
    name: 'like1',
  },
];

const ActionInfo = ({totalReaction, totalComments}) => {
  const {t} = useTranslation('social');

  return (
    <Container row style={styles.container}>
      {!!totalReaction && (
        <Container row style={styles.block}>
          <FloatingIcons
            icons={FLOATING_ICONS}
            wrapperStyle={styles.floatingIcons}
          />
          <Text style={styles.text}>{totalReaction}</Text>
        </Container>
      )}

      {!!totalComments && (
        <Container row style={styles.block}>
          <Text style={styles.text}>
            {totalComments} {t('feeds.comment')}
          </Text>
        </Container>
      )}
    </Container>
  );
};

export default React.memo(ActionInfo);
