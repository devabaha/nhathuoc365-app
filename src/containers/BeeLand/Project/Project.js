import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
      [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 },
        { value: 6 },
        { value: 7 }
      ],
      [
        {
          value: 0,
          cellProps: {
            style: { width: '100%' },
            containerStyle: { width: '100%', transform: [{ translateX: 0 }] }
          }
        }
      ]
    ],
    position: 'top'
    // cellsProps: { disabled: true },
    // containerStyle: {flex: 1}
    // style
  },
  {
    data: [
      { value: 0 },
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 }
    ],
    position: 'left'
    // cellsProps: { disabled: true }
    // containerStyle
    // style
  }
  // {
  //   data: [
  //     { value: 0 },
  //     { value: 1 },
  //     { value: 2 },
  //     { value: 3 },
  //     { value: 4 },
  //     { value: 5 },
  //     { value: 6 },
  //     { value: 7 }
  //   ],
  //   position: 'bottom'
  //   // cellsProps: { disabled: true }
  //   // containerStyle
  //   // style
  // },
  // {
  //   data: [
  //     { value: 1 },
  //     { value: 2 },
  //     { value: 3 },
  //     { value: 4 },
  //     { value: 5 },
  //     { value: 6 },
  //     { value: 7 },
  //     { value: 8 },
  //     { value: 9 },
  //     { value: 10 }
  //   ],
  //   position: 'right'
  //   // cellsProps: { disabled: true },
  //   // containerStyle
  //   // style
  // }
];

const cellData = [
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ],
  [
    { data: { value: 1 } },
    { data: { value: 2 } },
    { data: { value: 3 } },
    { data: { value: 4 } },
    { data: { value: 5 } },
    { data: { value: 6 } }
  ]
];

class Project extends Component {
  state = {};

  renderHeadingItem(heading, index) {
    return (
      <View
        key={index}
        style={{
          borderWidth: 1,
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          backgroundColor: 'pink'
        }}
      >
        <Text>{heading.value}</Text>
        <Icon name="plus" />
      </View>
    );
  }

  renderCellItem(cell, index) {
    return (
      <View key={index} style={{ borderWidth: 1, flex: 1 }}>
        <Text>{cell.data.value}</Text>
        <Icon name="minus" />
      </View>
    );
  }

  render() {
    return (
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
