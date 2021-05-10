import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';
import {includes, isEmpty, isEqual, omitBy} from 'lodash';
import store from 'app-store';
import {APIRequest} from 'src/network/Entity';
import APIHandler from 'src/network/APIHandler';
const data = [
  {id: 1, name: 'Phổ biến', value: 'pho-bien', isSelected: true},
  {id: 2, name: 'Bán chạy', value: 'ban-chay', isSelected: false},
  {id: 3, name: 'Mới nhất', value: 'moi-nhat', isSelected: false},
];

export default function FilterProduct({
  titleLeft = 'Sắp xếp',
  titleRight = 'Lọc',
}) {
  const [options, setOptions] = useState([]);
  const [dataFilterTag, setDataFilterTag] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState({});
  const [selectedFilter, setSelectedFiler] = useState({});
  const getListFilterTagRequest = new APIRequest();

  const getListFilterTag = async () => {
    try {
      const siteId = store.store_data.id;
      getListFilterTagRequest.data = APIHandler.getListFilterProduct(siteId);
      const response = await getListFilterTagRequest.promise();
      if (response.status === 200) {
        // const newData = response.data.map(i => ({
        //   ...i,
        //   tagsContent:
        // }))
        setDataFilterTag(response.data);
      }
    } catch (err) {
      console.log(err);
      setDataFilterTag([]);
    }
  };

  useEffect(() => {
    setOptions(data);
  }, [data]);

  useEffect(() => {
    getListFilterTag();
    const selected = data.filter((i) => i.isSelected)[0];
    setDefaultSelected(selected);

    return () => {
      getListFilterTagRequest.cancel();
    };
  }, []);

  const handleRemoveTag = (tag) => () => {
    const newFilterSelected = Object.keys(selectedFilter).reduce((obj, key) => {
      return {
        ...obj,
        ...(isEqual(selectedFilter[key], tag)
          ? {}
          : {
              [key]: selectedFilter[key],
            }),
      };
    }, {});
    setSelectedFiler(newFilterSelected);
  };

  const handleOpenModal = (type) => () => {
    Actions.push(appConfig.routes.filterProduct, {
      type,
      defaultSelected: type === 'default' ? defaultSelected : selectedFilter,
      data: type === 'default' ? options : dataFilterTag,
      title: type === 'default' ? titleLeft : titleRight,
      onSelectValue: (selected) => {
        if (type === 'default') {
          setDefaultSelected(selected);
          const newData = options.map((i) => ({
            ...i,
            isSelected: i.id === selected.id,
          }));
          setOptions(newData);
          return;
        }
        setSelectedFiler(selected);
      },
    });
  };

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.btnFilterLeft}
          onPress={handleOpenModal('default')}>
          <Text>{titleLeft}:</Text>
          {!isEmpty(defaultSelected) && (
            <Text style={styles.valueText}>{defaultSelected.name}</Text>
          )}
          <Icon name="chevron-down" size={20} color="#333" />
        </TouchableOpacity>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.btnFilterRight}
          onPress={handleOpenModal('filter-multiple')}>
          <Icon name="filter" color="#333" size={20} />
          <Text style={styles.titleRight}>{titleRight}</Text>
        </TouchableOpacity>
      </View>
      {!isEmpty(selectedFilter) ? (
        <View style={styles.tagWrapper}>
          {Object.values(selectedFilter).map((tag) => (
            <View style={styles.tagSelected}>
              <Text style={{color: '#fff', fontSize: 12}}>{tag.tag}</Text>
              <TouchableOpacity
                style={{padding: 5}}
                onPress={handleRemoveTag(tag)}>
                <Icon name="x" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  btnFilterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  titleLeft: {
    color: '#333',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#333',
    marginRight: 5,
  },
  btnFilterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20%',
  },
  valueText: {
    color: '#222',
    paddingLeft: 5,
    fontWeight: 'bold',
  },
  titleRight: {
    paddingLeft: 5,
  },
  modal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  modalContainer: {
    backgroundColor: '#fff',
    paddingTop: 50,
    height: '100%',
  },
  tagWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: 10,
  },
  tagSelected: {
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: appConfig.primaryColor,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});
