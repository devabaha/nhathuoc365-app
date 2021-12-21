import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
// types
import {SkeletonLoadingProps} from '.';
// custom components
import {Skeleton} from 'src/components/base';
import Highlight from './Highlight';

const styles = StyleSheet.create({
  container: {
    // backgroundColor: SKELETON_COLOR,
    overflow: 'hidden',
  },
});

class SkeletonLoading extends Component<SkeletonLoadingProps> {
  static defaultProps = {
    loading: true,
  };

  state = {
    width: 0,
    height: 0,
  };

  handleContainerLayout = (e) => {
    const {width, height} = e.nativeEvent.layout;
    this.setState({
      width,
      height,
    });
  };

  render() {
    const {
      loading,
      children,
      style,
      backgroundColor,
      foregroundColor,
      start,
      end,
      highlightMainDuration,
      highlightColor,
      highlightOpacity,
      ...props
    } = this.props;

    const {width, height} = this.state;
    const highlightWidth = width * 0.8;

    return (
      <>
        {loading ? (
          <Skeleton
            pointerEvents="none"
            onLayout={this.handleContainerLayout}
            style={[styles.container, style]}
            {...props}>
            {!!width && (
              <Highlight
                width={highlightWidth}
                height="100%"
                start={-highlightWidth}
                end={width + highlightWidth}
                highlightMainDuration={highlightMainDuration}
                highlightColor={highlightColor}
                highlightOpacity={highlightOpacity}
              />
            )}
          </Skeleton>
        ) : (
          children
        )}
      </>
    );
  }
}

export default SkeletonLoading;
