import React, {memo, useEffect, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {omit} from 'lodash';
import BlockFilterOption from './BlockFilterOption';

function ListTag({
  data = [],
  onChangeValue = () => {},
  defaultValue = {},
  isOpen,
}) {
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    onChangeValue(selected);
  }, [selected]);

  useEffect(() => {
    const defaultValueTag = omit(defaultValue, 'price');
    setSelected(defaultValueTag);
  }, [defaultValue, isOpen]);

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

  const renderItem = ({item, index}) => {
    return (
      <BlockFilterOption
        key={index}
        title={item.tag}
        tags={item.tags_contents}
        selectedItems={selected}
        onPressTag={handleItem}
      />
    );
  };

  const renderTags = () => {
    return data.map((tag, index) => {
      return renderItem({item: tag, index});
    });
  };

  return <View style={styles.container}>{renderTags()}</View>;
}

const styles = StyleSheet.create({
  tag: {
    fontSize: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e5e5',
  },

  block: {
    marginBottom: 15,
  },

  btnTagContainer: {
    flex: 0.5,
    marginBottom: 5,
  },
});

export default memo(ListTag);
