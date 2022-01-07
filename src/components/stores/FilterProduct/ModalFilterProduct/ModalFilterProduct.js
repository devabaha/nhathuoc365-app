import React, {memo, useRef, useState, useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import Modal from 'react-native-modalbox';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// routing
import {pop} from 'app-helper/routing';
// context
import {useTheme} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {
  Container,
  FlatList,
  TextButton,
  Typography,
  Icon,
} from 'src/components/base';

function ModalFilterProduct({
  data = [],
  defaultSelected = {},
  title = 'Default',
  onSelectValueSort = () => {},
}) {
  const {theme} = useTheme();

  const refModal = useRef(null);

  const [selected, setSelected] = useState(defaultSelected);

  const itemTypoProps = {
    type: TypographyType.LABEL_SEMI_LARGE,
  };

  const handleItem = (item) => () => {
    setSelected({...item, isSelected: true});
    if (refModal.current) {
      refModal.current.close();
      onSelectValueSort({...item, isSelected: true});
    }
  };

  const renderIcon = ({titleStyle}) => {
    return (
      <Icon
        primaryHighlight
        bundle={BundleIconSetName.FEATHER}
        name="check"
        style={styles.icon}
      />
    );
  };

  const renderItem = ({item, index}) => {
    return (
      <TextButton
        style={styles.itemContainer}
        titleStyle={styles.text}
        typoProps={itemTypoProps}
        renderIconRight={item.id === selected.id && renderIcon}
        onPress={handleItem(item)}>
        {item.name}
      </TextButton>
    );
  };

  const renderList = () => {
    return (
      <Container>
        <FlatList
          safeLayout
          contentContainerStyle={styles.contentContainer}
          data={data}
          extraData={selected}
          keyExtractor={(i, index) => `${index}__${i.id}`}
          renderItem={renderItem}
        />
      </Container>
    );
  };

  const titleContainerStyle = useMemo(() => {
    return mergeStyles(styles.titleContainer, {
      backgroundColor: theme.color.primary,
      borderColor: theme.color.border,
      borderBottomWidth: theme.layout.borderWidthSmall,
    });
  }, [theme]);

  return (
    <Modal
      entry="bottom"
      position="bottom"
      style={styles.modal}
      backButtonClose
      ref={refModal}
      isOpen
      onClosed={pop}
      useNativeDriver>
      <Container style={titleContainerStyle}>
        <Typography
          onPrimary
          type={TypographyType.TITLE_SEMI_LARGE}
          style={styles.title}>
          {title}
        </Typography>
      </Container>
      {renderList()}
    </Modal>
  );
}
const styles = StyleSheet.create({
  modal: {
    height: 'auto',
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
  text: {},
  titleContainer: {
    paddingTop: 15,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  title: {
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  icon: {
    fontSize: 20,
  },
});

export default memo(ModalFilterProduct);
