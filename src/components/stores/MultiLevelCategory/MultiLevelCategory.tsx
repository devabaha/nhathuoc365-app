/**
 * @class Multi-Level Category
 *
 * @version 1.1
 * @author Nguyen Hoang Minh
 *
 * @summary Category with multi-level. 2 options for layout.
 * @description current for 2-3 level.
 *
 * @example Category of Beemart, Tiki.
 */
import * as React from 'react';
import {View, StyleSheet} from 'react-native';
// types
import {MultiLevelCategoryProps} from '.';
import {Style} from 'src/Themes/interface';
// configs
import appConfig from 'app-config';
import store from 'app-store';
// network
import APIHandler from 'src/network/APIHandler';
// helpers
import {servicesHandler} from 'src/helper/servicesHandler';
import EventTracker from 'src/helper/EventTracker';
import {mergeStyles} from 'src/Themes/helper';
import {getTheme} from 'src/Themes/Theme.context';
// routing
import {pop, push} from 'app-helper/routing';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
//constants
import {RightButtonNavbarType} from 'src/components/RightButtonNavBar/constants';
import {CATEGORY_TYPE, TEMP_CATEGORIES} from './constants';
import {BundleIconSetName, NavBarWrapper} from 'src/components/base';
// entities
import {APIRequest} from 'src/network/Entity';
// images
//@ts-ignore
import SVGEmptyBoxOpen from 'src/images/empty-box-open.svg';
//@ts-ignore
import PNGBackImageBtn from 'src/images/back_chevron.png';
// custom components
import Category from './Category';
import SubCategory from './SubCategory';
import Loading from 'src/components/Loading';
import NoResult from 'src/components/NoResult';
import RightButtonNavBar from 'src/components/RightButtonNavBar';
import Header from 'src/components/Home/component/Header';
import {
  ImageButton,
  Container,
  FlatList,
  IconButton,
  ScreenWrapper,
} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContentContainer: {
    paddingBottom: 8,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  mainCategoryTitle: {
    fontWeight: '600',
  },
  right_btn_box: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  searchIcon: {
    fontSize: 26,
    top: appConfig.device.isAndroid ? 1 : 0,
  },
  backContainer: {
    marginRight: 15,
  },
  back: {
    width: 13,
    height: 21,
  },
});

class MultiLevelCategory extends React.Component<MultiLevelCategoryProps> {
  static contextType = ThemeContext;

  static defaultProps = {
    type: CATEGORY_TYPE.FIX_2_LEVEL,
    siteId: store.store_id,
    categoryId: 0,
  };

  state = {
    categories: [],
    selectedMainCategory: {
      id: this.props.categoryId || -1,
      name: '',
      list: [],
    },
    mainCategoryDataPosition: {},
    subCategoryDataPosition: {},
    isScrollByMainCategoryPressing: false,
    loading: true,
    refreshing: false,
    type: this.props.type,
  };
  refMainCategory = React.createRef<any>();
  refSubCategory = React.createRef<any>();
  getMultiLevelCategoriesRequest = new APIRequest();
  requests = [this.getMultiLevelCategoriesRequest];

  eventTracker = new EventTracker();

  get theme() {
    return getTheme(this);
  }

  shouldComponentUpdate(nextProps: MultiLevelCategoryProps, nextState: any) {
    if (
      nextProps.type !== this.props.type &&
      nextProps.type !== this.state.type
    ) {
      this.setState({
        type: nextProps.type,
      });
    }
    if (nextState !== this.state) {
      return true;
    }

    return false;
  }

  get isFullData() {
    return false;
    return this.state.type === CATEGORY_TYPE.FULL_SCROLL;
  }

  get hasCategories() {
    return Array.isArray(this.state.categories);
  }

  get hasSelectedMainCategory() {
    return (
      !!this.state.selectedMainCategory &&
      Object.keys(this.state.selectedMainCategory).length !== 0
    );
  }

  getFormattedCategoryIDForPositionData(categoryID) {
    return categoryID + ' ';
  }

  componentDidMount() {
    this.getMultiLevelCategories();

    // setTimeout(() => {
    //   refresh(
    //     {
    //       right: this._renderRightButton(),
    //       navBar: () => null,
    //     },
    //   );
    // });
    this.eventTracker.logCurrentView();
  }

  componentWillUnmount() {
    this.eventTracker.clearTracking();
  }

  _renderRightButton() {
    return (
      <View style={[styles.right_btn_box]}>
        {/* <RightButtonOrders tel={store.store_data.tel} /> */}
        <IconButton
          bundle={BundleIconSetName.FEATHER}
          name="search"
          iconStyle={this.iconSearchStyle}
          onPress={() => {
            //@ts-ignore
            const {t} = this.props;
            const categories = [...this.state.categories];
            categories.unshift({
              name: t('stores:tabs.store.title'),
              id: 0,
            });
            push(appConfig.routes.searchStore, {
              categories: categories,
              category_id: 0,
              // category_name:
              //     this.state.selectedMainCategory.id !== -1
              //         ? this.state.selectedMainCategory.name
              //         : ''
            });
          }}
        />
        <RightButtonNavBar type={RightButtonNavbarType.SHOPPING_CART} />
      </View>
    );
  }

  formatCategories(categories = []) {
    return categories.map((category, index) => ({...category, index}));
  }

  async getMultiLevelCategories() {
    //@ts-ignore
    const {t} = this.props;
    try {
      this.getMultiLevelCategoriesRequest.data = APIHandler.site_get_tree_categories(
        this.props.siteId,
      );

      const response: any = await this.getMultiLevelCategoriesRequest.promise();

      if (response) {
        //@ts-ignore
        if (response.status === STATUS_SUCCESS) {
          const categories = this.formatCategories(response.data.categories);
          const defaultSelectedCategory =
            categories[0] || this.state.selectedMainCategory;
          const selectedMainCategory =
            this.state.selectedMainCategory.id === -1
              ? defaultSelectedCategory
              : categories.find(
                  (cate) => cate.id === this.state.selectedMainCategory.id,
                ) || defaultSelectedCategory;
          // this.setState(
          //   {
          //     type: CATEGORY_TYPE.FIX_2_LEVEL,
          //     categories,
          //     // categories: this.formatCategories(TEMP_CATEGORIES),
          //     // selectedMainCategory: TEMP_CATEGORIES[0],
          //   },
          //   () => {
          //     setTimeout(
          //       () => this.onPressMainCategory(selectedMainCategory),
          //       300,
          //     );
          //   },
          // );
          this.setState(
            (prevState: any) => ({
              type: response.data.type || prevState.type,
              categories,
              // selectedMainCategory,
            }),
            () => {
              setTimeout(
                () => this.onPressMainCategory(selectedMainCategory),
                300,
              );
            },
          );
        } else {
          //@ts-ignore
          flashShowMessage({
            type: 'danger',
            message: response.data || t('common:api.error.message'),
          });
        }
      } else {
        //@ts-ignore
        flashShowMessage({
          type: 'danger',
          message: t('common:api.error.message'),
        });
      }
    } catch (err) {
      console.log('%cget_multi_level_categories', 'color: red', err);
    } finally {
      this.setState({
        loading: false,
        refreshing: false,
      });
    }
  }

  handleBack = () => pop();

  handleSearch = () => {
    push(appConfig.routes.searchStore, {
      categories: null,
      category_id: 0,
      category_name: '',
    });
  };

  onPressMainCategory(category, isUpdate = true) {
    if (category?.id === this.state.selectedMainCategory?.id) return;

    if (isUpdate) {
      this.setState(
        {
          selectedMainCategory: category,
        },
        () => {
          this.scrollMainCategoryToIndex(category);
        },
      );
    } else {
      this.scrollMainCategoryToIndex(category);
    }

    if (!this.isFullData) return;
    if (this.refSubCategory.current) {
      this.setState(
        {
          isScrollByMainCategoryPressing: true,
        },
        () =>
          this.refSubCategory.current.scrollTo({
            y: this.state.subCategoryDataPosition[
              this.getFormattedCategoryIDForPositionData(category.id)
            ],
          }),
      );
    }
  }

  onPressBanner(category) {
    if (category.service) {
      servicesHandler(category.service);
    } else {
      this.goToStore(category);
    }
  }

  goToStore(category) {
    push(appConfig.routes.store, {
      title: category.name,
      categoryId: category.id,
      extraCategoryId:
        Array.isArray(category.list) &&
        category.list.length !== 0 &&
        category.id,
      extraCategoryName: category.name,
    });
  }

  scrollMainCategoryToIndex(category) {
    const offsetTarget = 2;
    if (this.refMainCategory.current) {
      let index = category.index - offsetTarget;
      if (index < 0) {
        index = 0;
      }
      this.refMainCategory.current.scrollToIndex({index});
    }
  }

  onRefresh() {
    this.setState({refreshing: true});
    this.getMultiLevelCategories();
  }

  renderMainCategory({item: category}) {
    const isSelected = category.id === this.state.selectedMainCategory.id;

    return (
      <Category
        isActive={isSelected}
        image={category.image}
        title={category.name}
        onPress={() => this.onPressMainCategory(category)}
        titleStyle={styles.mainCategoryTitle}
      />
    );
  }

  renderSubCategories() {
    const categories = this.hasSelectedMainCategory
      ? this.isFullData
        ? this.state.categories
        : this.state.selectedMainCategory.id !== -1
        ? [this.state.selectedMainCategory]
        : []
      : [];

    return categories.map((category, index) => {
      const childCategories =
        this.state.type === CATEGORY_TYPE.FIX_2_LEVEL
          ? categories
          : category.list;

      return (
        <Container key={index} flex centerVertical={false}>
          <SubCategory
            type={this.state.type}
            categories={childCategories}
            image={category.banner}
            // image="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQLN3yGu2SdG8D0_HCgx_MBHGglHyaPoypdJA&usqp=CAU"
            title={category.name}
            fullData={this.isFullData}
            onPressTitle={(cate) => this.goToStore(cate || category)}
            onPressBanner={() => this.onPressBanner(category)}
          />
        </Container>
      );
    });
  }

  renderBack = () => {
    return (
      <ImageButton
        //@ts-ignore
        hitSlop={HIT_SLOP}
        style={styles.backContainer}
        onPress={this.handleBack}
        imageStyle={styles.back}
        source={PNGBackImageBtn}
      />
    );
  };

  get iconSearchStyle() {
    return mergeStyles(styles.searchIcon, {
      color: this.theme.color.onNavBarBackground,
    });
  }

  get navBarStyle(): Style {
    return {
      backgroundColor: this.theme.color.navBarBackground,
    };
  }

  get mainCategoriesStyle(): Style {
    return {
      borderRightColor: this.theme.color.border,
      borderRightWidth: this.theme.layout.borderWidthSmall,
    };
  }

  get emptyBoxColor() {
    return this.theme.color.iconInactive;
  }

  render() {
    return (
      <>
        <NavBarWrapper appNavBar={false} containerStyle={this.navBarStyle}>
          <Header
            wrapperStyle={this.navBarStyle}
            contentContainer={styles.headerContentContainer}
            placeholder={this.props.title}
            renderLeft={this.renderBack}
            goToSearch={this.handleSearch}
          />
        </NavBarWrapper>
        <ScreenWrapper>
          {this.state.loading && <Loading center />}
          <View style={styles.mainContainer}>
            <Container style={this.mainCategoriesStyle}>
              <FlatList
                safeLayout
                ref={this.refMainCategory}
                scrollEventThrottle={16}
                extraData={this.state.selectedMainCategory.id}
                showsVerticalScrollIndicator={false}
                data={this.state.categories}
                renderItem={this.renderMainCategory.bind(this)}
                keyExtractor={(item, index) => index.toString()}
                onScrollToIndexFailed={() => {}}
                getItemLayout={(data, index) => ({
                  index,
                  length: appConfig.device.width / 4,
                  offset: (appConfig.device.width / 4) * index,
                })}
              />
            </Container>

            <Container flex centerVertical>
              {Array.isArray(this.state.categories) &&
              this.state.categories.length !== 0
                ? this.renderSubCategories()
                : !this.state.loading && (
                    <NoResult
                      containerStyle={styles.container}
                      icon={
                        <SVGEmptyBoxOpen
                          fill={this.emptyBoxColor}
                          width="100"
                          height="100"
                        />
                      }
                      message={this.props.t('noCategory')}
                    />
                  )}
            </Container>
          </View>
        </ScreenWrapper>
      </>
    );
  }
}

//@ts-ignore
export default withTranslation(['stores, common'])(MultiLevelCategory);
