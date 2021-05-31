import React, {memo, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Feather';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';

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
          <Icon name="check" color={appConfig.colors.primary} size={20} />
        )}
      </TouchableOpacity>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        contentContainerStyle={styles.contentContainer}
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
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
      </View>
      {renderList()}
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    height: 'auto',
    backgroundColor: '#fff',
    paddingBottom: appConfig.device.bottomSpace
      ? appConfig.device.bottomSpace
      : 0,
  },
  contentContainer: {
    paddingVertical: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  titleContainer: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
    backgroundColor: appConfig.colors.primary
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default memo(ModalFilter);
