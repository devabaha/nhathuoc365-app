import React, { Component } from 'react';
import { Image } from 'react-native';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SubCategoryProps } from '.';
import Category from '../Category';
import Row from './Row';
//@ts-ignore
import appConfig from 'app-config';

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    title: {
        marginTop: 15,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: .3
    },
    body: {
        backgroundColor: '#fafafa'
    },
    categoryContainer: {
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
            itemsPerRow
        })
    }

    renderSubCategories(category) {
        const extraStyle = this.state.categorySize ? {
            width: this.state.categorySize.width,
            height: this.state.categorySize.height,
        } : {};
        return (
            Array.isArray(category.list) ?
                <View style={styles.subCategoriesContainer}>
                    {category.list.map((childCate, index) => {
                        const isLast = (index + 1) % this.state.itemsPerRow === 0;
                        return (
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
                        )
                    })}
                </View>
                : null
        )
    }

    renderCategories() {
        return (
            this.props.categories.map((category: any, index) => {
                const contentHeight = Array.isArray(category.list) && this.state.categorySize
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
                        image={category.image}
                    >
                        {this.renderSubCategories(category)}
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
                        <View onLayout={this.handleBannerLayout.bind(this)} style={[
                            styles.bannerContainer,
                            bannerLayout
                        ]}>
                            <Image style={styles.banner} source={{ uri: this.props.image }} />
                        </View>
                    }
                    <TouchableOpacity onPress={() => this.props.onPressTitle(null)}>
                        <Text style={styles.title}>
                            {this.props.title}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View
                    onLayout={this.handleCategoriesLayout.bind(this)}
                    style={styles.body}
                >
                    {this.renderCategories()}
                </View>
            </View >
        );
    }
}

export default SubCategory;