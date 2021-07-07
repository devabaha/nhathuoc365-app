import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function AddressItem({
  address = null,
  selectable = true,
  editable = false,
  selected = false,
  onSelectAddress = () => {},
  onEditPress = () => {},
}) {
  if (!address) return null;

  const {t} = useTranslation('address', 'common');

  const comboAddress =
    (address.province_name || '') +
    (address.district_name ? ' • ' + address.district_name : '') +
    (address.ward_name ? ' • ' + address.ward_name : '');

  return (
    <TouchableOpacity
      disabled={!selectable}
      activeOpacity={0.7}
      onPress={onSelectAddress}
      style={{backgroundColor: '#fff', marginTop: 1}}>
      <View
        style={[
          styles.address_box,
          !selected && selectable && styles.uncheckOverlay,
        ]}>
        <View style={styles.address_name_box}>
          <Text style={styles.address_name}>
            {address.name}{"  "}
            {address.default_flag == 1 && (
              <Icon name="map-marker" style={styles.address_edit_btn} />
            )}
          </Text>
          {!!editable && (
            <TouchableOpacity activeOpacity={0.7} onPress={onEditPress}>
              <View style={styles.address_edit_box}>
                <Icon name="pencil-square-o" size={12} />
                <Text style={styles.address_edit_label}>
                  {t('address.edit')}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.address_name_box}>
          <View style={styles.address_content}>
            <Text style={styles.address_content_phone}>{address.tel}</Text>
            <Text style={styles.address_content_address_detail}>
              {address.address}
            </Text>
            {!!address.map_address && (
              <Text style={styles.address_content_map_address}>
                {address.map_address}
              </Text>
            )}
          </View>

          {selectable && (
            <View
              style={[
                styles.address_selected_box,
                {opacity: selected ? 1 : 0},
              ]}>
              <Icon name="check" size={24} color={DEFAULT_COLOR} />
            </View>
          )}
        </View>
        {!!comboAddress && (
          <Text style={styles.comboAddress}>{comboAddress}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  address_box: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    minHeight: 120,
    borderBottomColor: '#dddddd',
    borderBottomWidth: Util.pixel,
  },
  uncheckOverlay: {
    backgroundColor: hexToRgbA('#000', 0.03),
  },
  address_name_box: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  address_content: {
    marginTop: 8,
    flex: 1,
    // width: Util.size.width - 140
  },
  address_name: {
    fontSize: 16,
    color: '#3c3c3c',
    fontWeight: 'bold',
  },
  address_edit_btn: {
    // position: 'absolute',
    // bottom: 0,
    // right: 0,
    // paddingVertical: 8,
    // paddingHorizontal: 15
    fontSize: 22,
    color: DEFAULT_COLOR,
  },
  address_edit_box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 15,
  },
  address_edit_label: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
  address_content_phone: {
    color: '#333',
    fontSize: 14,
  },
  address_content_address_detail: {
    color: '#333',
    fontSize: 14,
    marginTop: 6,
  },
  address_content_map_address: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  address_selected_box: {
    // position: 'absolute',
    // width: 100,
    // height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    // top: 20,
    // right: 10
  },
  comboAddress: {
    marginHorizontal: -15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    color: '#333',
    letterSpacing: 0.2,
    marginTop: 10,
    fontSize: 13,
    fontWeight: '400',
  },
});

export default React.memo(AddressItem);
