import React, {PureComponent} from 'react';
import {StyleSheet, View} from 'react-native';
// custom components
import {ScreenWrapper, ScrollView} from 'src/components/base';
import Location from './Location';

class StoreLocation extends PureComponent {
  state = {
    componentWidth: null,
  };

  onLayout(e) {
    this.setState({componentWidth: e.nativeEvent.layout.width / 2});
  }

  renderLocations() {
    let locations = [],
      row = [];
    this.props.locations.forEach((location, index) => {
      const isLastOfRow = (index + 1) % this.props.numColumn === 0;
      const locationStyle = this.state.componentWidth && {
        width: this.state.componentWidth,
        height: this.state.componentWidth,
        padding: 15,
      };
      row.push(
        <View key={index} style={locationStyle}>
          <Location
            image={location.image}
            name={location.name}
            onPress={() => this.props.onPressLocation(location)}
          />
        </View>,
      );

      if (isLastOfRow || index === this.props.locations.length - 1) {
        locations.push(
          <View key={index} style={styles.locationContainer}>
            {row}
          </View>,
        );
        row = [];
      }
    });

    return locations;
  }

  render() {
    return (
      <View style={styles.container} onLayout={this.onLayout.bind(this)}>
        {this.renderLocations()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default StoreLocation;
