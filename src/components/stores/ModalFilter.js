import React, {memo, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Feather';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import {isEmpty} from 'lodash';

function ModalFilter({
  onSelectValue = () => {},
  data = [],
  defaultSelected = {},
  title = 'Default',
  onSelectValueSort = () => {},
}) {
  const [selected, setSelected] = useState(defaultSelected);
  const [selectedPrice, setSelectedPrice] = useState({});
  const [selectedTag, setSelectedTag] = useState({});
  const refModal = useRef(null);

  const handleSelected = (val) => {
    setSelectedTag(val);
  };

  const handleSelectedPrice = (value) => {
    setSelectedPrice(value);
  };

  const handleItem = (item) => () => {
    setSelected({...item, isSelected: true});
    if (refModal.current) {
      refModal.current.close();
      onSelectValueSort({...item, isSelected: true});
    }
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
    return (
      <FlatList
        data={data}
        extraData={selected}
        keyExtractor={(i, index) => `${index}__${i.id}`}
        renderItem={renderItem}
      />
    );
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
    marginTop: 15,
  },
  txtButton: {
    color: '#fff',
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    color: '#333',
    fontWeight: 'bold',
    paddingVertical: 15,
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
