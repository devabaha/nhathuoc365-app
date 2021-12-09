import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
// 3-party libs
import {useTranslation} from 'react-i18next';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {useTheme} from 'src/Themes/Theme.context';
//constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Container, Icon, Input} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  input: {
    paddingVertical: 0,
    height: 50,
    flex: 1,
  },
  searchContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  search: {
    fontSize: 20,
    marginRight: 15,
  },
});

const Search = ({onChangeText, value}) => {
  const {theme} = useTheme();

  const {t} = useTranslation('common');

  const containerStyle = useMemo(() => {
    return mergeStyles(styles.container, {
      borderBottomWidth: theme.layout.borderWidthLarge,
      borderColor: theme.color.primaryHighlight,
    });
  }, [theme]);

  const iconStyle = useMemo(() => {
    return mergeStyles(styles.search, {
      color: theme.color.iconInactive,
    });
  }, [theme]);

  return (
    <Container row style={containerStyle}>
      <Icon
        bundle={BundleIconSetName.ANT_DESIGN}
        name="search1"
        style={iconStyle}
      />

      <Input
        type={TypographyType.LABEL_MEDIUM}
        style={styles.input}
        onChangeText={onChangeText}
        value={value}
        placeholder={t('enterToSearch')}
      />
    </Container>
  );
};

export default Search;
