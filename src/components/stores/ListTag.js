import React, {memo, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {isEmpty, omit} from 'lodash';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Button from '../Button';
import appConfig from 'app-config';
import ButtonTag from './ButtonTag';

function ListTag({data = [], onChangeValue = () => {}, defaultValue = {}}) {
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    onChangeValue(selected);
  }, [selected]);

  useEffect(() => {
    const defaultValueTag = omit(defaultValue, 'price');
    setSelected(defaultValueTag);
  }, [defaultValue]);

  const handleItem = (item) => () => {
    setSelected((prev) => {
      if (item.id === prev[item.tag_id]?.id) {
        return omit(prev, item.tag_id);
      }
      return {
        ...prev,
        [item.tag_id]: item,
      };
    });
  };

  const renderTagItem = ({item}) => {
    const itemSelected = !isEmpty(selected)
      ? selected[item.tag_id]?.id === item.id
      : false;
    return (
      <View style={{paddingHorizontal: 5, paddingVertical: 5, flex: 0.5}}>
        <ButtonTag
          text={item.tag}
          onPress={handleItem(item)}
          checked={itemSelected}
        />
      </View>
    );
  };
  const renderItem = ({item}) => {
    return (
      <View style={{marginVertical: 10}}>
        <Text style={styles.tag}>{item.tag}</Text>
        <FlatList
          data={item.tags_contents}
          keyExtractor={(i) => `tag_content_${i?.id}`}
          numColumns={2}
          renderItem={renderTagItem}
        />
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(i, indx) => `${i?.id}_tag_${indx}`}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
  },

  tag: {
    fontSize: 16,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e5e5',
  },
});

export default memo(ListTag);
