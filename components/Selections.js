/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight
} from 'react-native';

// librarys
import {Actions, ActionConst} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from 'react-native-modalbox';
import _ from 'lodash';

export default class Selections extends Component {
  constructor(props) {
    super(props);

    this.state = {
      datas: props.datas
    }
  }

  _rowsOnpress(value) {
    if (this.props.onSelect) {
      this.props.onSelect(value);
    }
    if (this.ref_prod_sort) {
      this.ref_prod_sort.close();
    }
  }

  positionHandle = () => {
    var itemHeight = 48;
    var {datas, selected, height} = this.props;

    if (height && height >= 400) {
      var topSpace = 4;
      var bottomSpace = 5;
      var toEnd = false;
      var y = 0;

      var index = datas.indexOf(Number(selected) ? Number(selected) : selected);

      if (index < topSpace) {
        // on top 4
        return false;
      } else if ((datas.length - index) <= bottomSpace) {
        // on bottom 5
        toEnd = true;
      } else {
        y = index * itemHeight - itemHeight * topSpace;
      }

      clearTimeout(this.showTimer);
      this.showTimer = setTimeout(() => {
        if (this.ref_scroll) {
          if (toEnd) {
            this.ref_scroll.scrollToEnd({animated: true});
          } else {
            this.ref_scroll.scrollTo({x: 0, y, animated: true});
          }
        }
      }, 500);
    }
  }

  renderRows() {
    var views = [];
    var {datas} = this.state;

    if (datas) {
      datas.forEach((value, i) => {
        views.push(
          <TouchableHighlight
            key={i}
            underlayColor="transparent"
            onPress={this._rowsOnpress.bind(this, value)}>
            <View style={[styles.selectionRows, this.props.selected == (_.isObject(value) ? value.id : value) ? styles.selectionRowsSelected : null]}>
              <Text style={styles.selectionRowsValue}>{_.isObject(value) ? value.name : value}</Text>
            </View>
          </TouchableHighlight>
        );
      });
    } else {
      for(let i = this.props.start; i <= this.props.end; i++) {
        views.push(
          <TouchableHighlight
            key={i}
            underlayColor="transparent"
            onPress={this._rowsOnpress.bind(this, i)}>
            <View style={[styles.selectionRows, this.props.selected == i ? styles.selectionRowsSelected : null]}>
              <Text style={styles.selectionRowsValue}>{i}</Text>
            </View>
          </TouchableHighlight>
        );
      }
    }

    return views;
  }

  render() {
    return (
      <Modal
        ref={ref => {
          if (this.props.refs) {
            this.props.refs(ref);
          }
          this.ref_prod_sort = ref;
        }}
        style={{
          width: '90%',
          height: this.props.height || 400,
          borderRadius: 5,
          overflow: 'hidden'
        }}
        >
        <ScrollView ref={ref => this.ref_scroll = ref}>
          {this.renderRows.call(this)}
        </ScrollView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  selectionRows: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd'
  },
  selectionRowsSelected: {
    backgroundColor: '#dddddd'
  },
  selectionRowsValue: {
    fontSize: 16,
    color: '#000000'
  }
});
