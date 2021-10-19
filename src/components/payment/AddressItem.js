import React from 'react';
import {Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import appConfig from 'app-config';
import {Container} from '../Layout';
import Image from '../Image';

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

  imageContainer: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  image: {
    width: 65,
    height: 65,
  },

  address_name_box: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  address_content: {
    marginTop: 10,
    flex: 1,
  },
  address_name: {
    flex: 1,
    fontSize: 16,
    color: '#3c3c3c',
    fontWeight: 'bold',
    marginRight: 10,
  },
  address_edit_btn: {
    fontSize: 22,
    color: appConfig.colors.primary,
  },
  address_edit_box: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 15,
    paddingVertical: 2,
  },
  address_edit_label: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  address_content_phone: {
    color: '#333',
  },
  address_content_address_detail: {
    color: '#888',
    fontSize: 13,
    marginTop: 5,
  },
  address_content_map_address: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  address_selected_box: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
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

  distanceContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
    borderColor: '#ccc',
    backgroundColor: hexToRgbA(appConfig.colors.primary, 0.05),
  },
  distanceIcon: {
    fontSize: 11,
    color: appConfig.colors.primary,
  },
  distanceTxt: {
    marginLeft: 8,
    fontSize: 11,
    color: appConfig.colors.primary,
  },
});

function AddressItem({
  image = null,
  address = null,
  selectable = true,
  editable = false,
  selected = false,
  gpsDistance,
  onLayout,
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
      onLayout={onLayout}
      disabled={!selectable}
      activeOpacity={0.7}
      onPress={onSelectAddress}
      style={{backgroundColor: '#fff', marginTop: 1}}>
      <View
        style={[
          styles.address_box,
          !selected && selectable && styles.uncheckOverlay,
        ]}>
        <Container row centerVertical={false}>
          {!!image && (
            <View style={styles.imageContainer}>
              <Image source={{uri: image}} style={styles.image} />
            </View>
          )}

          <Container flex centerVertical={false}>
            <View style={styles.address_name_box}>
              <Text numberOfLines={2} style={styles.address_name}>
                {address.name}
                {'  '}
                {address.default_flag == 1 && (
                  <FontAwesomeIcon
                    name="map-marker"
                    style={styles.address_edit_btn}
                  />
                )}
              </Text>
              {!!editable ? (
                <TouchableOpacity activeOpacity={0.7} onPress={onEditPress}>
                  <View style={styles.address_edit_box}>
                    <FontAwesomeIcon
                      name="pencil-square-o"
                      style={styles.address_edit_label}
                    />
                    <Text style={styles.address_edit_label}>
                      {t('address.edit')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ) : (
                !!gpsDistance && (
                  <Container row style={[styles.distanceContainer]}>
                    <Ionicons
                      name="ios-navigate"
                      style={[styles.distanceIcon]}
                    />
                    <Text style={[styles.distanceTxt]}>{gpsDistance}</Text>
                  </Container>
                )
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
                  <Ionicons
                    name="ios-checkmark-sharp"
                    size={24}
                    color={appConfig.colors.primary}
                  />
                </View>
              )}
            </View>
          </Container>
        </Container>
        {!!comboAddress && (
          <Text style={styles.comboAddress}>{comboAddress}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(AddressItem);
