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

// librarys
import Icon from 'react-native-vector-icons/FontAwesome';
import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import Modal from 'react-native-modalbox';

export default class CreateProduct extends Component {
  constructor(props) {
    super(props);
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);

    this.state = {
      name: "",
      sorting: 1,
      cart_step: 1,
      unit_name: 'kg'
    }
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

  _onSave = () => {
    var datas = {};

    datas.name = this.state.name || '';
    datas.product_code = this.state.product_code || '';
    datas.sorting = this.state.sorting || '';
    datas.cart_step = this.state.cart_step || '';
    datas.unit_name = this.state.unit_name || '';
    datas.discount = this.state.discount || '';
    datas.discount_percent = this.state.discount_percent || '';
    datas.price = this.state.price || '';
    datas.cat_id = this.state.cat_id || '';
    datas.made_in = this.state.made_in || '';
    datas.brand = this.state.brand || '';

    alert(JSON.stringify(datas));
  }

  render() {
    return (
      <View style={{
        width: Util.size.width,
        height: Util.size.height
      }}>
        <ScrollView style={styles.container}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tên sản phẩm (Ví dụ: Rau hữu cơ PGS 300gr)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Tên sản phẩm"
              onChangeText={name => this.setState({name})}
              value={this.state.name}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Mã sản phẩm (Ví dụ: 10A2X1B32)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mã sản phẩm"
              onChangeText={product_code => this.setState({product_code})}
              value={this.state.product_code}
              />
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => 1}>
              <View style={{
                backgroundColor: HEADER_ADMIN_BGR,
                paddingVertical: 4,
                marginTop: 8,
                width: 110,
                alignItems: 'center',
                borderRadius: 3
              }}>
                <Text style={{
                  fontSize: 12,
                  color: "#ffffff"
                }}>Tạo mã tự động</Text>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Thứ tự sắp xếp</Text>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if (this.ref_prod_sort) {
                  this.ref_prod_sort.open();
                }
              }}>
              <View style={[styles.formInputSelection]}>
                <Text style={styles.inputSelectionValue}>{this.state.sorting}</Text>
                <View style={styles.formSelectionIcon}>
                  <Icon name="sort" size={16} color="#666" />
                </View>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Đơn vị bán của sản phẩm ( 1 Kg, 1 Chai, 1 Gói, 10 Quả, 1 bộ, ... )</Text>
            <View style={{
              flexDirection: 'row'
            }}>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => {
                  if (this.ref_cart_step) {
                    this.ref_cart_step.open();
                  }
                }}>
                <View style={[styles.formInputSelection, {
                  width: 64
                }]}>
                  <Text style={styles.inputSelectionValue}>{this.state.cart_step}</Text>
                  <View style={styles.formSelectionIcon}>
                    <Icon name="sort" size={16} color="#666" />
                  </View>
                </View>
              </TouchableHighlight>

              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => {
                  if (this.ref_unit_name) {
                    this.ref_unit_name.open();
                  }
                }}
                style={{
                  marginLeft: 8
                }}>
                <View style={[styles.formInputSelection, {
                  width: 64
                }]}>
                  <Text style={styles.inputSelectionValue}>{this.state.unit_name}</Text>
                  <View style={styles.formSelectionIcon}>
                    <Icon name="sort" size={16} color="#666" />
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Giá niêm yết ( VND )</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Giá niêm yết"
              onChangeText={discount => this.setState({discount})}
              value={this.state.discount}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Khuyến mại / Giảm giá ( % )</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Mã sản phẩm"
              onChangeText={discount_percent => this.setState({discount_percent})}
              value={this.state.discount_percent}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Giá khuyến mại ( VNĐ )</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Giá khuyến mại"
              onChangeText={price => this.setState({price})}
              value={this.state.price}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Danh mục sản phẩm</Text>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if (this.ref_cat_id) {
                  this.ref_cat_id.open();
                }
              }}>
              <View style={[styles.formInputSelection]}>
                <Text style={styles.inputSelectionValue}>{this.state.cat_id}</Text>
                <View style={styles.formSelectionIcon}>
                  <Icon name="sort" size={16} color="#666" />
                </View>
              </View>
            </TouchableHighlight>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Xuất xứ</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Xuất xứ"
              onChangeText={made_in => this.setState({made_in})}
              value={this.state.made_in}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nhãn hiệu</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Nhãn hiệu"
              onChangeText={brand => this.setState({brand})}
              value={this.state.brand}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nội dung chi tiết</Text>
            <AutoGrowingTextInput
              style={[styles.formInput, styles.formInputMulti]}
              placeholder={'Nhập nội dung'}
              onChangeText={name => this.setState({name})}
              value={this.state.name}
              numberOfLines={4}
              />
          </View>

          <View style={styles.boxButtonActions}>
            <TouchableHighlight
              style={[styles.buttonAction, {
                marginLeft: 6
              }]}
              onPress={this._onSave}
              underlayColor="transparent">
              <View style={[styles.boxButtonAction, {
                backgroundColor: DEFAULT_ADMIN_COLOR,
                borderColor: "#999999"
              }]}>
                <Icon name="plus" size={16} color="#ffffff" />
                <Text style={[styles.buttonActionTitle, {
                  color: "#ffffff"
                }]}>THÊM MẶT HÀNG</Text>
              </View>
            </TouchableHighlight>
          </View>

          {isIOS && <KeyboardSpacer />}
        </ScrollView>

        <Selections
          refs={ref => this.ref_prod_sort = ref}
          start={1}
          end={20}
          selected={this.state.sorting}
          onSelect={sorting => this.setState({sorting})}
         />

         <Selections
           refs={ref => this.ref_cart_step = ref}
           datas={['1', '0.1', '10', '100']}
           selected={this.state.cart_step}
           onSelect={cart_step => this.setState({cart_step})}
          />

        <Selections
          refs={ref => this.ref_unit_name = ref}
          datas={['kg', 'gr', 'cái', 'gói', 'túi', 'thùng', 'bộ']}
          selected={this.state.unit_name}
          onSelect={unit_name => this.setState({unit_name})}
         />

         <Selections
           refs={ref => this.ref_cat_id = ref}
           datas={['Rau hữu cơ', 'Thịt sinh học', 'Trái cây', 'Hải sản']}
           selected={this.state.cat_id}
           onSelect={cat_id => this.setState({cat_id})}
          />
      </View>
    );
  }
}

class Selections extends Component {
  constructor(props) {
    super(props);

    this.state = {

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

  renderRows() {
    var views = [];

    if (this.props.datas) {
      this.props.datas.forEach((value, i) => {
        views.push(
          <TouchableHighlight
            key={i}
            underlayColor="transparent"
            onPress={this._rowsOnpress.bind(this, value)}>
            <View style={[styles.selectionRows, this.props.selected == value ? styles.selectionRowsSelected : null]}>
              <Text style={styles.selectionRowsValue}>{value}</Text>
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

  componentDidMount() {

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
          height: 400,
          borderRadius: 5,
          overflow: 'hidden'
        }}
        >
        <ScrollView>
          {this.renderRows.call(this)}
        </ScrollView>
      </Modal>
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
  },
  formInputSelection: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    marginTop: 4,
    height: 36,
    paddingHorizontal: 4,
  },
  inputSelectionValue: {
    fontSize: 14,
    color: '#333333'
  },
  formSelectionIcon: {
    position: 'absolute',
    right: 4,
    top: 0,
    height: '100%',
    justifyContent: 'center'
  },
  formInputMulti: {
    paddingVertical: 8,
    height: 100,
    backgroundColor: 'white'
  },
  richText: {
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    height: 100
  },

  boxButtonActions: {
    backgroundColor: "#ffffff",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16
  },
  boxButtonAction: {
    flexDirection: 'row',
    borderWidth: Util.pixel,
    borderColor: "#666666",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    width: Util.size.width / 2 - 24,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonActionTitle: {
    color: "#333333",
    marginLeft: 4,
    fontSize: 14
  },

  selectionRows: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
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
