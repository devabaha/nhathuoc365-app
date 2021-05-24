import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Container from 'src/components/Layout/Container';
import Pressable from 'src/components/Pressable';
import Avatar from '../Avatar';
import IonicIcons from 'react-native-vector-icons/Ionicons';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
    paddingVertical: 10,
    marginLeft: 10,
  },
  placeholder: {
    color: '#666',
    paddingVertical: 5,
  },
  icon: {
    fontSize: 24,
    color: appConfig.colors.status.success,
  },

  title: {
    fontWeight: '600',
    color: '#333',
    fontSize: 16
  },
});

const PleasePost = ({
  avatar,
  title,
  placeholder,
  onPressAvatar = () => {},
  onPressContent = () => {},
  onPressImages = () => {},
}) => {
  const {t} = useTranslation('social');
  placeholder === undefined && (placeholder = t('pleasePost'));
  return (
    <Container row padding={15} style={styles.container}>
      <Avatar url={avatar} onPress={onPressAvatar} />
      <Pressable style={styles.textContainer} onPress={onPressContent}>
        {!!title && <Text numberOfLines={2} style={styles.title}>{title}</Text>}
        {!!placeholder && <Text style={styles.placeholder}>{placeholder}</Text>}
      </Pressable>

      <TouchableOpacity hitSlop={HIT_SLOP} onPress={onPressImages}>
        <IonicIcons name="images" style={styles.icon} />
      </TouchableOpacity>
    </Container>
  );
};

export default React.memo(PleasePost);
