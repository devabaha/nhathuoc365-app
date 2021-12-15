import React, {Component} from 'react';
import {View, StyleSheet, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
// constants
import {BOTTOM_SPACE_IPHONE_X} from '../../constants';
// custom components
import {Container, FlatList} from 'src/components/base';
import Pin from './Pin';

class PinList extends Component {
  static propTypes = {
    data: PropTypes.array,
    services: PropTypes.array,
    pinList: PropTypes.array,
    pinListNotify: PropTypes.object,
    onPinPress: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    animatedEffectValue: PropTypes.any,
    visible: PropTypes.bool,
    baseViewHeight: PropTypes.number,
    extraHeight: PropTypes.number,
    itemsPerRow: PropTypes.number,
  };

  static defaultProps = {
    visible: false,
    baseViewHeight: 0,
    itemsPerRow: 4,
    data: [],
    services: [],
    pinList: [],
    pinListNotify: {},
    animatedEffectValue: 0,
    containerStyle: {},
    onPinPress: () => {},
  };

  state = {};
  refPinList = React.createRef();

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.visible !== this.props.visible && !nextProps.visible) {
      if (this.refPinList.current) {
        this.refPinList.current.scrollToOffset({animated: false, offset: 0});
      }
    }

    if (nextState !== this.state) {
      return true;
    }

    if (
      nextProps.visible !== this.props.visible ||
      nextProps.pinList !== this.props.pinList ||
      nextProps.pinListNotify !== this.props.pinListNotify ||
      nextProps.itemsPerRow !== this.props.itemsPerRow ||
      nextProps.baseViewHeight !== this.props.baseViewHeight ||
      nextProps.extraHeight !== this.props.extraHeight ||
      nextProps.containerStyle !== this.props.containerStyle
    ) {
      return true;
    }

    return false;
  }

  render() {
    console.log('^^^^^^^ render pinlist');
    const extraProps = {
      zIndex: this.props.visible ? 1 : 0,
      paddingBottom: BOTTOM_SPACE_IPHONE_X,
      transform: [{translateY: this.props.animatedEffectValue}],
    };

    return (
      <Container
        animated
        pointerEvents={this.props.visible ? 'auto' : 'none'}
        onStartShouldSetPanResponderCapture={() => !this.props.visible}
        style={[styles.container, extraProps, this.props.containerStyle]}>
        <View
          style={{
            height:
              this.props.baseViewHeight +
              BOTTOM_SPACE_IPHONE_X +
              this.props.extraHeight,
            // (HAS_NOTCH ? ANDROID_EXTRA_DIMENSIONS_HEIGHT : 0)
          }}>
          <FlatList
            ref={this.refPinList}
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            data={this.props.pinList}
            extraData={this.props.pinListNotify}
            ListFooterComponent={<View style={{paddingTop: 45}} />}
            renderItem={({item: pin}) => {
              let notify = Object.keys(this.props.pinListNotify).find(
                (type) => pin.type === type,
              );
              notify = notify ? this.props.pinListNotify[notify] : 0;

              return (
                <Pin
                  pin={pin}
                  notify={notify}
                  onPress={() => this.props.onPinPress(pin)}
                  itemsPerRow={this.props.itemsPerRow}
                />
              );
            }}
            keyExtractor={(item) => item.type}
            numColumns={this.props.itemsPerRow}
          />
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 12,
    position: 'absolute',
  },
});

export default PinList;
