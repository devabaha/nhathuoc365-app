import React, { Component, useState } from 'react';
import { View, StyleSheet, ScrollView, Text, Dimensions } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {
  usePanGestureHandler,
  withDecay,
  diffClamp
} from 'react-native-redash';
import NoResult from '../../../components/Loading';
import ScheduleTable from '../../../components/ScheduleTable';
import Icon from 'react-native-vector-icons/FontAwesome';
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  scroll: {
    // flex: 1
  },
  contentScroll: {
    flexGrow: 1
  },
  noResult: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scrollBody: {
    zIndex: -2
  },
  contentBodyScroll: {
    // flexGrow: 1,
    // padding: 15
  }
});

const headingData = [
  {
    data: [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 }
    ],
    position: 'top',
    cellsProps: { disabled: true },
    cellStyle: { height: 50 }
    // containerStyle
    // style
  },
  {
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    position: 'left',
    cellsProps: { disabled: true }
    // containerStyle
    // style
  },
  {
    data: [0, 1, 2, 3, 4, 5, 6, 7],
    position: 'bottom',
    cellsProps: { disabled: true }
    // containerStyle
    // style
  },
  {
    data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    position: 'right',
    cellsProps: { disabled: true }
    // containerStyle
    // style
  }
];

const cellData = [
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [
    { data: 1 },
    { data: 2 },
    { data: 3 },
    { data: 4 },
    { data: 5 },
    { data: 6 }
  ],
  [{ data: 1 }, { data: 2 }, { data: 3 }, { data: 4 }, { data: 5 }, { data: 6 }]
];

class Project extends Component {
  state = {};

  renderHeadingItem(heading, index) {
    return (
      <View key={index} style={{ borderWidth: 1, flex: 1 }}>
        <Text>{heading.value !== undefined ? heading.value : heading}</Text>
        <Icon name="plus" />
      </View>
    );
  }

  renderCellItem(cell, index) {
    return (
      <View key={index} style={{ borderWidth: 1, flex: 1 }}>
        <Text>{cell.data}</Text>
        <Icon name="minus" />
      </View>
    );
  }

  render() {
    return (
      // <Testt />
      <View style={{ flex: 1 }}>
        <View
          onLayout={e => console.log(e.nativeEvent.layout)}
          style={{ flex: 1 }}
        >
          <ScheduleTable
            headingData={headingData}
            cellData={cellData}
            renderHeadingItem={this.renderHeadingItem}
            renderCellItem={this.renderCellItem}
          />
        </View>
      </View>
    );
  }
}

export default Project;

const Testt = ({
  topMenu = ['A', 'B', 'C', 'D', 'E', 'F'],
  sideMenu = ['G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
  mainData = [1, 2, 3, 4, 5, 6]
}) => {
  const boxWidth = 100;
  const { width: appWidth, height: appHeight } = Dimensions.get('screen');
  const [mainContentDimensions, setMainContentDimensions] = useState({
    width: 0,
    height: 0
  });
  const {
    gestureHandler,
    translation,
    velocity,
    state
  } = usePanGestureHandler();
  const translateX = diffClamp(
    withDecay({
      value: translation.x,
      velocity: velocity.x,
      state
    }),
    appWidth - mainContentDimensions.width,
    0
  );
  const translateY = diffClamp(
    withDecay({
      value: translation.y,
      velocity: velocity.y,
      state
    }),
    appHeight - mainContentDimensions.height,
    0
  );

  function handleMainContentLayout(e) {
    const { width, height } = e.nativeEvent.layout;
    setMainContentDimensions({ width, height });
    console.log(width);
  }

  function renderSideMenu() {
    const row = sideMenu.map((item, index) => {
      return (
        <View
          key={index}
          style={{
            width: boxWidth,
            height: boxWidth,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'pink'
          }}
        >
          <Text>{item}</Text>
        </View>
      );
    });

    return <View style={{}}>{row}</View>;
  }

  function renderTopMenu() {
    const row = topMenu.map((item, index) => {
      return (
        <View
          key={index}
          style={{
            width: boxWidth,
            height: boxWidth,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'gray'
          }}
        >
          <Text>{item}</Text>
        </View>
      );
    });

    return <View style={{ flexDirection: 'row' }}>{row}</View>;
  }

  function renderGrid(data) {
    const row = data.map((item, index) => {
      return (
        <Animated.View
          key={index}
          style={{
            width: boxWidth,
            height: boxWidth,
            justifyContent: 'center',
            alignItems: 'center',
            transform:
              index % 2 === 0 ? [{ translateX, translateY }] : undefined
          }}
        >
          <Text>{item}</Text>
        </Animated.View>
      );
    });

    return <View style={{ flexDirection: 'row' }}>{row}</View>;
  }

  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View>
        <Animated.View style={{ zIndex: 1, transform: [{ translateX }] }}>
          {renderTopMenu(topMenu)}
        </Animated.View>

        <Animated.View style={styles.container}>
          {/* {this.state.members.length === 0 && !this.state.loading ? (
                        <View style={styles.noResult}>
                            <NoResult
                                iconName="account-group"
                                message="Chưa có thành viên"
                            />
                        </View>
                    ) : ( */}
          <Animated.View style={{ transform: [{ translateY }] }}>
            {renderSideMenu()}
          </Animated.View>
          <Animated.View
            onLayout={handleMainContentLayout}
            // contentContainerStyle={{ flexGrow: 1 }}
            style={[
              styles.scrollBody,
              {
                transform: [{ translateX, translateY }]
              }
            ]}
          >
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
            {renderGrid(mainData)}
          </Animated.View>
          {/* )} */}
        </Animated.View>
      </Animated.View>
    </PanGestureHandler>
  );
};
