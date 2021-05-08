import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-native-button';
import {View, Text, StyleSheet, FlatList} from 'react-native';

class HomeCardList extends Component {
  render() {
    const props = this.props;
    const {t} = props;
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>{props.title}</Text>

          {props.onShowAll ? (
            <Button
              containerStyle={styles.showAllBtn}
              underlayColor="transparent"
              onPress={props.onShowAll}>
              <Text style={styles.viewAll}>{t('viewAll')}</Text>
            </Button>
          ) : (
            <View style={[styles.showAllBtn, styles.showAllBtnEmpty]} />
          )}
        </View>

        <FlatList
          horizontal
          data={props.data}
          style={styles.listContainer}
          showsHorizontalScrollIndicator={false}
          renderItem={props.children}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  content: {
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showAllBtn: {
    paddingHorizontal: 5,
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#333',
    fontSize: 20,
    lineHeight: 20,
  },
  viewAll: {
    color: '#0084ff',
    fontSize: 15,
  },
  listContainer: {
    marginLeft: 10,
  },
});

const defaultListener = () => null;

HomeCardList.propTypes = {
  data: PropTypes.array,
  onShowAll: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  children: PropTypes.func.isRequired,
};

HomeCardList.defaultProps = {
  data: [],
  onShowAll: defaultListener,
  children: defaultListener,
};

export default withTranslation('home')(HomeCardList);
