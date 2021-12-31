import React, {Component} from 'react';
import {StyleSheet, View} from 'react-native';
// helpers
import {getTheme} from 'src/Themes/Theme.context';
// context
import {ThemeContext} from 'src/Themes/Theme.context';
// constants
import {AppOutlinedButton, TypographyType} from 'src/components/base';
// custom components
import {FlatList, TextButton} from 'src/components/base';

const MIN_ITEMS_PER_ROW = 5;
const MIN_WIDTH_HORIZONTAL_SLOT = 100;

class GridView extends Component {
  static contextType = ThemeContext;

  static propTypes = {};

  static defaultProps = {
    numColumn: 3,
    horizontal: false,
    onPress: () => {},
    selectedSlot: undefined,
  };

  state = {
    componentWidth: null,
    horizontalSlots: [],
  };
  maxItemsPerRow = MIN_ITEMS_PER_ROW;
  listHorizontal = React.createRef();

  isInitScroll = false;

  get theme() {
    return getTheme(this);
  }

  getSlotValue(slot) {
    return slot?.value || slot;
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      (nextProps.slots !== this.props.slots ||
        nextProps.numColumn !== this.props.numColumn) &&
      nextProps.horizontal
    ) {
      const horizontalSlots = this.getHorizontalSlotsData(
        nextProps.slots,
        nextProps.numColumn,
      );
      this.setState({horizontalSlots});
    }
    return true;
  }

  componentDidMount() {
    if (this.props.horizontal) {
      const horizontalSlots = this.getHorizontalSlotsData();
      this.setState({horizontalSlots});
    }
  }

  handleInitScroll = () => {
    if (
      !this.isInitScroll &&
      this.props.horizontal &&
      this.props.selectedSlot &&
      this.listHorizontal.current
    ) {
      this.isInitScroll = true;
      let index = -1;
      this.state.horizontalSlots.forEach((blockSlot, i) =>
        blockSlot.findIndex((slot) => {
          const isSelected =
            this.getSlotValue(slot) ===
            this.getSlotValue(this.props.selectedSlot);
          if (isSelected) {
            index = i;
          }
          return isSelected;
        }),
      );
      if (index > 0) {
        setTimeout(() => {
          if (this.listHorizontal.current) {
            this.listHorizontal.current.scrollToIndex({index: index - 1});
          }
        }, 500);
      }
    }
  };

  handleLayout = (e) => {
    this.setState({componentWidth: e.nativeEvent.layout.width});
  };

  renderSlots() {
    const slots = [];
    let temp = [];

    if (this.state.componentWidth) {
      this.props.slots.map((slot, index) => {
        const marginRight = 10;
        const isMostRightItem = (index + 1) % this.props.numColumn === 0;
        const extraItemStyle = {
          marginRight: isMostRightItem ? 0 : marginRight,
          width:
            (this.state.componentWidth -
              marginRight * (this.props.numColumn - 1)) /
            this.props.numColumn,
        };
        temp.push(this.renderSlot(slot, index, extraItemStyle));
        if (
          (index + 1) % this.props.numColumn === 0 ||
          index === this.props.slots.length - 1
        ) {
          const isLastRow = index === this.props.slots.length - 1;
          const extraRowStyle = {
            marginBottom: 10,
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

  getHorizontalSlotsData = (
    slots = this.props.slots,
    numColumn = this.props.numColumn,
  ) => {
    this.maxItemsPerRow = Math.max(
      Math.ceil((slots?.length || 0) / numColumn),
      MIN_ITEMS_PER_ROW,
    );

    let data = [];

    for (let i = 0; i < this.maxItemsPerRow; i++) {
      let tempData = [];
      for (let j = 0; j < numColumn; j++) {
        let blockSlot = slots[i + j * this.maxItemsPerRow];
        if (blockSlot) {
          tempData.push(blockSlot);
        }
      }
      if (tempData.length) {
        data.push(tempData);
      }
    }

    return data;
  };

  renderBlockSlot = ({item: blockSlot, index}) => {
    const isMinItemsPerRow =
      this.state.horizontalSlots?.length === MIN_ITEMS_PER_ROW;
    const extraContainerStyle = {
      marginRight: (index + 1) % this.maxItemsPerRow === 0 ? 0 : 10,
      minWidth: isMinItemsPerRow
        ? (this.state.componentWidth - 10 * (MIN_ITEMS_PER_ROW - 1)) /
          MIN_ITEMS_PER_ROW
        : Math.min(this.state.componentWidth / 5.5, MIN_WIDTH_HORIZONTAL_SLOT),
    };

    return (
      <View style={[styles.blockSlotContainer, extraContainerStyle]}>
        {blockSlot.map((slot, index) => {
          return this.renderSlot(slot, index, styles.blockSlot);
        })}
      </View>
    );
  };

  renderSlot = (slot, index, style = {}) => {
    const isDisabled = slot?.disabled;
    const isSelected =
      this.getSlotValue(slot) === this.getSlotValue(this.props.selectedSlot);

    return (
      <AppOutlinedButton
        key={index}
        primaryHighlight
        disabled={isDisabled}
        onPress={() => this.props.onPress(slot)}
        style={[
          styles.itemContainer,
          style,
          isSelected && this.slotSelectedContainerStyle,
        ]}
        titleStyle={[this.slotStyle, isSelected && this.slotSelectedStyle]}>
        {this.getSlotValue(slot)}
      </AppOutlinedButton>
    );
  };

  renderHorizontalSlots = () => {
    return (
      <FlatList
        ref={(inst) => {
          this.listHorizontal.current = inst;
          this.handleInitScroll();
        }}
        horizontal
        data={this.state.horizontalSlots}
        renderItem={this.renderBlockSlot}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={this.props.contentContainerStyle}
        onScrollToIndexFailed={() => {}}
      />
    );
  };

  get slotSelectedContainerStyle() {
    return {
      backgroundColor: this.theme.color.persistPrimary,
      borderColor: this.theme.color.persistPrimary,
    };
  }

  get slotStyle() {
    return {color: this.theme.color.textPrimary};
  }

  get slotSelectedStyle() {
    return {color: this.theme.color.onPersistPrimary};
  }

  render() {
    return (
      <View
        onLayout={this.handleLayout}
        style={[styles.container, this.props.containerStyle]}>
        {!!this.state.componentWidth &&
          (this.props.horizontal
            ? this.renderHorizontalSlots()
            : this.renderSlots())}
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
