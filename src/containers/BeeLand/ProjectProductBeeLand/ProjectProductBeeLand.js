import React, { Component } from 'react';
import ScheduleTable from '../../../components/ScheduleTable';
import { View, StyleSheet, Text, SafeAreaView } from 'react-native';

import NoResult from '../../../components/NoResult';
import Icon from 'react-native-vector-icons/FontAwesome';
import APIHandler from '../../../network/APIHandler';
import { APIRequest } from '../../../network/Entity';
import Loading from '../../../components/Loading';
import appConfig from 'app-config';
import store from 'app-store';
import BuildingSelector from './BuildingSelector';
import ListRoomStatus from './ListRoomStatus';
import ImgBackground from './ImgBackground';
import { Actions } from 'react-native-router-flux';
import NavBar from './NavBar';
import SkeletonLoading from '../../../components/SkeletonLoading';

const styles = StyleSheet.create({
  wrapper: {
    flex: 1
  },
  container: {
    flex: 1
  },
  loading: {
    backgroundColor: '#fafafa',
    borderRadius: 15,
    padding: 25
  },
  noResultWrapper: {
    top: '-5%',
    padding: 20,
    borderRadius: 20,
    backgroundColor: hexToRgbA('#242424', 0.85)
  },
  noResultTxt: {
    fontSize: 16,
    letterSpacing: 1,
    color: '#ccc',
    paddingBottom: 0
  },
  scheduleTableAreaContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.6)'
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
    borderRadius: 7,
    overflow: 'hidden'
  },
  cellIcon: {
    color: '#ccc',
    fontSize: 20
  },
  cellText: {
    color: '#333',
    textAlign: 'center',
    fontSize: 10
  },
  mask: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'transparent'
  },
  maskStatus: {
    position: 'absolute',
    borderRadius: 4,
    paddingHorizontal: 3,
    backgroundColor: hexToRgbA(appConfig.colors.primary, 1),
    top: 0,
    right: 0
  },
  maskStatusText: {
    fontSize: 8,
    color: '#fff',
    ...elevationShadowStyle(5)
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

const CELL_WIDTH = (CELL_HEIGHT = 60);
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
    selectedBuildingCode: undefined,

    listBuilding: null,
    listHeadingData: null,
    listCellData: null,
    listStatus: null,

    isBackgroundAnimating: true
  };
  getListRoomRequest = new APIRequest();
  requests = [this.getListRoomRequest];
  isForcingReloadFromStore = store.isProjectProductBeeLandReload;

  get hasScheduleTableData() {
    return (
      Array.isArray(this.state.listHeadingData) &&
      this.state.listHeadingData.length !== 0 &&
      Array.isArray(this.state.listCellData) &&
      this.state.listCellData.length !== 0
    );
  }

  componentDidMount() {
    this.getListRoom(this.state.selectedBuildingCode);
  }

  componentWillUnmount() {
    cancelRequests(this.requests);
  }

  async getListRoom(selectedBuildingCode) {
    const { t } = this.props;
    const data = {
      project_code: this.props.projectCode,
      building_code: selectedBuildingCode,
      id_code: this.props.staff.id_code,
      company_name: this.props.staff.company_name
    };
    try {
      this.getListRoomRequest.cancel();
      this.getListRoomRequest.data = APIHandler.user_list_room_beeland(data);
      const response = await this.getListRoomRequest.promise();
      store.forceReloadProjectProductBeeLand(false);
      console.log(response);
      if (response) {
        if (response.status === STATUS_SUCCESS && response.data) {
          this.handleListRoomResponseData(response.data, selectedBuildingCode);
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
        loading: false,
        isBackgroundAnimating: false
      });
    }
  }

  handleListRoomResponseData(data, selectedBuildingCode) {
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

    this.setState(prevState => ({
      selectedBuildingCode:
        prevState.selectedBuildingCode === undefined
          ? listBuilding[0]
            ? listBuilding[0].code
            : undefined
          : selectedBuildingCode,
      listBuilding,
      listHeadingData,
      listCellData,
      listStatus: data.list_status
    }));
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
    // console.log(data, headingData);

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
    // console.log(data, cellData);

    return data;
  }

  handleBuildingPress = building => {
    this.setState(
      {
        selectedBuildingCode: building.code,
        loading: true
      },
      () => {
        this.getListRoom(building.code);
      }
    );
  };

  handleCellPress = (cell, cellIndex, row, rowIndex, e) => {
    Actions.push(appConfig.routes.projectBeeLand, {
      siteId: this.props.siteId,
      room: cell.data,
      staff: this.props.staff,
      title: cell.data.room_name,
      tel: this.props.tel,
      buildingName: this.props.title
    });
  };

  handleHeadingPress = (heading, index, e) => {
    // console.log({ heading, index, e });
  };

  handleForcingReloadFromStore() {
    if (
      this.isProjectProductBeeLandReload !==
        store.isProjectProductBeeLandReload &&
      store.isProjectProductBeeLandReload
    ) {
      this.isProjectProductBeeLandReload = store.isProjectProductBeeLandReload;
      this.getListRoom(this.state.selectedBuildingCode);
    }

    this.isProjectProductBeeLandReload = store.isProjectProductBeeLandReload;
  }

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
    const disabled = cell.disabled;
    return (
      <View
        style={{
          ...styles.cellItem,
          backgroundColor: cell.data.color || '#eee'
        }}
      >
        <SkeletonLoading loading={!disabled} style={styles.mask} />
        {Object.keys(cell.data).length === 0 ? (
          <Icon name="lock" style={styles.cellIcon} />
        ) : (
          <Text style={styles.cellText}>{cell.data.price_billion_view}</Text>
        )}
      </View>
    );
  }

  renderScheduleLoading() {
    return (
      <Loading
        center
        containerStyle={styles.loading}
        color="#666"
        message="Đang xử lý..."
      />
    );
  }

  render() {
    this.handleForcingReloadFromStore();
    return (
      <>
        <ImgBackground
          source={require('../../../images/building_view.jpg')}
          blurRadius={
            this.state.loading && !this.state.listCellData
              ? appConfig.device.isAndroid
                ? 1
                : 5
              : 0
          }
          isAnimating={this.state.isBackgroundAnimating}
        />
        {this.state.loading && (
          <Loading
            wrapperStyle={{
              backgroundColor: 'rgba(0,0,0,.6)'
            }}
            center
            containerStyle={styles.loading}
            color="#666"
            message="Đang tải..."
          />
        )}
        <SafeAreaView style={styles.wrapper}>
          <NavBar title={this.props.title} />
          <View style={styles.container}>
            {!!this.state.listBuilding && (
              <BuildingSelector
                buildings={this.state.listBuilding}
                selectedCode={this.state.selectedBuildingCode}
                onPress={this.handleBuildingPress}
              />
            )}
            {!!this.state.listStatus && (
              <ListRoomStatus data={this.state.listStatus} />
            )}
            {this.hasScheduleTableData ? (
              <ScheduleTable
                wrapperStyle={styles.scheduleTableWrapper}
                cellDimensions={CELL_DIMENSIONS}
                headingData={this.state.listHeadingData}
                cellData={this.state.listCellData}
                renderHeadingItem={this.renderHeadingItem.bind(this)}
                renderCellItem={this.renderCellItem.bind(this)}
                renderLoading={this.renderScheduleLoading}
                onCellPress={this.handleCellPress}
                onHeadingPress={this.handleHeadingPress}
              />
            ) : (
              !this.state.loading && (
                <View style={styles.scheduleTableAreaContainer}>
                  <NoResult
                    wrapperStyle={styles.noResultWrapper}
                    icon={
                      <Icon name="exclamation-circle" size={72} color="#ccc" />
                    }
                    message="Không có dữ liệu"
                    textStyle={styles.noResultTxt}
                  />
                </View>
              )
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

export default withTranslation()(observer(ProjectProductBeeLand));
