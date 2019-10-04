import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from 'react-native-button';
import { IMAGE_ICON_TYPE } from '../../constants';

function renderService({ item: serviceType, data, onPress }) {
  const item = data.find(service => service.type === serviceType);
  if (!item) return null;

  const handleOnPress = () => {
    onPress(item);
  };

  return (
    <Button onPress={handleOnPress} containerStyle={styles.buttonWrapper}>
      <View style={styles.itemWrapper}>
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: item.bgrColor
            }
          ]}
        >
          {item.iconType === IMAGE_ICON_TYPE ? (
            <Image style={styles.icon} source={item.icon} />
          ) : (
            <MaterialCommunityIcons name={item.icon} color="#fff" size={32} />
          )}
        </View>
        <Text style={styles.title}>{item.title}</Text>
      </View>
    </Button>
  );
}

function ListServices(props) {
  return (
    <View style={styles.container}>
      <FlatList
        data={props.services}
        renderItem={({ item, index }) =>
          renderService({
            item,
            index,
            onPress: props.onItemPress,
            data: props.data
          })
        }
        keyExtractor={item => item}
        numColumns={4}
      />
    </View>
  );
}

ListServices.propTypes = {
  data: PropTypes.array,
  services: PropTypes.array,
  onItemPress: PropTypes.func
};

ListServices.defaultProps = {
  data: [],
  services: [],
  onItemPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff'
  },
  buttonWrapper: {
    flex: 1
  },
  itemWrapper: {
    alignItems: 'center',
    marginBottom: 16
  },
  iconWrapper: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: '#333',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  icon: {
    width: 45,
    height: 45
  },
  title: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '400',
    color: '#333',
    marginTop: 6
  }
});

export default ListServices;
