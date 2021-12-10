import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// 3-party libs
import Shimmer from 'react-native-shimmer';
import {withTranslation} from 'react-i18next';
// types
import {SubCategoryProps} from '.';
// configs
import appConfig from 'app-config';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
import {mergeStyles} from 'src/Themes/helper';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {CATEGORY_TYPE} from '../constants';
import {
  BundleIconSetName,
  ImageButton,
  TextButton,
  TypographyType,
} from 'src/components/base';
// images
//@ts-ignore
import SVGEmptyBoxOpen from 'src/images/empty-box-open.svg';
// custom components
import Category from '../Category';
import Row from './Row';
import NoResult from 'src/components/NoResult';
import {Container, Icon, FlatList, SectionList} from 'src/components/base';

const MIN_ITEM_WIDTH = 120;
const ITEMS_PER_ROW = 2;
const CATEGORY_DIMENSIONS =
  ((appConfig.device.width - 1) * 3) / 4 / ITEMS_PER_ROW;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 10,
  },
  headerIcon: {
    fontSize: 16,
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
    paddingTop: 15,
    paddingBottom: 13,
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  categoryWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    width: `${100 / ITEMS_PER_ROW}%`,
    paddingVertical: 10,
  },
  categoryContainer: {
    borderBottomWidth: 0,
    overflow: 'hidden',
  },
  categoryContentContainer: {
    borderBottomWidth: 0,
    padding: 10,
    overflow: 'hidden',
  },
  subCategoriesContainer: {
    flexGrow: 1,
    flexWrap: 'wrap',
    borderBottomColor: '#eee',
    borderBottomWidth: 0.5,
  },
  contentContainerStyle: {},
  noResultContainer: {
    flex: 1,
  },
  noResultSectionListContainer: {
    height: '80%',
    flex: undefined,
  },
  noResultSectionListWithoutBannerContainer: {
    height: '100%',
    flex: undefined,
  },
  noResult: {
    flexGrow: 1,
  },
  noResultTxt: {
    fontSize: 18,
  },
});

class SubCategory extends Component<SubCategoryProps> {
  static contextType = ThemeContext;

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

  get theme() {
    return getTheme(this);
  }

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

  renderRightIconSectionHeader = () => {
    return (
      <Shimmer opacity={1} animationOpacity={0.3} pauseDuration={3000}>
        <Icon
          bundle={BundleIconSetName.FONT_AWESOME}
          name="angle-double-right"
          style={this.headerIconStyle}
        />
      </Shimmer>
    );
  };

  renderSectionHeader = () => {
    const bannerLayout = this.state.bannerLayout.width && {
      width: this.state.bannerLayout.width,
      height: this.state.bannerLayout.height,
    };

    return (
      <Container style={this.sectionHeaderStyle}>
        {!!this.props.image && (
          <View
            onLayout={this.handleBannerLayout.bind(this)}
            style={[styles.bannerContainer, bannerLayout]}>
            <ImageButton
              source={{uri: this.props.image}}
              style={{flex: 1}}
              imageStyle={styles.banner}
              onPress={() => this.props.onPressBanner()}
            />
          </View>
        )}
        <TextButton
          typoProps={{type: TypographyType.TITLE_MEDIUM}}
          style={styles.titleContainer}
          titleStyle={styles.title}
          onPress={() => this.props.onPressTitle(null)}
          renderIconRight={this.renderRightIconSectionHeader}>
          {this.props.title}
        </TextButton>
      </Container>
    );
  };

  renderSectionFooter = ({section}) => {
    if (!!section.data?.length) {
      return null;
    }

    const extraStyle = [
      this.props.type === CATEGORY_TYPE.FIX_2_LEVEL &&
        styles.noResultSectionListContainer,
      !this.props.image && styles.noResultSectionListWithoutBannerContainer,
    ];

    return (
      <View style={[styles.noResultContainer, ...extraStyle]}>
        <NoResult
          containerStyle={styles.noResult}
          icon={
            <SVGEmptyBoxOpen fill={this.emptyBoxColor} width="80" height="80" />
          }
          message={this.props.t('noCategory')}
        />
      </View>
    );
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
              ...this.subCategoriesExtraStyle,
            };
          }
          return this.renderCategory(
            category,
            index,
            extraWrapperStyle,
            this.categoryContainerStyle,
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
        headerContainerStyle={this.menuFix3LevelRowHeaderContainerStyle}
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
      <Container
        row
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
              ...this.subCategoriesExtraStyle,
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
      </Container>
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
      <Container key={index} style={[styles.categoryWrapper, containerStyle]}>
        <Category
          numberOfLines={3}
          disabled={!category}
          title={category?.name}
          image={category?.image}
          wrapperStyle={categoryWrapperStyle}
          containerStyle={[this.categoryContainerStyle, categoryContainerStyle]}
          onPress={() => this.props.onPressTitle(category)}></Category>
      </Container>
    );
  };

  get categoryContainerStyle() {
    return mergeStyles(styles.categoryContainer, {
      borderRadius: this.theme.layout.borderRadiusMedium,
    });
  }

  get subCategoriesExtraStyle() {
    return {
      backgroundColor: this.theme.color.contentBackgroundWeak,
    };
  }

  get menuFix3LevelRowHeaderContainerStyle() {
    return {
      borderBottomColor: this.theme.color.border,
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    };
  }

  get sectionHeaderStyle() {
    return mergeStyles(styles.header, {
      borderBottomWidth: this.theme.layout.borderWidthLarge,
      borderBottomColor: this.theme.color.primaryHighlight,
    });
  }

  get headerIconStyle() {
    return mergeStyles(styles.headerIcon, {
      color: this.theme.color.iconInactive,
    });
  }

  get emptyBoxColor() {
    return this.theme.color.iconInactive;
  }

  render() {
    return this.props.type === CATEGORY_TYPE.FIX_2_LEVEL ? (
      <SectionList
        safeLayout
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
        safeLayout
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

export default withTranslation('stores')(SubCategory);
