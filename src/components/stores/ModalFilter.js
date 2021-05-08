import React, {memo, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Feather';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import {isEmpty} from 'lodash';
import ListTag from './ListTag';

function ModalFilter({
  onSelectValue = () => {},
  data = [],
  defaultSelected = {},
  type,
  title = 'Default',
}) {
  const [selected, setSelected] = useState(defaultSelected);
  const refModal = useRef(null);

  const handleCloseModal = () => {
    if (refModal.current) {
      refModal.current.close();
      onSelectValue(selected);
    }
  };

  const handleItem = (item) => () => {
    setSelected(item);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={handleItem(item)}>
        <Text style={styles.text}>{item.name}</Text>
        {item.id === selected.id && (
          <Icon name="check" color="#EC959F" size={20} />
        )}
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    switch (type) {
      case 'filter-multiple':
        return (
          <View>
            <ListTag data={data} onChangeValue={() => console.log('123')} />
          </View>
        );
      case 'default':
      default:
        return (
          <FlatList
            data={data}
            extraData={selected}
            keyExtractor={(i, index) => `${index}__${i.id}`}
            renderItem={renderItem}
          />
        );
    }
  };

  return (
    <Modal
      entry="bottom"
      position="bottom"
      style={[styles.modal]}
      backButtonClose
      ref={refModal}
      isOpen
      onClosed={() => Actions.pop()}
      useNativeDriver>
      <Text style={styles.title}>{title}</Text>
      {renderList()}
      <TouchableOpacity style={styles.btnContainer} onPress={handleCloseModal}>
        <Text style={styles.txtButton}>Xong</Text>
      </TouchableOpacity>
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    height: 'auto',
    backgroundColor: '#fff',
    paddingBottom: appConfig.device.isIphoneX ? 23 : 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  btnContainer: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: appConfig.primaryColor,
    marginHorizontal: 10,
  },
  txtButton: {
    color: '#fff',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  box: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  btnTag: {
    flex: 0.5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default memo(ModalFilter);
