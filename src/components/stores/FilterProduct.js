import React, {memo, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/Feather';
import appConfig from 'app-config';
import {includes, isEmpty, isEqual, omitBy} from 'lodash';
import store from 'app-store';

function FilterProduct({
  titleLeft = 'Sắp xếp',
  titleRight = 'Lọc',
  data = [],
  data2 = [],
}) {
  const [options, setOptions] = useState([]);
  const [dataFilterTag, setDataFilterTag] = useState([]);
  const [defaultSelected, setDefaultSelected] = useState({});
  const [selectedFilter, setSelectedFiler] = useState({});
  useEffect(() => {
    setOptions(data2);
  }, [data2]);

  useEffect(() => {
    if (!isEmpty(data)) {
      setDataFilterTag(data);
    }
  }, [data]);

  useEffect(() => {
    const selected = data2.filter((i) => i.isSelected)[0];
    setDefaultSelected(selected);
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
          onPress={() => {
            console.log({dataFilterTag, options, data});
          }}>
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
              <Text style={{color: '#fff', fontSize: 12, paddingHorizontal: 4}}>
                {!!tag.tag
                  ? tag.tag
                  : `${vndCurrencyFormat(tag.min_price)} - ${vndCurrencyFormat(
                      tag.max_price,
                    )}`}
              </Text>
              <TouchableOpacity onPress={handleRemoveTag(tag)}>
                <Icon name="x-circle" size={18} color="#fff" />
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
    borderRadius: 15,
    backgroundColor: appConfig.primaryColor,
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
});

export default FilterProduct;
