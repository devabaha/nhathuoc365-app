import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Shimmer from 'react-native-shimmer';

import { SubCategoryProps } from '.';
import Category from '../Category';
import Row from './Row';
//@ts-ignore
import appConfig from 'app-config';
import { CATEGORY_TYPE } from '../constants';
import Container from '../../../Layout/Container';
//@ts-ignore
import SVGEmptyBoxOpen from '../../../../images/empty-box-open.svg';
import NoResult from '../../../NoResult';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        minHeight: '100%',
        backgroundColor: '#fff'
    },
    header: {
        paddingHorizontal: 10,
        borderBottomWidth: 2,
        borderBottomColor: appConfig.colors.primary
    },
    bannerContainer: {
        marginTop: 10,
        width: '100%',
        height: 0
    },
    banner: {
        width: '100%',
        height: '100%'
    },
    titleContainer: {
        marginTop: 15,
        marginBottom: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: .3,
        flex: 1
    },
    body: {
        flex: 1,
        backgroundColor: '#fcfcfc'
    },
    categoryWrapper: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    categoryContainer: {
        borderRadius: 8,
        borderBottomWidth: 0,
        padding: 10,
    },
    rowHeaderContainer: {
        backgroundColor: '#fff',
        borderBottomColor: '#eee',
        borderBottomWidth: .5,
    },
    subCategoriesContainer: {
        flexGrow: 1,
        flexWrap: 'wrap',
        flexDirection: 'row',
        borderBottomColor: '#eee',
        borderBottomWidth: .5,
    },
    contentContainerStyle: {
        // backgroundColor: 'red'
    },
    icon: {
        fontSize: 16,
        color: '#777'
    },
    noResult: {
    },
    noResultTxt: {
        fontSize: 18
    }
})

const MIN_ITEM_WIDTH = 120;

class SubCategory extends Component<SubCategoryProps> {
    static defaultProps = {
        categories: [],
        image: "",
        title: "",
        loading: false,
        onPressTitle: () => { },
        fullScroll: false
    }

    state = {
        categorySize: {
            width: 0,
            height: 0
        },
        bannerLayout: {
            width: 0,
            height: 0
        },
        subCategoriesWidth: 0,
        itemsPerRow: 3
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
        const { width: bannerWidth } = e.nativeEvent.layout;
        this.setState({
            bannerLayout: {
                width: bannerWidth,
                height: bannerWidth / 2
            }
        })
    }

    handleCategoriesLayout(e) {
        const { width: bodyWidth } = e.nativeEvent.layout;
        const itemsPerRow = Math.floor(bodyWidth / MIN_ITEM_WIDTH);
        const categorySize = {
            width: bodyWidth / itemsPerRow,
            height: bodyWidth / itemsPerRow,
        }

        this.setState({
            categorySize,
            itemsPerRow,
            subCategoriesWidth: bodyWidth
        })
    }

    renderSubCategories(category, index) {
        const containerStyle = this.state.categorySize ? {
            width: this.state.categorySize.width,
            height: this.state.categorySize.height
        } : {};

        return (
            Array.isArray(category.list) ?
                <View key={index} style={[styles.subCategoriesContainer, { minWidth: this.state.subCategoriesWidth }]}>
                    {category.list.map((childCate, index) => {
                        const isLast = (index + 1) % this.state.itemsPerRow === 0;
                        let extraStyle = {
                            width: this.state.categorySize.width * .8,
                            height: this.state.categorySize.height * .8,
                        };

                        if (!childCate.image) {
                            extraStyle = {
                                ...extraStyle,
                                //@ts-ignore
                                backgroundColor: '#eee',
                                //@ts-ignore
                                padding: 7
                            }
                        }

                        return (
                            <View key={index} style={[styles.categoryWrapper, containerStyle]}>
                                <Category
                                    key={index}
                                    title={childCate.name}
                                    image={childCate.image}
                                    containerStyle={[
                                        styles.categoryContainer,
                                        extraStyle
                                    ]}
                                    onPress={() => this.props.onPressTitle(childCate)}
                                >
                                    {/* {!isLast && <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#fff', position: 'absolute', bottom: 0, right: 0 }} />} */}
                                </Category>
                            </View>
                        )
                    })}
                </View>
                : null
        )
    }

    renderCategories() {
        if (!this.props.categories || this.props.categories.length === 0) {
            return (
                <View style={{flex :1}}>
                    <NoResult
                        containerStyle={styles.noResult}
                        textStyle={styles.noResultTxt}
                        icon={
                            <SVGEmptyBoxOpen
                                fill="#aaa"
                                width="80"
                                height="80"
                            />
                        }
                        message="Chưa có danh mục"
                    />
                </View>
            )
        }

        return (
            this.props.categories.map((category: any, index) => {
                const contentHeight = Array.isArray(category.list) && this.state.categorySize
                    ? Math.ceil(category.list.length / this.state.itemsPerRow) *
                    this.state.categorySize.height
                    : 0;
                if (this.props.type === CATEGORY_TYPE.FIX_2_LEVEL) {
                    return this.renderSubCategories(category, index);
                }
                return (
                    <Row
                        key={index}
                        title={category.name}
                        headerContainerStyle={styles.rowHeaderContainer}
                        totalHeight={contentHeight}
                        defaultOpenChild={this.props.fullData}
                        fullMode={this.props.fullData}
                        onPressTitle={() => this.props.onPressTitle(category)}
                        image={category.image}
                    >
                        {this.renderSubCategories(category, index)}
                    </Row>
                )
            })
        )
    }

    render() {
        const bannerLayout = this.state.bannerLayout.width && {
            width: this.state.bannerLayout.width,
            height: this.state.bannerLayout.height,
        };

        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    {!!this.props.image &&
                        <TouchableOpacity onPress={() => this.props.onPressBanner()}>
                            <View onLayout={this.handleBannerLayout.bind(this)} style={[
                                styles.bannerContainer,
                                bannerLayout
                            ]}>
                                <Image style={styles.banner} source={{ uri: this.props.image }} />
                            </View>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={() => this.props.onPressTitle(null)}>
                        <Container row center style={styles.titleContainer}>
                            <Text style={styles.title}>
                                {this.props.title}
                            </Text>
                            <Shimmer opacity={1} animationOpacity={.3} pauseDuration={3000}>
                                <FontAwesomeIcon name="angle-double-right" style={styles.icon} />
                            </Shimmer>
                        </Container>
                    </TouchableOpacity>
                </View>
                    
                <View
                    onLayout={this.handleCategoriesLayout.bind(this)}
                    style={styles.body}
                >
                    {this.renderCategories()}
                </View>
            </View>
        );
    }
}

export default SubCategory;