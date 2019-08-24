import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from "react-native";

import lodash from "lodash";

export default class HorizontalInfoItem extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  _renderRightView = (input, select, value, defaultValue, specialColor) => {
    if (!input && !select) {
      return (
        <Text
          style={[
            styles.detailTitle,
            { color: specialColor ? specialColor : "black" }
          ]}
        >
          {value}
        </Text>
      );
    } else if (input) {
      return (
        <TextInput
          style={styles.detailTitle}
          value={value}
          placeholder={defaultValue}
        />
      );
    } else if (select) {
      return (
        <TouchableOpacity
          style={styles.btnSelect}
          onPress={this._onSelectValue}
        >
          <Text
            style={{
              fontSize: 14,
              color: lodash.isEmpty(value) ? "#989898" : "black"
            }}
          >
            {lodash.isEmpty(value) ? defaultValue : value}
          </Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  _onSelectValue = () => {};

  render() {
    const {
      data: { title, value, disable, input, select, defaultValue, specialColor }
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: disable ? "#EAF0F6" : "white" }
        ]}
      >
        <Text style={styles.title}>{title}</Text>
        {this._renderRightView(
          input,
          select,
          value,
          defaultValue,
          specialColor
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 15
  },

  title: {
    fontSize: 14,
    color: "#989898",
    marginLeft: 20,
    textAlign: "left",
    flex: 0.4
  },

  detailTitle: {
    flex: 0.6,
    fontSize: 14,
    color: "black",
    marginRight: 20,
    textAlign: "right"
  },

  btnSelect: {
    flex: 0.6,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "flex-end"
  }
});
