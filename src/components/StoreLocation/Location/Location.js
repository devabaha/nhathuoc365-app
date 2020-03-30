import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';

class Location extends PureComponent {
  state = {};

  get shortName() {
    return !!this.props.name
      ? this.props.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .join('')
      : '';
  }

  renderAvatar() {
    if (this.props.image) {
      return (
        <CachedImage source={{ uri: this.props.image }} style={styles.image} />
      );
    } else {
      const shortName = this.shortName;
      return <Text style={styles.shortName}>{shortName}</Text>;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <TouchableHighlight
            style={styles.fullCenter}
            underlayColor="rgba(0,0,0,.15)"
            onPress={this.props.onPress}
          >
            {this.renderAvatar()}
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#fcfcfc',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7
  },
  wrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#fcfcfc',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullCenter: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  shortName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#242424'
  }
});

export default Location;
