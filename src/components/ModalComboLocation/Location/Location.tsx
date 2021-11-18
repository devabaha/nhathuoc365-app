import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import Container from '../../../components/Layout/Container';
import AntDesign from 'react-native-vector-icons/AntDesign';
import appConfig from 'app-config';
import {LocationProps} from './index';
import {LOCATION_HEIGHT} from '../constants';

const styles = StyleSheet.create({
  container: {
    height: LOCATION_HEIGHT,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  title: {
    flex: 1,
    paddingRight: 15,
  },
  icon: {
    fontSize: 20,
    color: appConfig.colors.primary,
  },
  containerSelected: {
    //@ts-ignore
    backgroundColor: hexToRgba(appConfig.colors.primary, 0.1),
  },
});

const Location = ({
  title,
  selected,

  onPress,
}: LocationProps) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor="rgba(0,0,0,.05)">
      <Container
        paddingHorizontal={15}
        row
        style={[styles.container, selected && styles.containerSelected]}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        {selected && <AntDesign name="check" style={styles.icon} />}
      </Container>
    </TouchableHighlight>
  );
};

const areEquals = (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.selected === nextProps.selected
  );
};

export default React.memo(Location, areEquals);
