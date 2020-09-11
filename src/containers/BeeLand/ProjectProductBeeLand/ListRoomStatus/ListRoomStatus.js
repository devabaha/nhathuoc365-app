import React, { Component } from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0,0,0,.6)'
  },
  container: {
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});

class ListRoomStatus extends Component {
  state = {};

  renderStatus() {
    return this.props.data.map((status, index) => {
      const extraStyle = {
        paddingLeft: index !== 0 ? 10 : 0,
        paddingRight: index !== this.props.data.length - 1 ? 10 : 0,
        borderRightWidth: index !== this.props.data.length - 1 ? 1 : 0,
        borderColor: '#fff'
      };
      return (
        <View style={[styles.statusContainer, extraStyle]}>
          <Text style={[styles.title, { color: status.color }]}>
            {status.name}
          </Text>
        </View>
      );
    });
  }

  render() {
    return (
      <View>
        <ScrollView
          style={styles.wrapper}
          contentContainerStyle={styles.container}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {this.renderStatus()}
        </ScrollView>
      </View>
    );
  }
}

export default ListRoomStatus;
