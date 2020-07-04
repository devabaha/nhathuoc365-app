import React, { Component } from 'react';
import Button from 'react-native-button';
import { View, Text, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
class Request extends Component {
  state = {};
  render() {
    return (
      <Button
        onPress={this.props.onPress}
        containerStyle={[
          styles.containerBtn,
          {
            marginRight: this.props.last ? 16 : 0
          }
        ]}
      >
        <View style={styles.container}>
          {!!this.props.title && (
            <View style={styles.titleContainer}>
              <Text numberOfLines={2} style={styles.title}>
                {this.props.title}
              </Text>
            </View>
          )}
          {!!this.props.subTitle && (
            <Text numberOfLines={3} style={styles.subTitle}>
              {this.props.subTitle} {this.props.subTitle} {this.props.subTitle}{' '}
              {this.props.subTitle}
            </Text>
          )}
          {!!this.props.description && (
            <Text style={styles.description}>
              <Icon name="clock-o" /> {this.props.description}
            </Text>
          )}
        </View>
      </Button>
    );
  }
}

const styles = StyleSheet.create({
  containerBtn: {
    marginLeft: 16,
    borderRadius: 4,
    padding: 15,
    backgroundColor: '#f7f6d5',
    overflow: 'hidden'
  },
  container: {
    width: 205
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    marginBottom: 5,
    borderBottomColor: '#ddd',
    marginHorizontal: -15,
    paddingHorizontal: 15,
    paddingTop: 15,
    backgroundColor: '#f7f6d5',
    marginTop: -15
  },
  title: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 10,
    flex: 1,
    fontSize: 15
  },
  subTitle: {
    fontSize: 13,
    textDecorationStyle: 'dotted',
    textDecorationColor: '#ddd',
    textDecorationLine: 'underline',
    lineHeight: 20
  },
  description: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'right',
    color: '#666'
  }
});

export default Request;
