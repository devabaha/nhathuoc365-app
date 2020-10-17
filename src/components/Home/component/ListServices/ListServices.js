import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Button from 'react-native-button';
import { IMAGE_ICON_TYPE } from '../../constants';

function renderService({ item, data, app, notify, onPress }) {
  const handleOnPress = () => {
    onPress(item);
  };

  const notifyCount = notify[item.type];

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
            <Image style={styles.icon} source={{ uri: item.icon }} />
          ) : (
            <MaterialCommunityIcons name={item.icon} color="#fff" size={32} />
          )}
        </View>
        <Text style={styles.title}>{item.title}</Text>

        {notifyCount > 0 && (
          <View style={styles.notifyWrapper}>
            <Text style={styles.notify}>{notifyCount}</Text>
          </View>
        )}

        {/* {notify.notify_chat > 0 && item.type === "chat" && (
          <View style={styles.notifyWrapper}>
            <Text style={styles.notify}>{notify.notify_chat}</Text>
          </View>
        )}
        {notify.notify_list_chat > 0 && item.type === "list_chat" && (
          <View style={styles.notifyWrapper}>
            <Text style={styles.notify}>{notify.notify_list_chat}</Text>
          </View>
        )} */}
      </View>
    </Button>
  );
}

function ListServices(props) {
  return (
    Array.isArray(props.listService) &&
    props.listService.length !== 0 && (
      <View style={styles.container}>
        <FlatList
          data={props.listService}
          extraData={props.notify}
          renderItem={({ item, index }) =>
            renderService({
              item,
              index,
              onPress: props.onItemPress,
              data: props.data,
              notify: props.notify
            })
          }
          keyExtractor={(item, index) => index.toString()}
          numColumns={4}
        />
      </View>
    )
  );
}

ListServices.propTypes = {
  data: PropTypes.array,
  listService: PropTypes.array,
  notify: PropTypes.object,
  onItemPress: PropTypes.func
};

ListServices.defaultProps = {
  data: [],
  listService: [],
  notify: {},
  onItemPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff'
  },
  buttonWrapper: {
    flex: 1,
    maxWidth: '25%'
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
  },
  notifyWrapper: {
    position: 'absolute',
    minWidth: 16,
    paddingHorizontal: 2,
    height: 16,
    backgroundColor: 'red',
    top: 0,
    right: 14,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 8
  },
  notify: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600'
  }
});

export default ListServices;
