import React, {memo, useMemo} from 'react';
import {Platform, StyleSheet} from 'react-native';
// 3-party libs
import {Edge, SafeAreaView} from 'react-native-safe-area-context';
// types
import {NavBarWrapperProps} from '.';
// configs
import appConfig from 'app-config';
// custom components
import Container from '../Container';

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
  },
  appNavBar: {
    ...Platform.select({
      ios: {
        height: 64 + (appConfig.device.isIphoneX ? 24 : 0),
      },
      default: {
        height: 54,
      },
    }),
  },
  safeAreaContainer: {
    width: '100%',
  },
  fullLayout: {
    height: '100%',
  },
});

const NavBarWrapper = ({
  containerStyle,
  appNavBar = true,
  children,

  renderBackground,
  ...props
}: NavBarWrapperProps) => {
  const edges: Array<Edge> = useMemo(() => {
    return ['top', 'left', 'right'];
  }, []);

  return (
    <Container
      {...props}
      style={[styles.container, appNavBar && styles.appNavBar, containerStyle]}>
      <SafeAreaView
        style={[styles.safeAreaContainer, appNavBar && styles.fullLayout]}
        edges={edges}>
        {children}
      </SafeAreaView>
    </Container>
  );
};

export default memo(NavBarWrapper);
