import React, {Component} from 'react';
import {Modal, View, Text, StyleSheet} from 'react-native';
// 3-party libs
import {Actions} from 'react-native-router-flux';
import countries from 'world-countries';
// helpers
import {mergeStyles} from 'src/Themes/helper';
// context
import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {
  BaseButton,
  FlatList,
  Typography,
  Container,
  ScreenWrapper,
  IconButton,
} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  closeIcon: {
    fontSize: 26,
  },
  listContainer: {},
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemFlag: {
    marginHorizontal: 10,
  },
  itemTitle: {
    margin: 10,
  },
  separator: {
    height: 1,
    width: '100%',
  },
});

class CountryPicker extends Component {
  static contextType = ThemeContext;

  static defaultProps = {
    countries,
    onClose: () => {},
    onPressCountry: () => {},
  };

  state = {
    countries: this.props.countries,
  };

  get theme() {
    return getTheme(this);
  }

  onClose() {
    Actions.pop();
    this.props.onClose();
  }

  onPressCountry(item) {
    Actions.pop();
    this.props.onPressCountry(item);
  }

  renderItem({item}) {
    return (
      <BaseButton onPress={() => this.onPressCountry(item)}>
        <View style={styles.itemContainer}>
          {!!item.flag && (
            <Typography
              type={TypographyType.DISPLAY_SMALL}
              style={styles.itemFlag}>
              {item.flag}
            </Typography>
          )}
          <Typography
            type={TypographyType.TITLE_MEDIUM}
            style={styles.itemTitle}>
            {item.name.common || ''}
          </Typography>
        </View>
      </BaseButton>
    );
  }

  render() {
    const {t, countries} = this.props;

    const separatorStyle = mergeStyles(styles.separator, {
      backgroundColor: this.theme.color.surface,
    });

    return (
      <Modal animationType="slide" visible>
        <ScreenWrapper  style={styles.container}>
          <Container safeTopLayout style={styles.header}>
            <IconButton
              onPress={this.onClose.bind(this)}
              bundle={BundleIconSetName.MATERIAL_ICONS}
              name="close"
              iconStyle={styles.closeIcon}
            />
            <Typography
              type={TypographyType.TITLE_MEDIUM}
              style={[styles.title]}>
              {t('countrySelectionTitle')}
            </Typography>
          </Container>
          <FlatList
            safeLayout
            data={countries}
            renderItem={this.renderItem.bind(this)}
            ItemSeparatorComponent={() => <View style={separatorStyle} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </ScreenWrapper>
      </Modal>
    );
  }
}

export default withTranslation('phoneAuth')(CountryPicker);
