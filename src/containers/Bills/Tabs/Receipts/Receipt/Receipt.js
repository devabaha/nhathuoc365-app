import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import appConfig from 'app-config';

class Receipt extends Component {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          {!!this.props.title && (
            <Text style={styles.title}>{this.props.title}</Text>
          )}
          <Text style={styles.date}>{this.props.date}</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.content}>{this.props.content}</Text>
        </View>

        <View style={styles.footer}>
          <Svg height={3} width="100%">
            <Line
              x1="0"
              y1=""
              x2="100%"
              y2="0"
              strokeWidth={3}
              stroke="#ccc"
              strokeDasharray={[3, 10]}
              strokeLinecap="round"
            />
          </Svg>
          <View style={[styles.curve, styles.left]} />
          <View style={[styles.curve, styles.right]} />
          <View style={styles.footerContent}>
            <Text style={styles.code}>{this.props.code}</Text>
            <Text style={styles.price}>{this.props.price}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 20
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.25)
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold'
  },
  date: {
    fontWeight: '300',
    fontSize: 13,
    fontStyle: 'italic'
  },
  body: {
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  content: {},
  price: {
    fontWeight: 'bold',
    fontSize: 18,
    color: appConfig.colors.primary
  },
  footer: {
    paddingHorizontal: 15,
    paddingTop: 0,
    paddingBottom: 15
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 12
  },
  code: {
    color: '#666',
    fontSize: 13
  },
  curve: {
    width: 16,
    height: 16,
    position: 'absolute',
    backgroundColor: '#e9e9ee',
    borderRadius: 8,
    top: -8
  },
  left: {
    left: -9,
    borderRightColor: '#ccc',
    borderRightWidth: 2
  },
  right: {
    right: -9,
    borderLeftColor: '#ccc',
    borderLeftWidth: 2
  }
});

export default Receipt;
