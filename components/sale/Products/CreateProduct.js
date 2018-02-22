/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  ScrollView
} from 'react-native';

import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';

export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }

  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    //alert(titleHtml + ' ' + contentHtml)
  }

  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tên sản phẩm (Ví dụ: Rau hữu cơ PGS 300gr)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Tên sản phẩm"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Mã sản phẩm (Ví dụ: 10A2X1B32)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mã sản phẩm"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Thứ tự sắp xếp</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mã sản phẩm"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Đơn vị bán của sản phẩm ( 1 Kg, 1 Chai, 1 Gói, 10 Quả, 1 bộ, ... )</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mã sản phẩm"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Giá niêm yết ( VND )</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Giá niêm yết"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Khuyến mại / Giảm giá ( % )</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mã sản phẩm"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Giá khuyến mại ( VNĐ )</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Giá khuyến mại"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Danh mục sản phẩm</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mã sản phẩm"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Xuất xứ</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Xuất xứ"
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nhãn hiệu</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Nhãn hiệu"
              />
          </View>

          <View>
            <RichTextEditor
              ref={(r)=>this.richtext = r}
              style={styles.richText}
              initialTitleHTML={'Title!!'}
              initialContentHTML={'Hello <b>World</b> <p>this is a new paragraph</p> <p>this is another new paragraph</p>'}
              editorInitializedCallback={() => this.onEditorInitialized()}
            />
            <RichTextToolbar
              getEditor={() => this.richtext}
            />
            {isIOS && <KeyboardSpacer/>}
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...MARGIN_SCREEN,
    marginBottom: 0,
    backgroundColor: "#ffffff",
    paddingHorizontal: 15
  },
  formGroup: {
    marginTop: 16
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000'
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#dddddd',
    marginTop: 4,
    height: 36,
    paddingHorizontal: 4,
    fontSize: 14,
    color: '#333333'
  }
});
