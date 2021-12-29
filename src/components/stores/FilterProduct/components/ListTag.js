import React, {memo, useEffect, useState} from 'react';
import {View} from 'react-native';
// 3-party libs
import {omit} from 'lodash';
// custom components
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

  return <View>{renderTags()}</View>;
}

export default memo(ListTag);
