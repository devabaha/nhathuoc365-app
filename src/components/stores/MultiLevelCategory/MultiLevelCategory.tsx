/**
 * @class Multi-Level Category
 * 
 * @version 1.0
 * @author Nguyen Hoang Minh
 * 
 * @summary Category with multi-level. 2 options for layout.
 * @description current for 2-3 level.
 * 
 * @example Category of Beemart, Clingme (others app on store).
 */
import * as React from "react";
import { SafeAreaView, View, StyleSheet, FlatList, RefreshControl, ScrollView } from "react-native";
import IconFeather from 'react-native-vector-icons/Feather';
import Button from 'react-native-button';
import RightButtonChat from '../../RightButtonChat';
import Category from "./Category";
import SubCategory from "./SubCategory";
//@ts-ignore
import appConfig from 'app-config';
//@ts-ignore
import store from 'app-store';
import { MultiLevelCategoryProps } from ".";
import { APIRequest } from "../../../network/Entity";
import APIHandler from "../../../network/APIHandler";
import { Actions } from "react-native-router-flux";
import Loading from "../../Loading";
//@ts-ignore
import SVGEmptyBoxOpen from '../../../images/empty-box-open.svg';
import NoResult from "../../NoResult";
import { CATEGORY_POSITION_TYPE, CATEGORY_TYPE, TEMP_CATEGORIES } from "./constants";
import { servicesHandler } from "../../../helper/servicesHandler";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mainContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    mainCategories: {
        backgroundColor: '#fff',
        borderRightColor: '#aaa',
        borderRightWidth: .5
    },
    mainCategoryTitle: {
        fontWeight: '600'
    },
    right_btn_box: {
        flexDirection: 'row'
    },
})

class MultiLevelCategory extends React.Component<MultiLevelCategoryProps> {
    static defaultProps = {
        type: CATEGORY_TYPE.FIX_3_LEVEL,
        siteId: store.store_id,
        categoryId: 0,
    }

    state = {
        categories: [],
        selectedMainCategory: {
            id: this.props.categoryId || -1,
            name: "",
            list: []
        },
        mainCategoryDataPosition: {},
        subCategoryDataPosition: {},
        isScrollByMainCategoryPressing: false,
        loading: true,
        refreshing: false,
        type: this.props.type
    };
    refMainCategory = React.createRef<any>();
    refSubCategory = React.createRef<any>();
    getMultiLevelCategoriesRequest = new APIRequest();
    requests = [this.getMultiLevelCategoriesRequest];

    shouldComponentUpdate(nextProps: MultiLevelCategoryProps, nextState: any) {
        if (nextProps.type !== this.props.type &&
            nextProps.type !== this.state.type) {
            this.setState({
                type: nextProps.type
            })
        }
        return true;
    }

    get isFullData() {
        return this.state.type === CATEGORY_TYPE.FULL_SCROLL;
    }

    get hasCategories() {
        return Array.isArray(this.state.categories)
    }

    get hasSelectedMainCategory() {
        return !!(this.state.selectedMainCategory) && (Object.keys(this.state.selectedMainCategory).length !== 0)
    }

    getFormattedCategoryIDForPositionData(categoryID) {
        return categoryID + " ";
    }

    componentDidMount() {
        this.getMultiLevelCategories();

        setTimeout(() => {
            Actions.refresh({
                right: this._renderRightButton()
            });
        });
        //@ts-ignore
        EventTracker.logEvent('multi_level_category');
    }

    _renderRightButton() {
        return (
            <View style={[styles.right_btn_box]}>
                {/* <RightButtonOrders tel={store.store_data.tel} /> */}
                <Button
                    onPress={() => {
                        //@ts-ignore
                        const { t } = this.props;
                        const categories = [...this.state.categories];
                        categories.unshift({
                            name: t('stores:tabs.store.title'),
                            id: 0
                        })
                        Actions.push(appConfig.routes.searchStore, {
                            categories: categories,
                            category_id: this.state.selectedMainCategory.id,
                            category_name:
                                this.state.selectedMainCategory.id !== -1
                                    ? this.state.selectedMainCategory.name
                                    : ''
                        });
                    }}
                >
                    <IconFeather size={26} color={appConfig.colors.white} name="search" />
                </Button>
                <RightButtonChat tel={store.store_data.tel} />
            </View>
        );
    }

    async getMultiLevelCategories() {
        //@ts-ignore
        const { t } = this.props;
        try {
            this.getMultiLevelCategoriesRequest.data =
                APIHandler.site_get_tree_categories(this.props.siteId);

            const response: any = await this.getMultiLevelCategoriesRequest.promise();

            if (response) {
                //@ts-ignore
                if (response.status === STATUS_SUCCESS) {
                    const defaultSelectedCategory = response.data.categories[0] || this.state.selectedMainCategory;
                    const selectedMainCategory = this.state.selectedMainCategory.id === -1
                        ? defaultSelectedCategory
                        : (response.data.categories.find(cate => cate.id === this.state.selectedMainCategory.id)
                            || defaultSelectedCategory);
                    // this.setState({
                    //     type: CATEGORY_TYPE.FIX_3_LEVEL,
                    //     categories: TEMP_CATEGORIES,
                    //     selectedMainCategory: TEMP_CATEGORIES[0]
                    // })
                    this.setState((prevState: any) => ({
                        type: response.data.type || prevState.type,
                        categories: response.data.categories,
                        selectedMainCategory
                    }))
                } else {
                    //@ts-ignore
                    flashShowMessage({
                        type: 'danger',
                        message: response.data || t('common:api.error.message')
                    })
                }
            } else {
                //@ts-ignore
                flashShowMessage({
                    type: 'danger',
                    message: t('common:api.error.message')
                })
            }

        } catch (err) {
            console.log('%cget_multi_level_categories', 'color: red', err);
        } finally {
            this.setState({
                loading: false,
                refreshing: false
            })
        }
    }

    onPressMainCategory(category) {
        this.setState({
            selectedMainCategory: category
        }, () => {
            this.scrollMainCategoryToIndex(category)
        })

        if (!this.isFullData) return;
        if (this.refSubCategory.current) {
            this.setState({
                isScrollByMainCategoryPressing: true
            }, () =>
                this.refSubCategory.current.scrollTo({
                    y: this.state.subCategoryDataPosition[
                        this.getFormattedCategoryIDForPositionData(category.id)
                    ]
                })
            )
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
        Actions.push(appConfig.routes.store, {
            title: category.name,
            categoryId: category.id,
            extraCategoryId: Array.isArray(category.list) && category.list.length !== 0 && category.id,
            extraCategoryName: category.name,
        })
    }

    handleMainCategoryScrolling(e) {

    }

    /**
     * @todo auto update main selected category by scrolling sub category screen
     * 
     * @description only support for FULL_SCROLL mode. 
     * Not work if sub category scrolled by main category pressing.
     */
    handleSubCategoriesScrolling(e) {
        if (!this.isFullData) return;
        if (this.state.isScrollByMainCategoryPressing) return;
        const {
            contentOffset: { y },
            layoutMeasurement: { height: layoutHeight },
            contentSize: { height: contentHeight }
        } = e.nativeEvent;
        const dataMappingIDs = Object.keys(this.state.subCategoryDataPosition);
        const scrollOverCategoriesID = dataMappingIDs.filter(categoryID => {
            return this.state.subCategoryDataPosition[categoryID] <= y
        });

        if (scrollOverCategoriesID.length !== 0) {
            const nearestCategoryID = scrollOverCategoriesID[scrollOverCategoriesID.length - 1].trim();
            const nearestCategory = this.state.categories
                .find(cate => String(cate.id) === nearestCategoryID);
            const nearestCategoryIndex = this.state.categories
                .findIndex(cate => String(cate.id) === nearestCategoryID);
            const nextCategoryIndex = nearestCategoryIndex + 1;
            const nextCategory = this.state.categories[nextCategoryIndex];


            if (nextCategory) {
                const nearestCategoryPosition = this.state.subCategoryDataPosition[
                    this.getFormattedCategoryIDForPositionData(nearestCategoryID)];
                const nextCategoryPosition = this.state.subCategoryDataPosition[
                    this.getFormattedCategoryIDForPositionData(nextCategory.id)];
                if (y < (nextCategoryPosition - nearestCategoryPosition) / 4) {
                    return;
                }
            }

            if (nearestCategoryID !== String(this.state.selectedMainCategory.id)) {

                this.setState({
                    selectedMainCategory: nearestCategory
                });
                this.scrollMainCategoryToIndex(nearestCategory);
            }
        }
    }

    scrollMainCategoryToIndex(category) {
        const offsetTarget = 2;
        if (this.refMainCategory.current) {
            const nextMainCategoryIndex = this.state.categories
                .findIndex(cate => cate.id === category.id)
            if (nextMainCategoryIndex !== -1) {
                let index = nextMainCategoryIndex - offsetTarget;
                if (index < 0) {
                    index = 0;
                }
                this.refMainCategory.current.scrollToIndex({ index })
            }
        }
    }

    handleMappingDataPosition(category, type, e) {
        const { y } = e.nativeEvent.layout;

        switch (type) {
            case CATEGORY_POSITION_TYPE.MAIN:
                this.mapMainCategoryPosition(category, y)
                break;
            case CATEGORY_POSITION_TYPE.SUB:
                this.mapSubCategoryPosition(category, y)
                break;
        }
    }

    mapMainCategoryPosition(category, y) {
        if (this.state.mainCategoryDataPosition[category.id] !== y) {
            this.setState((prevState: any) => ({
                mainCategoryDataPosition: {
                    ...prevState.mainCategoryDataPosition,
                    [category.id]: y
                }
            }))
        }
    }

    mapSubCategoryPosition(category, y) {
        if (this.state.subCategoryDataPosition[category.id] !== y) {
            const subCategoryDataPosition = {
                ...this.state.subCategoryDataPosition,
                [this.getFormattedCategoryIDForPositionData(category.id)]: y
            }

            const subCategoryDataPositionOrderedByValue = {};
            Object.keys(subCategoryDataPosition).sort(
                (a: any, b: any) => Number(subCategoryDataPosition[a]) - Number(subCategoryDataPosition[b]))
                .forEach((key: any) => {

                    // prevent auto ordering of JS obj
                    subCategoryDataPositionOrderedByValue[key] = subCategoryDataPosition[key];
                });
            this.setState({
                subCategoryDataPosition: subCategoryDataPositionOrderedByValue
            })
        }
    }

    onRefresh() {
        this.setState({ refreshing: true });
        this.getMultiLevelCategories();
    }

    handleSubCategoryMomentumScrollEnd(e) {
        if (!this.isFullData) return;
        if (this.state.isScrollByMainCategoryPressing) {
            this.setState({
                isScrollByMainCategoryPressing: false
            })
        }
    }

    renderMainCategory({ item: category }) {
        const isSelected = category.id === this.state.selectedMainCategory.id;

        return (
            <View onLayout={this.mapMainCategoryPosition.bind(this, category)}>
                <Category
                    isActive={isSelected}
                    image={category.image}
                    title={category.name}
                    onPress={this.onPressMainCategory.bind(this, category)}
                    containerStyle={{ borderTopColor: '#fff', borderTopWidth: .5 }}
                    titleStyle={styles.mainCategoryTitle}
                />
            </View>
        )
    }

    renderSubCategories() {
        const categories = this.hasSelectedMainCategory
            ? this.isFullData
                ? this.state.categories
                : this.state.selectedMainCategory.id !== -1
                    ? [this.state.selectedMainCategory]
                    : []
            : [];
        return (
            categories.map((category, index) => {
                const childCategories = this.state.type === CATEGORY_TYPE.FIX_2_LEVEL
                    ? categories
                    : category.list
                return (
                    <View
                        key={index}
                        onLayout={this.handleMappingDataPosition.bind(this, category, CATEGORY_POSITION_TYPE.SUB)}>
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
                    </View>
                )
            })
        )
    }

    render() {
        if (this.state.loading) return <Loading center />;
        return (
            <View style={styles.container}>
                <SafeAreaView style={styles.mainContainer}>
                    <View style={styles.mainCategories}>
                        <FlatList
                            ref={this.refMainCategory}
                            scrollEventThrottle={16}
                            onScroll={this.handleMainCategoryScrolling.bind(this)}
                            extraData={this.state.selectedMainCategory.id}
                            showsVerticalScrollIndicator={false}
                            data={this.state.categories}
                            renderItem={this.renderMainCategory.bind(this)}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>

                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        ref={this.refSubCategory}
                        scrollEventThrottle={16}
                        onScroll={this.handleSubCategoriesScrolling.bind(this)}
                        onMomentumScrollEnd={this.handleSubCategoryMomentumScrollEnd.bind(this)}
                        refreshControl={<RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this.onRefresh.bind(this)}
                        />}
                    >
                        {(Array.isArray(this.state.categories) &&
                            this.state.categories.length !== 0)
                            ? this.renderSubCategories()
                            : <NoResult
                                containerStyle={styles.container}
                                icon={
                                    <SVGEmptyBoxOpen
                                        fill="#aaa"
                                        width="100"
                                        height="100"
                                    />
                                }
                                message="Chưa có danh mục"
                            />}
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }
}

//@ts-ignore
export default withTranslation(['stores, common'])(MultiLevelCategory);
