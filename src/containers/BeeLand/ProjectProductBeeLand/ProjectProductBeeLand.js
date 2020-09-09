import React, { Component } from 'react';
import ScheduleTable from '../../../components/ScheduleTable';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';
import NoResult from '../../../components/Loading';
import Icon from 'react-native-vector-icons/FontAwesome';
import APIHandler from '../../../network/APIHandler';
import { APIRequest } from '../../../network/Entity';
import Loading from '../../../components/Loading';
import appConfig from 'app-config';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BuildingSelector from './BuildingSelector/BuildingSelector';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noResult: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  scheduleTableWrapper: {
    borderBottomColor: '#aaa',
    borderBottomWidth: 0.5
  },
  headingItem: {
    borderColor: '#aaa',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headingText: {
    fontWeight: '500'
  },
  cellItem: {
    margin: 7,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 7
  },
  cellText: {
    color: '#333'
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
      ]
      //   [
      //     {
      //       value: 0,
      //       cellProps: {
      //         style: { width: '100%' },
      //         containerStyle: { width: '100%', transform: [{ translateX: 0 }] }
      //       }
      //     }
      //   ]
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
      { value: 7 }
    ],
    position: 'bottom'
    // cellsProps: { disabled: true }
    // containerStyle
    // style
  },
  {
    data: [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
      { value: 6 },
      { value: 7 },
      { value: 8 },
      { value: 9 },
      { value: 10 }
    ],
    position: 'right'
    // cellsProps: { disabled: true },
    // containerStyle
    // style
  }
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

const CELL_WIDTH = (CELL_HEIGHT = 100);
const CELL_DIMENSIONS = { width: CELL_WIDTH, height: CELL_HEIGHT };
const TOP_HEADING_DIMENSIONS = { width: CELL_WIDTH, height: CELL_HEIGHT / 2 };
const LEFT_HEADING_DIMENSIONS = { width: CELL_WIDTH / 2, height: CELL_HEIGHT };
const TOP_LEFT_CORNER_HEADING_DIMENSIONS = {
  width: LEFT_HEADING_DIMENSIONS.width,
  height: TOP_HEADING_DIMENSIONS.height
};

class ProjectProductBeeLand extends Component {
  state = {
    loading: true,
    heading: headingData,

    buildingCode: null,
    listBuilding: null,
    listHeadingData: null,
    listCellData: null
  };
  getListRoomRequest = new APIRequest();
  requests = [this.getListRoomRequest];

  componentDidMount() {
    this.getListRoom();
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  async getListRoom() {
    const { t } = this.props;
    const data = {
      project_code: this.props.projectCode,
      building_code: this.state.buildingCode
    };
    try {
      this.getListRoomRequest.data = APIHandler.user_list_room_beeland(data);
      const response = await this.getListRoomRequest.promise();
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.handleListRoomResponseData(response.data);
        } else {
          flashShowMessage({
            type: 'danger',
            message: response.message || t('api.error.message')
          });
        }
      } else {
        flashShowMessage({
          type: 'danger',
          message: t('api.error.message')
        });
      }
    } catch (err) {
      console.log('get_list_room_bee_land', err);
      flashShowMessage({
        type: 'danger',
        message: t('api.error.message')
      });
    } finally {
      this.setState({
        loading: false
      });
    }
  }

  handleListRoomResponseData(data) {
    const listHeadingData = this.normalizeHeadingData(
      [
        {
          cellProps: {
            cellDimensions: TOP_LEFT_CORNER_HEADING_DIMENSIONS
          }
        },
        ...Object.values(data.list_position)
      ],
      null,
      null,
      Object.values(data.list_floor)
    );
    const listCellData = this.normalizeCellData(Object.values(data.list_room));
    const listBuilding = Object.values(data.list_building);
    this.setState({
      buildingCode: listBuilding[0] ? listBuilding[0].code : null,
      listBuilding: Object.values(data.list_building),
      listHeadingData,
      listCellData
    });
  }

  normalizeHeadingData(topData, rightData, bottomData, leftData) {
    const data = [];
    if (topData) {
      data.push({
        data: topData.map(data => ({
          cellProps: {
            cellDimensions: TOP_HEADING_DIMENSIONS,
            disabled: true,
            ...data.cellProps
          },
          ...data
        })),
        position: 'top'
      });
    }
    if (rightData) {
      data.push({
        data: rightData.map(data => ({
          cellProps: {
            disabled: true,
            ...data.cellProps
          },
          ...data
        })),
        position: 'right'
      });
    }
    if (bottomData) {
      data.push({
        data: bottomData.map(data => ({
          cellProps: {
            disabled: true,
            ...data.cellProps
          },
          ...data
        })),
        position: 'bottom'
      });
    }
    if (leftData) {
      data.push({
        data: leftData.map(data => ({
          cellProps: {
            cellDimensions: LEFT_HEADING_DIMENSIONS,
            disabled: true,
            ...data.cellProps
          },
          ...data
        })),
        position: 'left'
      });
    }
    console.log(data, headingData);

    return data;
  }

  normalizeCellData(rawData) {
    const data = rawData.map(cell => {
      return Object.values(cell).map(item => {
        return {
          data: item || {},
          disabled: !!!item || item.status_code !== 2
        };
      });
    });
    console.log(data, cellData);

    return data;
  }

  handleCellPress = (cell, cellIndex, row, rowIndex, e) => {};

  handleHeadingPress = (heading, index, e) => {
    console.log({ heading, index, e });
  };

  renderHeadingItem(heading, index, position) {
    return (
      <View
        style={{
          ...styles.headingItem,
          borderBottomWidth: position === 'top' ? 0.5 : 0,
          borderRightWidth: position === 'left' ? 0.5 : 0,
          backgroundColor: (position === 'top'
          ? index % 2 !== 0
          : index % 2 === 0)
            ? hexToRgbA(appConfig.colors.primary, 0.3)
            : '#f1f1f1'
        }}
      >
        <Text style={styles.headingText}>{heading.name}</Text>
      </View>
    );
  }

  renderCellItem(cell, cellIndex, row, rowIndex) {
    return (
      <View
        style={{
          ...styles.cellItem,
          backgroundColor: cell.data.color || '#eee'
        }}
      >
        <Text style={styles.cellText}>{cell.data.room_name}</Text>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {this.state.loading && <Loading center />}
        {!!this.state.listBuilding && (
          <BuildingSelector buildings={this.state.listBuilding} />
        )}
        {!!this.state.listHeadingData && !!this.state.listCellData && (
          <ScheduleTable
            wrapperStyle={styles.scheduleTableWrapper}
            cellDimensions={CELL_DIMENSIONS}
            headingData={this.state.listHeadingData}
            cellData={this.state.listCellData}
            renderHeadingItem={this.renderHeadingItem.bind(this)}
            renderCellItem={this.renderCellItem.bind(this)}
            onCellPress={this.handleCellPress}
            onHeadingPress={this.handleHeadingPress}
          />
        )}
      </SafeAreaView>
    );
  }
}

export default withTranslation()(ProjectProductBeeLand);
