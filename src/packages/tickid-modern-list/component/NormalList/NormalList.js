import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {TypographyType, BundleIconSetName} from 'src/components/base';
// custom components
import {BaseButton, Typography, Icon, FlatList} from 'src/components/base';

class NormalList extends Component {
  static contextType = ThemeContext;

  state = {};

  get theme() {
    return getTheme(this);
  }

  renderItem = ({item, index}) => {
    if (this.props.renderItem) {
      return this.props.renderItem(item, index);
    } else {
      const extraStyle =
        index === 0
          ? this.firstStyle
          : index === this.props.data.length - 1
          ? this.lastStyle
          : {};

      const extraStyleContent = index !== 0 && this.contentStyle;

      const text = this.props.mainKey ? item[this.props.mainKey] : item;

      return (
        <BaseButton
          useTouchableHighlight
          key={index}
          onPress={() => this.props.onPressItem(item)}
          style={[
            styles.rowWrapper,
            styles.row,
            this.rowBorderStyle,
            extraStyle,
          ]}>
          <View
            style={[
              styles.rowContent,
              styles.row,
              this.rowBorderStyle,
              extraStyleContent,
            ]}>
            {item.iconLeft}
            <Typography
              type={TypographyType.LABEL_MEDIUM}
              style={[styles.text, item.titleStyle]}>
              {text}
            </Typography>
            {item.iconRight || (
              <Icon
                bundle={BundleIconSetName.FEATHER}
                name="arrow-up-left"
                style={[styles.rightIcon, this.rowBorderStyle]}
              />
            )}
          </View>
        </BaseButton>
      );
    }
  };

  renderFlatList() {
    return (
      <FlatList
        data={this.props.data}
        renderItem={this.renderItem}
        scrollEnabled={this.props.scrollEnabled}
        keyExtractor={(item, index) => index.toString()}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        extraData={this.props.extraData}
        ListEmptyComponent={this.props.listEmptyComponent}
      />
    );
  }

  renderNonList() {
    return !this.props.data?.length
      ? this.props.listEmptyComponent
      : this.props.data.map((item, index) => this.renderItem({item, index}));
  }

  renderList() {
    if (this.props.scrollEnabled) {
      return this.renderFlatList();
    } else {
      return this.renderNonList();
    }
  }

  get rowBorderStyle() {
    return {
      borderColor: this.theme.color.border,
    };
  }

  get iconRighStyle() {
    return [
      styles.rightIcon,
      {
        color: this.theme.color.iconInactive,
      },
    ];
  }

  get firstStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidthSmall,
    };
  }

  get lastStyle() {
    return {
      borderBottomWidth: this.theme.layout.borderWidthSmall,
    };
  }

  get contentStyle() {
    return {
      borderTopWidth: this.theme.layout.borderWidthPixel,
    };
  }

  render() {
    return this.renderList();
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowWrapper: {
    paddingLeft: 15,
  },
  rowContent: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 15,
  },
  rightIcon: {
    fontSize: 20,
  },
  text: {
    fontWeight: '500',
    flex: 1,
  },
});

export default NormalList;
