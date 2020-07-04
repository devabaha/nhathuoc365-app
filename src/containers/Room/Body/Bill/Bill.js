import React, { Component } from 'react';
import Button from 'react-native-button';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import appConfig from 'app-config';

class Bill extends Component {
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
            </View>
          )}

          <View style={styles.footer}>
            {!!this.props.period && (
              <Text numberOfLines={2} style={styles.subTitle}>
                Kỳ <Text style={styles.hightlight}>{this.props.period}</Text>
              </Text>
            )}
            {!!this.props.price && (
              <Text style={styles.special}>{this.props.price}</Text>
            )}
          </View>
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
    backgroundColor: '#deedf7',
    overflow: 'hidden'
  },
  container: {
    width: 205,
    flex: 1
  },
  footer: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  titleContainer: {
    // backgroundColor: '#deedf7',
    marginHorizontal: -15,
    marginTop: -15,
    paddingHorizontal: 15,
    paddingTop: 15,
    flex: 1
  },
  title: {
    color: '#333',
    fontWeight: '500',
    marginBottom: 10,
    flex: 1
  },
  subTitle: {
    marginTop: 10,
    fontSize: 12,
    color: '#666'
  },
  hightlight: {
    fontWeight: '600',
    color: '#444',
    fontSize: 14
  },
  special: {
    color: appConfig.colors.primary,
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default Bill;
