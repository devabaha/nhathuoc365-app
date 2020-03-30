import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import PropTypes from 'prop-types';

class GridView extends Component {
  static propTypes = {};

  static defaultProps = {
    numColumn: 3
  };

  state = {
    componentWidth: null
  };

  handleLayout = e => {
    this.setState({ componentWidth: e.nativeEvent.layout.width });
  };

  renderSlots() {
    const slots = [];
    let temp = [];

    if (this.state.componentWidth) {
      this.props.slots.map((slot, index) => {
        const marginRight = 5;
        const isMostRightItem = (index + 1) / this.props.numColumn === 0;
        const extraItemStyle = {
          marginRight: isMostRightItem ? 0 : marginRight,
          width:
            (this.state.componentWidth -
              marginRight * (this.props.numColumn - 1)) /
              this.props.numColumn -
            3
        };
        temp.push(
          <TouchableHighlight
            onPress={() => this.props.onPress(slot)}
            underlayColor="rgba(0,0,0,.1)"
            style={[styles.itemContainer, extraItemStyle]}
          >
            <Text>{slot}</Text>
          </TouchableHighlight>
        );
        if (
          (index + 1) % this.props.numColumn === 0 ||
          index === this.props.slots.length - 1
        ) {
          const isLastRow = index === this.props.slots.length - 1;
          const extraRowStyle = {
            marginBottom: isLastRow ? 0 : 5
          };
          slots.push(<View style={[styles.row, extraRowStyle]}>{temp}</View>);
          temp = [];
        }
      });
    }

    return slots;
  }

  render() {
    return (
      <View
        onLayout={this.handleLayout}
        style={[styles.container, this.props.containerStyle]}
      >
        {this.renderSlots()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: DEFAULT_COLOR,
    borderWidth: 1,
    borderRadius: 7
  },
  row: {
    flexDirection: 'row',
    flex: 1
  }
});

export default GridView;
