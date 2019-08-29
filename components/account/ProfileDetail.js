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

@observer
export default class ProfileDetail extends Component {
  constructor(props) {
    super(props);

    const { userInfo } = this.props;

    this.state = {
      sections: [
        {
          id: "id_section_1",
          data: [
            { id: "ho_ten", title: "Họ & tên", value: userInfo.name },
            {
              id: "so_dien_thoai",
              title: "Số điện thoại",
              value: userInfo.tel
            }
          ]
        },
        {
          id: "id_section_2",
          data: [
            { id: "ngay_sinh", title: "Ngày sinh", value: userInfo.birth },
            { id: "gioi_tinh", title: "Giới tính", value: userInfo.gender },
            { id: "email", title: "Email", value: userInfo.email }
          ]
        },
        {
          id: "id_section_3",
          data: [{ id: "dia_chi", title: "Địa chỉ", value: userInfo.address }]
        }
      ]
    };
  }

  componentDidMount() {
    Actions.refresh({
      renderRightButton: this._renderRightButton.bind(this)
    });
  }

  _renderRightButton() {
    return (
      <TouchableHighlight
        style={styles.rightBtnEdit}
        underlayColor="transparent"
        onPress={this._onShowEditProfile}
      >
        <Text style={styles.txtEdit}>Sửa</Text>
      </TouchableHighlight>
    );
  }

  _onShowEditProfile = () => {
    Actions.edit_profile({
      userInfo: this.props.userInfo
    });
  };

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
