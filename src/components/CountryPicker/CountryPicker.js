import React, { Component } from 'react';
import {
  SafeAreaView,
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Actions } from 'react-native-router-flux';
import countries from 'world-countries';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  header: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 2,
    color: '#fff'
  },
  closeIcon: {
    fontSize: 26,
    color: '#fff'
  },
  listContainer: {
    backgroundColor: '#ffffff'
  },
  itemContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemFlag: {
    fontSize: 25,
    marginHorizontal: 10
  },
  itemTitle: {
    fontSize: 16,
    margin: 10
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#eee'
  }
});

class CountryPicker extends Component {
  static defaultProps = {
    countries,
    onClose: () => {},
    onPressCountry: () => {}
  };
  state = {
    countries: this.props.countries
  };

  onClose() {
    Actions.pop();
    this.props.onClose();
  }

  onPressCountry(item) {
    Actions.pop();
    this.props.onPressCountry(item);
  }

  renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => this.onPressCountry(item)}>
        <View style={styles.itemContainer}>
          {!!item.flag && <Text style={styles.itemFlag}>{item.flag}</Text>}
          <Text style={styles.itemTitle}>{item.name.common || ''}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { t, countries } = this.props;
    return (
      <Modal animationType="slide" visible style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={this.onClose.bind(this)}>
              <Icon name="close" style={styles.closeIcon} />
            </TouchableOpacity>
            <Text style={[styles.title]}>{t('countrySelectionTitle')}</Text>
          </View>
          <FlatList
            style={styles.listContainer}
            data={countries}
            renderItem={this.renderItem.bind(this)}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </SafeAreaView>
      </Modal>
    );
  }
}

export default withTranslation('phoneAuth')(CountryPicker);
