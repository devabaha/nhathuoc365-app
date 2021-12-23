import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Container, NavBar as BaseNavBar} from 'src/components/base';

const styles = StyleSheet.create({
  container: {
    top: 0,
  },
});

class NavBar extends Component<any> {
  render() {
    return (
      <BaseNavBar
        navigation={this.props.navigation}
        noBackground
        containerStyle={styles.container}
      />
    );
  }
}

export default NavBar;
