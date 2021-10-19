import React, {Component} from 'react';
import {Image} from 'react-native';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
  FlatList,
} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Shimmer from 'react-native-shimmer';

import {SubCategoryProps} from '.';
import Category from '../Category';
import Row from './Row';
//@ts-ignore
import appConfig from 'app-config';
import {CATEGORY_TYPE} from '../constants';
import Container from '../../../Layout/Container';
//@ts-ignore
import SVGEmptyBoxOpen from '../../../../images/empty-box-open.svg';
import NoResult from '../../../NoResult';

const MIN_ITEM_WIDTH = 120;
const ITEMS_PER_ROW = 2;
const CATEGORY_DIMENSIONS = ((appConfig.device.width - 1) * 3) / 4 / ITEMS_PER_ROW;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    borderBottomColor: appConfig.colors.primary,
  },
  bannerContainer: {
    marginTop: 10,
    width: '100%',
    height: 0,
  },
  banner: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    marginTop: 15,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  body: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  categoryWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: `${100 / ITEMS_PER_ROW}%`,
    paddingVertical: 10,
  },
  categoryContainer: {
    borderRadius: 8,
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  categoryContentContainer: {
    borderBottomWidth: 0,
    padding: 10,
    overflow: 'hidden',
  },
  rowHeaderContainer: {
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
  },
  subCategoriesContainer: {
    flexGrow: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
  },
  contentContainerStyle: {},
  icon: {
    fontSize: 16,
    color: '#777',
  },

  noResultContainer: {
    height: '100%',
  },
  noResult: {
    flexGrow: 1,
  },
  noResultTxt: {
    fontSize: 18,
  },
});

class SubCategory extends Component<SubCategoryProps> {
  static defaultProps = {
    categories: [],
    image: '',
    title: '',
    loading: false,
    onPressTitle: () => {},
    fullScroll: false,
  };

  state = {
    categorySize: {
      width: CATEGORY_DIMENSIONS,
      height: CATEGORY_DIMENSIONS,
    },
    bannerLayout: {
      width: 0,
      height: 0,
    },
    subCategoriesWidth: 0,
    itemsPerRow: ITEMS_PER_ROW,
  };

  shouldComponentUpdate(nextProps: SubCategoryProps, nextState: any) {
    if (nextState !== this.state) {
      return true;
    }

    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  handleBannerLayout(e) {
    const {width: bannerWidth} = e.nativeEvent.layout;
    this.setState({
      bannerLayout: {
        width: bannerWidth,
        height: bannerWidth / 2,
      },
    });
  }

  handleCategoriesLayout(e) {
    const {width: bodyWidth} = e.nativeEvent.layout;
    const itemsPerRow = Math.floor(bodyWidth / MIN_ITEM_WIDTH);
    const categorySize = {
      width: bodyWidth / ITEMS_PER_ROW,
      height: bodyWidth / ITEMS_PER_ROW,
    };
    this.setState({
      categorySize,
      itemsPerRow,
      subCategoriesWidth: bodyWidth,
    });
  }

  get sectionListData() {
    return (
      this.props.categories?.map((category) => {
        let listCategoryItem = [],
          tempData = [];
        category.list?.map((categoryItem, index) => {
          tempData.push(categoryItem);
          if (
            (index + 1) % ITEMS_PER_ROW === 0 ||
            index === category.list.length - 1
          ) {
            listCategoryItem.push(tempData);
            tempData = [];
          }
        });

        return {
          ...category,
          title: category.name,
          image: category.image,
          data: listCategoryItem,
        };
      }) || []
    );
  }

  renderSectionHeader = () => {
    const bannerLayout = this.state.bannerLayout.width && {
      width: this.state.bannerLayout.width,
      height: this.state.bannerLayout.height,
    };

    return (
      <View style={styles.header}>
        {!!this.props.image && (
          <TouchableOpacity onPress={() => this.props.onPressBanner()}>
            <View
              onLayout={this.handleBannerLayout.bind(this)}
              style={[styles.bannerContainer, bannerLayout]}>
              <Image style={styles.banner} source={{uri: this.props.image}} />
            </View>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={() => this.props.onPressTitle(null)}>
          <Container row center style={styles.titleContainer}>
            <Text style={styles.title}>{this.props.title}</Text>
            <Shimmer opacity={1} animationOpacity={0.3} pauseDuration={3000}>
              <FontAwesomeIcon name="angle-double-right" style={styles.icon} />
            </Shimmer>
          </Container>
        </TouchableOpacity>
      </View>
    );
  };

  renderSectionFooter = ({section}) => {
    return !section.data.length ? (
      <View style={styles.noResultContainer}>
        <NoResult
          containerStyle={styles.noResult}
          textStyle={styles.noResultTxt}
          icon={<SVGEmptyBoxOpen fill="#aaa" width="80" height="80" />}
          message="Chưa có danh mục"
        />
      </View>
    ) : null;
  };

  renderCategoryBlock = ({item: category, index, section}) => {
    switch (this.props.type) {
      case CATEGORY_TYPE.FIX_2_LEVEL:
        return this.renderItemMenuFix2Level(
          category,
          index,
          section.data.length,
        );
      default:
        return this.renderMenuFix3Level(category, index);
    }
  };

  renderItemMenuFix2Level = (childCate, index, totalItem) => {
    let extraWrapperStyle = this.state.categorySize?.width
      ? {
          width: this.state.categorySize.width,
          height: this.state.categorySize.height,
        }
      : {};
    if (index === 0) {
      // @ts-ignore
      extraWrapperStyle.paddingTop = 20;
    }

    if (index === totalItem - 1) {
      // @ts-ignore
      extraWrapperStyle.paddingBottom = 20;
    }

    if (childCate.length !== ITEMS_PER_ROW) {
      childCate = childCate.concat(
        Array.from({length: Math.abs(childCate.length - ITEMS_PER_ROW)}),
      );
    }

    return (
      <Container row>
        {childCate?.map((category, index) => {
          let extraContainerStyle = this.state.categorySize?.width
            ? {
                width: this.state.categorySize.width * 0.8,
                height: this.state.categorySize.height * 0.8,
              }
            : {};
          if (!!category && !category?.image) {
            extraContainerStyle = {
              ...extraContainerStyle,
              //@ts-ignore
              backgroundColor: '#f5f5f5',
            };
          }
          return this.renderCategory(
            category,
            index,
            extraWrapperStyle,
            styles.categoryContainer,
            extraContainerStyle,
          );
        })}
      </Container>
    );
  };

  renderMenuFix3Level = (category, index) => {
    const contentHeight =
      Array.isArray(category.list) && this.state.categorySize
        ? Math.ceil(category.list.length / this.state.itemsPerRow) *
          this.state.categorySize.height
        : 0;

    return (
      <Row
        key={index}
        title={category.name}
        headerContainerStyle={styles.rowHeaderContainer}
        totalHeight={contentHeight}
        defaultOpenChild={this.props.fullData}
        fullMode={this.props.fullData}
        onPressTitle={() => this.props.onPressTitle(category)}
        image={category.image}>
        {this.renderSubCategories(category, index)}
      </Row>
    );
  };

  renderSubCategories(category, index) {
    const containerStyle = this.state.categorySize
      ? {
          width: this.state.categorySize.width,
          height: this.state.categorySize.height,
        }
      : {};

    return Array.isArray(category.list) ? (
      <View
        key={index}
        style={[
          styles.subCategoriesContainer,
          {minWidth: this.state.subCategoriesWidth},
        ]}>
        {category.list.map((childCate, index) => {
          let extraStyle = {
            width: this.state.categorySize.width * 0.8,
            height: this.state.categorySize.height * 0.8,
          };

          if (!childCate.image) {
            extraStyle = {
              ...extraStyle,
              //@ts-ignore
              backgroundColor: '#eee',
              //@ts-ignore
              padding: 7,
            };
          }
          return this.renderCategory(
            childCate,
            index,
            containerStyle,
            undefined,
            extraStyle,
          );
        })}
      </View>
    ) : null;
  }

  renderCategory = (
    category,
    index,
    containerStyle = {},
    categoryWrapperStyle = {},
    categoryContainerStyle = {},
  ) => {
    return (
      <View key={index} style={[styles.categoryWrapper, containerStyle]}>
        <Category
          numberOfLines={3}
          disabled={!category}
          title={category?.name}
          image={category?.image}
          wrapperStyle={categoryWrapperStyle}
          containerStyle={[styles.categoryContainer, categoryContainerStyle]}
          onPress={() => this.props.onPressTitle(category)}></Category>
      </View>
    );
  };

  render() {
    return this.props.type === CATEGORY_TYPE.FIX_2_LEVEL ? (
      <SectionList
        // onLayout={this.handleCategoriesLayout.bind(this)}
        contentContainerStyle={styles.container}
        sections={this.sectionListData}
        initialNumToRender={10}
        renderItem={this.renderCategoryBlock.bind(this)}
        keyExtractor={(item, index) => index.toString()}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={this.renderSectionHeader}
        renderSectionFooter={this.renderSectionFooter}
      />
    ) : (
      <FlatList
        // onLayout={this.handleCategoriesLayout.bind(this)}
        contentContainerStyle={styles.container}
        data={this.props.categories}
        initialNumToRender={10}
        renderItem={({item, index}) => {
          return this.renderCategoryBlock({
            item,
            index,
            section: {data: this.props.categories},
          });
        }}
        extraData={this.props.categories}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={this.renderSectionHeader}
        ListEmptyComponent={() =>
          this.renderSectionFooter({
            section: {data: this.sectionListData},
          })
        }
      />
    );
  }
}

export default SubCategory;
