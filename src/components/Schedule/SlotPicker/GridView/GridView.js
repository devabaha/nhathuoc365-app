import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  FlatList,
} from 'react-native';

class GridView extends Component {
  static propTypes = {};

  static defaultProps = {
    numColumn: 3,
    horizontal: false,
  };

  state = {
    componentWidth: null,
  };

  handleLayout = (e) => {
    this.setState({componentWidth: e.nativeEvent.layout.width});
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
            3,
        };
        temp.push(
          <TouchableHighlight
            key={index}
            onPress={() => this.props.onPress(slot)}
            underlayColor="rgba(0,0,0,.1)"
            style={[styles.itemContainer, extraItemStyle]}>
            <Text>{slot}</Text>
          </TouchableHighlight>,
        );
        if (
          (index + 1) % this.props.numColumn === 0 ||
          index === this.props.slots.length - 1
        ) {
          const isLastRow = index === this.props.slots.length - 1;
          const extraRowStyle = {
            marginBottom: isLastRow ? 0 : 5,
          };
          slots.push(
            <View key={index} style={[styles.row, extraRowStyle]}>
              {temp}
            </View>,
          );
          temp = [];
        }
      });
    }

    return slots;
  }

  getHorizontalSlotsData = () => {
    let maxItemsPerRow = Math.ceil(
      (this.props.slots?.length || 0) / this.props.numColumn,
    );
    let data = [];

    for (let i = 0; i < maxItemsPerRow; i++) {
      let tempData = [];
      for (let j = 0; j < this.props.numColumn; j++) {
        let blockSlot = this.props.slots[i + j * maxItemsPerRow];
        if (blockSlot) {
          tempData.push(blockSlot);
        }
      }
      data.push(tempData);
    }

    return data;
  };

  renderBlockSlot = ({item: blockSlot}) => {
    return (
      <View style={styles.blockSlotContainer}>
        {blockSlot.map((slot, index) => {
          return (
            <TouchableHighlight
              key={index}
              onPress={() => this.props.onPress(slot)}
              underlayColor="rgba(0,0,0,.1)"
              style={[styles.itemContainer, styles.blockSlot]}>
              <Text>{slot}</Text>
            </TouchableHighlight>
          );
        })}
      </View>
    );
  };

  renderHorizontalSlots = () => {
    const horizontalSlots = this.getHorizontalSlotsData();

    return (
      <FlatList
        horizontal
        data={horizontalSlots}
        renderItem={this.renderBlockSlot}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={this.props.contentContainerStyle}
      />
    );
  };

  render() {
    return (
      <View
        onLayout={this.handleLayout}
        style={[styles.container, this.props.containerStyle]}>
        {this.props.horizontal
          ? this.renderHorizontalSlots()
          : this.renderSlots()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderColor: DEFAULT_COLOR,
    borderWidth: 1,
    borderRadius: 7,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },

  blockSlotContainer: {
    marginRight: 10,
  },
  blockSlot: {
    marginBottom: 10,
  },
});

export default GridView;
