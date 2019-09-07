import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableHighlight,
  Alert
} from "react-native";

import store from "../../store/Store";
import { reaction } from "mobx";
import HorizontalInfoItem from "./HorizontalInfoItem";
import { Actions, ActionConst } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ActionSheet from "react-native-actionsheet";
import lodash from "lodash";
import Loading from "../Loading";

@observer
export default class EditProfile extends Component {
  constructor(props) {
    super(props);

    const { userInfo } = this.props;

    this.state = {
      loading: false,
      sections: [
        {
          id: "id_section_1",
          data: [
            {
              id: "ho_ten",
              title: "Họ & tên",
              value: userInfo.name,
              input: true
            },
            {
              id: "so_dien_thoai",
              title: "Số điện thoại",
              value: "0983 962 301",
              disable: true
            }
          ]
        },
        {
          id: "id_section_2",
          data: [
            {
              id: "ngay_sinh",
              title: "Ngày sinh",
              value: userInfo.birth,
              defaultValue: "Chọn ngày sinh",
              select: true
            },
            {
              id: "gioi_tinh",
              title: "Giới tính",
              value: userInfo.gender,
              defaultValue: "Chọn giới tính",
              select: true
            },
            {
              id: "email",
              title: "Email",
              value: userInfo.email,
              input: true
            }
          ]
        },
        {
          id: "id_section_3",
          data: [
            {
              id: "dia_chi",
              title: "Địa chỉ cụ thể",
              value: "PHÒNG 914",
              input: true
            }
          ]
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
        onPress={this._onSaveProfile}
      >
        <Text style={styles.txtEdit}>Lưu</Text>
      </TouchableHighlight>
    );
  }

  _onSaveProfile = async () => {
    let name = "";
    let email = "";
    let birth = "";
    let address = "";
    let gender = "";
    let errorMessage = "";

    this.state.sections.forEach(element => {
      element.data.forEach(item => {
        if (item.id === "ho_ten") {
          name = item.value;
        } else if (item.id === "ngay_sinh") {
          birth = item.value;
        } else if (item.id === "gioi_tinh") {
          gender = item.value;
        } else if (item.id === "email") {
          email = item.value;
        } else if (item.id === "dia_chi") {
          address = item.value;
        }
      });
    });

    if (lodash.isEmpty(name)) {
      errorMessage = "Hãy điền tên của bạn";
    } else if (lodash.isEmpty(email)) {
      errorMessage = "Hãy điền email của bạn";
    } else if (!this._is_email(email)) {
      errorMessage = "Email của bạn không đúng định dạng";
    } else if (lodash.isEmpty(address)) {
      errorMessage = "Hãy điền địa chỉ của bạn";
    }

    if (!lodash.isEmpty(errorMessage)) {
      return Alert.alert(
        "Thông báo",
        errorMessage,
        [
          {
            text: "Đồng ý"
          }
        ],
        { cancelable: false }
      );
    }

    const param = {
      name: name,
      email: email,
      birth: birth,
      address: address,
      gender: gender
    };

    this.setState({ loading: true }, async () => {
      try {
        var response = await APIHandler.user_update_profile(param);
        this.setState({ loading: false });

        if (response && response.status == STATUS_SUCCESS) {
          Actions._account({ type: ActionConst.REFRESH });
        }

        if (response) {
          Toast.show(response.message, Toast.SHORT);
        }
      } catch (e) {
        this.setState({ loading: false });
        console.log(e + " user_update_profile");
      }
    });
  };

  _is_email = str => {
    const regexp = /\S+[a-z0-9]@[a-z0-9\.]+/gim;
    if (regexp.test(str)) {
      return true;
    } else {
      return false;
    }
  };

  _renderSectionSeparator = () => {
    return <View style={styles.separatorSection} />;
  };

  _renderItemSeparator = () => {
    return <View style={styles.separatorItem} />;
  };

  _renderItems = ({ item, index, section }) => {
    return (
      <HorizontalInfoItem
        data={item}
        onChangeInputValue={this._onChangeInputValue}
        onSelectedValue={this._onSelectedValue}
        onSelectedDate={this._onSelectedDate}
      />
    );
  };

  _onSelectedDate = date => {
    this._onUpdateSections("ngay_sinh", date);
  };

  _onChangeInputValue = (data, value) => {
    this._onUpdateSections(data.id, value);
  };

  _onSelectedValue = data => {
    if (data.id === "gioi_tinh") {
      if (this.actionSheet) {
        this.actionSheet.show();
      }
    }
  };

  _onChangeGender = value => {
    this._onUpdateSections("gioi_tinh", value);
  };

  _onUpdateSections = (id, value) => {
    let _sections = [...this.state.sections];
    _sections.forEach(element => {
      element.data.forEach(item => {
        if (item.id === id) {
          item.value = value;
        }
      });
    });

    this.setState({ sections: _sections });
  };

  render() {
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView style={styles.mainScroll}>
          <SectionList
            style={{ flex: 1 }}
            renderItem={this._renderItems}
            SectionSeparatorComponent={this._renderSectionSeparator}
            ItemSeparatorComponent={this._renderItemSeparator}
            sections={this.state.sections}
            keyExtractor={(item, index) => `${item.title}-${index}`}
          />
        </KeyboardAwareScrollView>
        <ActionSheet
          ref={ref => (this.actionSheet = ref)}
          options={["Nữ", "Nam", "Huỷ"]}
          cancelButtonIndex={2}
          onPress={index => {
            if (index !== 2) {
              this._onChangeGender(index === 1 ? "Nam" : "Nữ");
            }
          }}
        />
        {this.state.loading == true && <Loading center />}
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
  },

  mainScroll: {
    flex: 1
  }
});
