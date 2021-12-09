import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// constants
import {BundleIconSetName, TypographyType} from 'src/components/base';
// custom components
import {Typography, Container, Icon} from 'src/components/base';

class Row extends Component {
  state = {};

  componentDidMount() {}

  renderTitle() {
    let isReturn = false;
    let searchingText = '',
      remainText = '';
    const textSearchArr = this.props.textSearch.split('');
    const titleArr = this.props.title.split('');
    titleArr.forEach((tChar, tIndex) => {
      let isMatch = false;

      textSearchArr.forEach((tSChar, tSIndex) => {
        const condition =
          tSChar.toLowerCase() === tChar.toLowerCase() && tIndex === tSIndex;
        if (condition && !isReturn) {
          isMatch = true;
          searchingText += tChar;
        }
      });

      if (!isMatch) {
        isReturn = true;
        remainText += tChar;
      }
    });

    return (
      <Typography
        type={TypographyType.LABEL_LARGE}
        numberOfLines={1}
        style={this.props.titleStyle}>
        <Typography type={TypographyType.LABEL_MEDIUM_SECONDARY}>
          {searchingText || remainText}
        </Typography>
        {searchingText ? remainText : ''}
      </Typography>
    );
  }

  render() {
    return (
      <Container
        noBackground
        row
        style={[styles.container, this.props.containerStyle]}>
        <View style={styles.infor}>
          {this.renderTitle()}
          {!!this.props.description && (
            <Typography
              type={TypographyType.DESCRIPTION_SEMI_MEDIUM_TERTIARY}
              numberOfLines={1}
              style={styles.description}>
              {this.props.description}
            </Typography>
          )}
        </View>
        <Icon
          bundle={BundleIconSetName.FEATHER}
          name="arrow-up-left"
          style={styles.icon}
          neutral
        />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  infor: {
    flex: 1,
  },
  description: {
    marginTop: 3,
  },
  icon: {
    fontSize: 20,
    marginLeft: 15,
  },
});

export default Row;
