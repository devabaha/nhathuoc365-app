import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../../config';
import Button from 'react-native-button';
import { View, Text, Image, StyleSheet } from 'react-native';
import arrowRightImage from '../../assets/images/arrow-right.png';

class ListItem extends Component {
  static propTypes = {
    heading: PropTypes.string,
    text: PropTypes.string,
    children: PropTypes.node,
    texts: PropTypes.array,
    onPress: PropTypes.func
  };

  static defaultProps = {
    heading: '',
    text: '',
    children: null,
    texts: [],
    onPress: () => {}
  };

  renderTexts = () => {
    return this.props.texts.map((text, index) => (
      <Text style={styles.text} key={index}>
        {`${text[0]} `}
        <Text style={styles.textBlack}>{text[1]}</Text>
      </Text>
    ));
  };

  render() {
    return (
      <Button containerStyle={styles.container} onPress={this.props.onPress}>
        <View style={styles.content}>
          <Text style={styles.heading}>{this.props.heading}</Text>
          {!!this.props.text && (
            <Text style={styles.text}>{this.props.text}</Text>
          )}
          {this.props.texts.length > 0 && this.renderTexts()}
        </View>
        <Image style={styles.rightIcon} source={arrowRightImage} />
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ebebeb',
    paddingVertical: 8
  },
  content: {
    flex: 1
  },
  rightIcon: {
    width: 16,
    height: 16
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
    color: config.colors.black,
    marginBottom: 6
  },
  text: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666'
  },
  textBlack: {
    color: config.colors.black
  }
});

export default ListItem;
