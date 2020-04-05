import React, { Component } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Button from '../../../components/Button';
import SlidingView from './SlidingView';

class ComboSlidingButton extends Component {
  static defaultProps = {
    selectedItems: [],
    data: [],
    onFinishAnimation: () => {}
  };

  state = {};

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState !== this.state) {
      return true;
    }
    if (nextProps !== this.props) {
      return true;
    }

    return false;
  }

  componentDidMount() {}

  renderElement() {
    return this.props.data.map(item => {
      return (
        <SlidingView
          key={item.id}
          style={styles.animatedView}
          slide={this.props.selectedItems.includes(item.id)}
          onFinishAnimation={isClosed =>
            this.props.onFinishAnimation(item, isClosed)
          }
        >
          {item.view}
        </SlidingView>
      );
    });
  }

  render() {
    const extraStyle = this.state.containerHeight && {
      height: this.state.containerHeight
    };
    return (
      <View
        style={[styles.container, extraStyle, this.props.comboContainerStyle]}
      >
        {this.renderElement()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }
});

export default ComboSlidingButton;
