import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
// constants
import {TypographyType} from 'src/components/base';
import {LIST_TYPE} from '../constants';
// custom components
import NormalList from './NormalList';
import TagList from './TagList';
import {BaseButton, Container, Typography} from 'src/components/base';

class ModernListComponent extends Component {
  state = {};

  renderHeader() {
    return (
      <BaseButton
        style={[styles.headerContent]}
        disabled={!this.props.onHeaderPress}
        onPress={this.props.onHeaderPress}>
        {this.props.headerLeftComponent}
        <Typography
          type={TypographyType.LABEL_LARGE_TERTIARY}
          style={[styles.headerTitle, this.props.headerTitleStyle]}>
          {this.props.headerTitle}
        </Typography>
        {this.props.headerRightComponent}
      </BaseButton>
    );
  }

  renderBody() {
    const props = {
      data: this.props.data,
      mainKey: this.props.mainKey,
      scrollEnabled: this.props.scrollEnabled,
      onPressItem: this.props.onPressItem,
      activeStyle: this.props.activeStyle,
      activeTextStyle: this.props.activeTextStyle,
      disabledStyle: this.props.disabledStyle,
      disabledTextStyle: this.props.disabledTextStyle,
      renderItem: this.props.renderItem,
      extraData: this.props.extraData,
      listEmptyComponent: this.props.listEmptyComponent,
      scrollEnabled: this.props.scrollEnabled,
    };
    switch (this.props.type) {
      case LIST_TYPE.NORMAL:
        return <NormalList {...props} />;
      case LIST_TYPE.TAG:
        return <TagList {...props} />;
      default:
        return <NormalList {...props} />;
    }
  }

  render() {
    const header = this.props.headerComponent || this.renderHeader();
    const body = this.renderBody();

    return (
      <Container
        reanimated
        style={[styles.container, this.props.containerStyle]}>
        <View style={[styles.headerWrapper, this.props.headerWrapperStyle]}>
          {header}
        </View>

        <Container
          reanimated
          style={[styles.container, styles.body, this.props.bodyWrapperStyle]}
          onLayout={this.props.onBodyLayout}>
          {body}
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 0.00001
  },
  headerWrapper: {
    paddingTop: 10,
    paddingBottom: 7,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
  },
  body: {
    overflow: 'hidden',
  },
});

export default ModernListComponent;
