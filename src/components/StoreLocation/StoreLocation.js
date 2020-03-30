import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View } from 'react-native';
import Location from './Location';

class StoreLocation extends PureComponent {
  state = {
    componentWidth: null
  };

  onLayout(e) {
    this.setState({ componentWidth: e.nativeEvent.layout.width / 2 });
  }

  renderLocations() {
    let locations = [],
      row = [];
    this.props.locations.forEach((location, index) => {
      const isLastOfRow = (index + 1) % this.props.numColumn === 0;
      const locationStyle = this.state.componentWidth && {
        width: this.state.componentWidth,
        height: this.state.componentWidth,
        padding: 15
      };
      row.push(
        <View key={index} style={[locationStyle]}>
          <Location
            image={location.image}
            name={location.name}
            onPress={() => this.props.onPressLocation(location)}
          />
        </View>
      );

      if (isLastOfRow || index === this.props.locations.length - 1) {
        locations.push(
          <View key={index} style={styles.locationContainer}>
            {row}
          </View>
        );
        row = [];
      }
    });

    return locations;
  }

  render() {
    return (
      <SafeAreaView
        onLayout={this.onLayout.bind(this)}
        style={styles.container}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ flexGrow: 1 }}
          scrollEventThrottle={16}
        >
          {this.renderLocations()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollView: {
    paddingVertical: 15
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default StoreLocation;
