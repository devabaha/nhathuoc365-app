import React from 'react';
import PropTypes from 'prop-types';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { StatusBarEntity } from './state';

const connector = connect(
  state => ({
    statusBar: StatusBarEntity.fromState(state)
  }),
  null
);

function TickIDStatusBar(props) {
  if (!props.statusBar.isShowStatusBar) {
    return null;
  }
  return (
    <TickIDStatusBarComponent
      barStyle={props.statusBar.data.barStyle}
      backgroundColor={props.statusBar.data.backgroundColor}
    />
  );
}

TickIDStatusBar.propTypes = {
  statusBar: PropTypes.instanceOf(StatusBarEntity).isRequired
};

function TickIDStatusBarComponent(props) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 20,
        zIndex: 0,
        backgroundColor: props.backgroundColor
      }}
    >
      <StatusBar barStyle={`${props.barStyle}-content`} animated={true} />
    </View>
  );
}

TickIDStatusBarComponent.propTypes = {
  barStyle: PropTypes.oneOf(['dark', 'light']),
  backgroundColor: PropTypes.string
};

export default connector(TickIDStatusBar);
