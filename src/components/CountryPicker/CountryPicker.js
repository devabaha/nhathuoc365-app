import React, {Component} from 'react';
import {
  SafeAreaView,
  Modal,
  View,
  TouchableOpacity,
  // FlatList,
  Text,
  StyleSheet,
} from 'react-native';

// import Icon from 'react-native-vector-icons/MaterialIcons';
import {Actions} from 'react-native-router-flux';
import countries from 'world-countries';

import {getTheme, ThemeContext} from 'src/Themes/Theme.context';
import {Theme} from 'src/Themes/interface';
import {mergeStyles} from 'src/Themes/helper';
import {TypographyType} from 'src/components/base/Typography/constants';
import {BaseButton} from 'src/components/base/Button';
import {BundleIconSetName} from '../base/Icon/constants';

import FlatList from 'src/components/base/FlatList';
import Typography from 'src/components/base/Typography/Typography';
import Container from 'src/components/base/Container';
import ScreenWrapper from '../base/ScreenWrapper';
import Icon from 'src/components/base/Icon';

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
    // fontSize: 16,
    letterSpacing: 2,
    // color: '#fff',
  },
  closeIcon: {
    fontSize: 26,
    // color: '#fff',
  },
  listContainer: {
    // backgroundColor: '#ffffff'
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemFlag: {
    fontSize: 25,
    marginHorizontal: 10,
  },
  itemTitle: {
    // fontSize: 16,
    margin: 10,
  },
  separator: {
    height: 1,
    width: '100%',
    // backgroundColor: '#eee'
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

  get theme(): Theme {
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
          {!!item.flag && <Text style={styles.itemFlag}>{item.flag}</Text>}
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
    const theme = this.theme;
    const {t, countries} = this.props;

    const separatorStyle = mergeStyles(styles.separator, {
      backgroundColor: theme.color.textSecondary,
    });

    return (
      <Modal animationType="slide" visible>
        <ScreenWrapper style={styles.container}>
          <Container style={styles.header}>
            <BaseButton onPress={this.onClose.bind(this)}>
              <Icon
                bundle={BundleIconSetName.MATERIAL_ICONS}
                name="close"
                style={styles.closeIcon}
              />
            </BaseButton>
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
