/* @flow */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableHighlight,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';

// librarys
import {Actions, ActionConst} from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/FontAwesome';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Modal from 'react-native-modalbox';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker';
import _ from 'lodash';
import Selections from '../../Selections';

export default class EditProduct extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      sorting: "",
      cart_step: "",
      unit_name: "",
      images: {},
      img: {},
      img_delete_ids: [],
      item_data: props.item_data || null,
      data: props.data || null,
      ready: false,
      contentHeight: 96,
      advance: false
    }
  }

  _addImgDel = (id) => {
      this.state.img_delete_ids.push(id);
      this.setState({
        img_delete_ids: this.state.img_delete_ids
      });
  }

  componentDidMount() {
    this._getInfo();

    Actions.refresh({
      onBack: () => {
        if (this.isChanged) {
          return Alert.alert(
            'Chú ý',
            'Dữ liệu sẽ không được lưu nếu bạn thoát khỏi màn hình này. Rời khỏi đây?',
            [
              {text: 'Ở lại', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Rời khỏi', onPress: () => {
                this.parentReload();
                Actions.pop();
              }},
            ],
            { cancelable: false }
          )
        } else {
          this.parentReload();
          Actions.pop();
        }
      },
      rightTitle: "Nâng cao",
      onRight: this._changeAddMode.bind(this),
      rightButtonTextStyle: {
        color: "#ffffff"
      }
    });
  }

  _changeAddMode() {
    if (this.state.advance) {
      this.setState({
        advance: false
      }, () => {
        Actions.refresh({
          rightTitle: "Nâng cao"
        });
      });
    } else {
      this.setState({
        advance: true
      }, () => {
        Actions.refresh({
          rightTitle: "Cơ bản"
        });
      });
    }

    layoutAnimation();
  }

  parentReload = () => {
    if (this.props.parentReload) {
      this.props.parentReload();
    }
  }

  _deleteCurrentImg = (index, img_delete_id) => {
    if (img_delete_id) {
      this._addImgDel(img_delete_id);
    }
    
    delete this.state.img[index];
    this.setState({
      img: this.state.img
    });
  }

  async _getInfo() {
    try {
      var response = await ADMIN_APIHandler.edit_create_page_info(this.state.data.site_id, this.state.data.id);
      if (response && response.status == STATUS_SUCCESS) {

        var category = '';
        if (response.data.categories) {
          response.data.categories.some(cate => {
            if (cate.id == response.data.product.cat_id) {
              category = cate.name;
              return true;
            }
          });
        }

        this.setState({
          sort: response.data.sort,
          cart_steps: response.data.cart_steps,
          unit_names: response.data.unit_names,
          categories: response.data.categories,

          name: response.data.product.name,
          product_code: response.data.product.product_code,
          sorting: response.data.product.ordering,
          cart_step: response.data.product.cart_step,
          unit_name: response.data.product.unit_name,
          discount: response.data.product.discount,
          discount_percent: response.data.product.discount_percent,
          price: response.data.product.price,
          cat_id: response.data.product.cat_id,
          made_in: response.data.product.made_in,
          brand: response.data.product.brand,
          content: response.data.product.content,
          img: Object.assign({}, response.data.product.img),
          category,

          ready: true
        });
      }
    } catch (e) {
      console.warn(e + ' site_create_page_info');
    } finally {

    }
  }

  // on saving
  async _onSave() {

    if (this._clicked) {
      return;
    }
    this._clicked = true;

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
    datas.product_image = [];
    datas.img_delete_ids = this.state.img_delete_ids;
    datas.content = this.state.content || '';

    Object.keys(this.state.img).map(index => {
      var image = this.state.img[index];
      if (image.upload_file_name) {
        datas.product_image.push(image.upload_file_name);
      }
    });

    try {
      var response = await ADMIN_APIHandler.edit_product(this.state.data.site_id, this.state.data.id, datas);
      if (response && response.status == STATUS_SUCCESS) {
        Toast.show(response.message);

        this.parentReload();

        Actions.refresh({
          hideBackImage: true
        });

        setTimeout(() => {
          Actions.pop();
        }, 2000);
      } else if (response) {
        Toast.show(response.message);
        this._clicked = false;
      }
    } catch (e) {
      console.warn(e + ' create_product');
      this._clicked = false;
    } finally {

    }
  }

  // gen random code
  _genProductCode = () => {
    this.setState({
      gening: true
    }, async () => {
      try {
        var response = await ADMIN_APIHandler.site_gen_product_code(this.state.item_data.id, {
          product_id: 0
        });
        if (response && response.status == STATUS_SUCCESS) {
          this.setNewState({
            product_code: response.data.code
          });
        }
      } catch (e) {
        console.warn(e + ' site_gen_product_code');
      } finally {
        this.setState({
          gening: false
        });
      }
    });
  }

  // get height for selections
  _getSelectionsHeight(length) {
    var height = length * 48;
    return height < 400 ? height : 400;
  }

  _onTapChooseImage(index, imgDelId) {
    const options = {
      title: 'Chọn ảnh sản phẩm',
      cancelButtonTitle: 'Huỷ bỏ',
      takePhotoButtonTitle: 'Chụp ảnh',
      chooseFromLibraryButtonTitle: 'Chọn ảnh từ thư viện',
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {

      }
      else if (response.error) {
        console.warn(response.error);
      }
      else {
        this.state.img[index] = {
          id: null,
          image: response.data,
          fileName: response.fileName
        };

        // if replace this image
        if (imgDelId) {
          this._addImgDel(imgDelId);
        }

        this._uploadImages(index);
      }
    });
  }

  // scroll wrapper to top
  _scrollToEnd() {
    if (this.ref_scroll_view) {
      this.ref_scroll_view.scrollToEnd();
    }
  }

  _uploadImages(index) {
    var images = {
      name: 'image',
      filename: this.state.img[index].fileName,
      data: this.state.img[index].image
    };

    // call api post my form data
    RNFetchBlob.fetch('POST', ADMIN_APIHandler.url_site_upload_file(this.state.item_data.id), {
        'Content-Type' : 'multipart/form-data',
    }, [images]).then((resp) => {

        var {data} = resp;
        var response = JSON.parse(data);
        if (response && response.status == STATUS_SUCCESS) {
          this.state.img[index].upload_file_name = response.data.file_name;
          this.state.img[index].image = response.data.img_url;
          this.setState({
            img: this.state.img
          });
          this._scrollToEnd();
        }
    }).catch((error) => {
        console.warn(error + ' url_site_upload_file');

        store.addApiQueue('url_site_upload_file', this._uploadImages.bind(this, index));
    });
  }

  setNewState(state, callback) {
    this.setState(state, callback);
    this.isChanged = true;
  }

  render() {
    if (!this.state.ready) {
      return (
        <View style={{
          width: Util.size.width,
          height: Util.size.height
        }}>
          <Indicator size="small" />
        </View>
      );
    }

    var {advance} = this.state;

    return (
      <View style={{
        width: Util.size.width,
        height: Util.size.height
      }}>
        <ScrollView
          ref={ref => this.ref_scroll_view = ref}
          style={styles.container}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Tên sản phẩm (Ví dụ: Rau hữu cơ PGS 300gr)</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Tên sản phẩm"
              onChangeText={name => this.setNewState({name})}
              value={this.state.name}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Mã sản phẩm (Ví dụ: 10A2X1B32)</Text>
            <View style={[{
              borderWidth: 1,
              borderColor: '#dddddd',
              marginTop: 4,
              height: 42,
              paddingHorizontal: 4,
              backgroundColor: '#ebebeb',
              justifyContent: 'center'
            }]}>
              <Text style={{
                fontSize: 14,
                color: '#333333'
              }}>{this.state.product_code}</Text>
            </View>
          </View>

          {advance && (
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, styles.formLabelAdvance]}>Thứ tự sắp xếp</Text>
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
          )}

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
                  if (this.ref_selection_unit_name) {
                    this.ref_selection_unit_name.positionHandle();
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
              onChangeText={discount => this.setNewState({discount})}
              value={this.state.discount}
              />
          </View>

          {advance && (
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, styles.formLabelAdvance]}>Khuyến mại / Giảm giá ( % )</Text>
              <TextInput
                style={styles.formInput}
                placeholder="VD: 10%"
                onChangeText={discount_percent => this.setNewState({discount_percent})}
                value={this.state.discount_percent}
                />
            </View>
          )}

          {advance && (
            <View style={styles.formGroup}>
              <Text style={[styles.formLabel, styles.formLabelAdvance]}>Giá khuyến mại ( VNĐ )</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Giá khuyến mại"
                onChangeText={price => this.setNewState({price})}
                value={this.state.price}
                />
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Danh mục sản phẩm</Text>
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if (this.ref_category) {
                  this.ref_category.open();
                }
              }}>
              <View style={[styles.formInputSelection]}>
                <Text style={styles.inputSelectionValue}>{this.state.category}</Text>
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
              onChangeText={made_in => this.setNewState({made_in})}
              value={this.state.made_in}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nhãn hiệu</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Nhãn hiệu"
              onChangeText={brand => this.setNewState({brand})}
              value={this.state.brand}
              />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Nội dung chi tiết</Text>
            <TextInput
              multiline
              style={[styles.formInput, {
                height: this.state.contentHeight
              }]}
              placeholder="Nhập nội dung"
              onChangeText={content => this.setNewState({content})}
              value={this.state.content}
              onContentSizeChange={(e) => {
                this.setState({contentHeight: e.nativeEvent.contentSize.height < 96 ? 96 : e.nativeEvent.contentSize.height});
              }}
              />
          </View>

          {this.renderImageSelection.call(this, Object.keys(this.state.img).length + 1)}

          <View style={styles.boxButtonActions}>
            <TouchableHighlight
              style={[styles.buttonAction, {
                marginLeft: 6
              }]}
              onPress={this._onSave.bind(this)}
              underlayColor="transparent">
              <View style={[styles.boxButtonAction, {
                backgroundColor: DEFAULT_ADMIN_COLOR,
                borderColor: "#999999"
              }]}>
                <Icon name="save" size={16} color="#ffffff" />
                <Text style={[styles.buttonActionTitle, {
                  color: "#ffffff"
                }]}>LƯU THAY ĐỔI</Text>
              </View>
            </TouchableHighlight>
          </View>

          {isIOS && <KeyboardSpacer />}
        </ScrollView>

        {this.state.sort && (
          <Selections
            refs={ref => this.ref_prod_sort = ref}
            datas={this.state.sort}
            selected={this.state.sorting}
            onSelect={sorting => this.setNewState({sorting})}
            height={this._getSelectionsHeight(this.state.sort.length)}
           />
        )}

         {this.state.cart_steps && (
           <Selections
             refs={ref => this.ref_cart_step = ref}
             datas={this.state.cart_steps}
             selected={this.state.cart_step}
             onSelect={cart_step => this.setNewState({cart_step})}
             height={this._getSelectionsHeight(this.state.cart_steps.length)}
            />
          )}

        {this.state.unit_names && (
          <Selections
            ref={ref => this.ref_selection_unit_name = ref}
            refs={ref => this.ref_unit_name = ref}
            datas={this.state.unit_names}
            selected={this.state.unit_name}
            onSelect={unit_name => this.setNewState({unit_name})}
            height={this._getSelectionsHeight(this.state.unit_names.length)}
           />
        )}

        {this.state.categories && this.state.cat_id && (
          <Selections
            refs={ref => this.ref_category = ref}
            datas={this.state.categories}
            selected={this.state.cat_id}
            onSelect={category => this.setNewState({
              cat_id: category.id,
              category: category.name
            })}
            height={this._getSelectionsHeight(this.state.categories.length)}
           />
        )}
      </View>
    );
  }

  // render images selections
  renderImageSelection(num = 3) {
    var returns = [];
    for(let i = 0; i < num; i++) {
      let number = i + 1;
      let imageData = this.state.img[i] || null;

      if (imageData) {
        returns.push(
          <View key={i}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Ảnh sản phẩm {number}</Text>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={this._onTapChooseImage.bind(this, i, imageData.id)}>
                <View style={[styles.formInputSelection]}>
                  <Text style={styles.inputSelectionValue}>{imageData.fileName || imageData.image}</Text>
                  <View style={styles.formSelectionIcon}>
                    <Icon name="image" size={16} color="#666" />
                  </View>
                </View>
              </TouchableHighlight>
            </View>

            <View style={{
              flexDirection: 'row'
            }}>
              <CachedImage
                style={styles.imagePreview}
                source={{uri: imageData.image}}
                />

              <TouchableHighlight
                style={{
                  padding: 16
                }}
                underlayColor="transparent"
                onPress={this._deleteCurrentImg.bind(this, i, imageData.id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableHighlight>
            </View>
          </View>
        );
      } else {
        returns.push(
          <View key={i}>
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Ảnh sản phẩm {number}</Text>
              <TouchableHighlight
                underlayColor="transparent"
                onPress={this._onTapChooseImage.bind(this, i)}>
                <View style={[styles.formInputSelection]}>
                  <Text style={styles.inputSelectionValue}>Chọn ảnh...</Text>
                  <View style={styles.formSelectionIcon}>
                    <Icon name="image" size={16} color="#666" />
                  </View>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        );
      }
    }

    return returns;
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
    height: 42,
    paddingHorizontal: 4,
    fontSize: 14,
    color: '#333333'
  },
  formInputSelection: {
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#dddddd',
    marginTop: 4,
    height: 42,
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
  },

  imagePreview: {
    width: 60,
    height: 60,
    resizeMode: 'cover',
    marginTop: 4
  },
  formLabelAdvance: {
    color: "brown"
  }
});
