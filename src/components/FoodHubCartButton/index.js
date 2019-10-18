import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import btnCart from '../../images/btn-cart.png';

class FoodHubCartButton extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.iconWrapper,
            {
              // borderWidth: 1,
              // borderColor: this.props.primaryColor,
            }
          ]}
        >
          <Image style={styles.icon} source={btnCart} resizeMode="cover" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  iconWrapper: {
    // width: 44,
    // height: 44,
    // borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    position: 'relative',
    top: -2,
    width: 50,
    height: 50
  }
});

export default FoodHubCartButton;
