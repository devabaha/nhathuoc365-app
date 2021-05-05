import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import ListProductSkeleton from './ListProductSkeleton';
import store from 'app-store';
import {HOME_CARD_TYPE} from '../../constants';
import appConfig from 'app-config';
import ProductItem from './ProductItem';
import Button from 'react-native-button';

class ListProducts extends Component {
  static propTypes = {
    data: PropTypes.array,
    title: PropTypes.string,
    type: PropTypes.oneOf(Object.values(HOME_CARD_TYPE)),
  };

  static defaultProps = {
    data: [],
    title: '',
    type: HOME_CARD_TYPE.HORIZONTAL,
    itemsPerRow: 3,
    onShowAll: null,
  };

  get hasProducts() {
    return Array.isArray(this.props.data) && this.props.data.length !== 0;
  }

  renderListVertical() {
    const extraProps = {
      wrapperStyle: styles.itemVerticalContainer,
      imageStyle: styles.itemVerticalImage,
    };
    return (
      <View style={styles.listVertical}>
        {this.props.data.map((product, index) => {
          const extraStyle = {
            borderRightWidth: index % 2 === 0 ? 0.5 : 0,
          };

          return (
            <View style={[styles.itemVerticalWrapper, extraStyle]} key={index}>
              {this.renderProduct(product, extraProps)}
            </View>
          );
        })}
      </View>
    );
  }

  renderListHorizontal() {
    return (
      <FlatList
        horizontal
        data={this.props.data}
        style={styles.listHorizontal}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={this.renderItemHorizontal}
      />
    );
  }

  renderItemHorizontal = ({item: product, index}) => {
    const extraProps = {
      last: this.props.data.length - 1 === index,
    };
    return this.renderProduct(product, extraProps);
  };

  renderProduct(product, extraProps) {
    return (
      <View style={{paddingHorizontal: 5, paddingVertical: 10}}>
        <ProductItem
          selfRequest={(callBack) =>
            this.props.onPressProduct(product, callBack)
          }
          name={product.name}
          image={product.image}
          discount_view={product.discount_view}
          discount_percent={product.discount_percent}
          price_view={product.price_view}
          onPress={() => this.props.onPressProduct(product)}
          {...extraProps}
        />
      </View>
    );
  }

  renderFlatList() {
    switch (this.props.type) {
      case HOME_CARD_TYPE.VERTICAL:
        return this.renderListVertical();
      default:
        return this.renderListHorizontal();
    }
  }

  render() {
    return this.hasProducts ? (
      <View style={styles.container}>
        <View style={styles.headingWrapper}>
          <Text style={styles.heading}>{this.props.title}</Text>
          {!!this.props.onShowAll && (
            <Button underlayColor="transparent" onPress={this.props.onShowAll}>
              <Text style={styles.viewAll}>{this.props.t('viewAll')}</Text>
            </Button>
          )}
        </View>
        {this.renderFlatList()}
      </View>
    ) : !store.isHomeLoaded ? (
      <ListProductSkeleton />
    ) : null;
  }
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
  },
  headingWrapper: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingBottom: 5,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },
  heading: {
    color: '#333',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 20,
    flex: 1,
    marginRight: 20,
  },
  listHorizontal: {
    marginHorizontal: 10,
  },
  contentHorizontal: {},
  listVertical: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 0.5,
    borderColor: '#eee',
  },
  itemVerticalWrapper: {
    width: appConfig.device.width / 2,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  itemVerticalContainer: {
    width: undefined,
    marginLeft: 0,
    marginRight: 0,
    paddingVertical: 15,
    paddingHorizontal: 12,
    flex: 1,
  },
  itemVerticalImage: {
    height: (appConfig.device.width / 2) * 0.75,
  },
  viewAll: {
    color: '#0084ff',
    fontSize: 15,
    fontWeight: '500',
  },
});

export default withTranslation('home')(observer(ListProducts));
