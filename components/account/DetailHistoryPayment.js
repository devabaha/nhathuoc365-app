import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableHighlight
} from "react-native";

import store from "../../store/Store";
import { reaction } from "mobx";
import HorizontalInfoItem from "./HorizontalInfoItem";
import { Actions, ActionConst } from "react-native-router-flux";
import Moment from "moment";

@observer
export default class DetailHistoryPayment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sections: [
        {
          id: "id_section_1",
          data: [
            {
              id: "ma_giao_dich",
              title: "Mã giao dịch",
              value: this.props.transaction_hash
            },
            {
              id: "thoi_gian",
              title: "Thời gian",
              value: Moment(new Date(this.props.created)).format(
                "HH:mm - DD/MM/YYYY"
              )
            }
          ]
        },
        {
          id: "id_section_2",
          data: [
            {
              id: "noi_dung",
              title: "Nội dung",
              value: this.props.content
            }
          ]
        },
        {
          id: "id_section_3",
          data: [
            {
              id: "thay_doi",
              title: "Thay đổi",
              value: this.props.amount_view,
              specialColor: "green"
            }
          ]
        }
      ]
    };
  }

  componentDidMount() {}

  _renderSectionSeparator = () => {
    return <View style={styles.separatorSection} />;
  };

  _renderItemSeparator = () => {
    return <View style={styles.separatorItem} />;
  };

  _renderItems = ({ item, index, section }) => {
    return <HorizontalInfoItem data={item} />;
  };

  render() {
    return (
      <View style={styles.container}>
        <SectionList
          style={{ flex: 1 }}
          renderItem={this._renderItems}
          SectionSeparatorComponent={this._renderSectionSeparator}
          ItemSeparatorComponent={this._renderItemSeparator}
          sections={this.state.sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0,
    width: "100%",
    backgroundColor: "#EFEFF4"
  },

  separatorSection: {
    width: "100%",
    height: 5
  },

  separatorItem: {
    height: 1,
    backgroundColor: "#EFEFF4"
  },

  rightBtnEdit: {
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0
  },

  txtEdit: {
    fontSize: 14,
    color: "white"
  }
});
