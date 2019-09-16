import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from 'react-native-button';
import { IMAGE_ICON_TYPE } from '../../constants';

function renderService({ item, onPress }) {
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
            <MaterialCommunityIcons name={item.icon} color="#fff" size={28} />
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
        data={props.data}
        renderItem={({ item, index }) =>
          renderService({ item, index, onPress: props.onItemPress })
        }
        keyExtractor={item => `${item.id}`}
        numColumns={4}
      />
    </View>
  );
}

ListServices.propTypes = {
  data: PropTypes.array,
  onItemPress: PropTypes.func
};

ListServices.defaultProps = {
  data: [],
  onItemPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 12
  },
  buttonWrapper: {
    flex: 1
  },
  itemWrapper: {
    alignItems: 'center'
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
