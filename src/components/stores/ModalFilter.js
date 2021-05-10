import React, {memo, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import Icon from 'react-native-vector-icons/Feather';
import {Actions} from 'react-native-router-flux';
import appConfig from 'app-config';
import {isEmpty} from 'lodash';
import ListTag from './ListTag';
import {getValueFromConfigKey} from 'src/helper/configKeyHandler/configKeyHandler';
import {CONFIG_KEY} from 'src/helper/configKeyHandler';
import ButtonTag from './ButtonTag';

function ModalFilter({
  onSelectValue = () => {},
  data = [],
  defaultSelected = {},
  type,
  title = 'Default',
}) {
  const [selected, setSelected] = useState(defaultSelected);
  const refModal = useRef(null);
  const priceValue = getValueFromConfigKey(CONFIG_KEY.FILTER_PRICES_KEY);

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

  const renderPriceItem = ({item}) => {
    return (
      <View style={{flex: 0.5, padding: 5}}>
        <ButtonTag text={`${item.min_price} - ${item.max_price}`} />
      </View>
    );
  };

  const renderList = () => {
    switch (type) {
      case 'filter-multiple':
        return (
          <View>
            <ListTag
              data={data}
              onChangeValue={(selectedValue) => setSelected(selectedValue)}
              defaultValue={defaultSelected}
            />
            {!!priceValue && (
              <View style={{marginVertical: 5, marginHorizontal: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    paddingVertical: 7,
                    paddingHorizontal: 5,
                  }}>
                  Giá tiền
                </Text>
                <FlatList
                  data={Object.values(JSON.parse(priceValue))}
                  numColumns={2}
                  keyExtractor={(_, index) => `min_max_price_${index}`}
                  renderItem={renderPriceItem}
                />
              </View>
            )}
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
