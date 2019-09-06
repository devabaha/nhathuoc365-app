import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Platform
} from 'react-native';

function VoucherItem(props) {
  const item = props.item;
  return (
    <TouchableHighlight underlayColor="transparent" onPress={props.onPress}>
      <View
        style={[
          styles.notify_item,
          item.read_flag == 0 ? styles.notifyItemActive : null
        ]}
      >
        <View style={styles.notifyItemImageBox}>
          <CachedImage
            mutable
            style={styles.notifyItemImage}
            source={{ uri: item.image_url }}
          />
          <View style={styles.boxInfoVoucherDiscount}>
            <Text style={styles.boxInfoVoucherDiscountValue}>-30%</Text>
          </View>
        </View>

        <View style={styles.notifyItemContent}>
          <View style={styles.notifyItemContentBoxRight}>
            <View style={styles.notifyItemContentBox}>
              <Text style={styles.notifyItemTitle}>
                {sub_string(item.title, 55)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
}

VoucherItem.propTypes = {
  last: PropTypes.bool
};

VoucherItem.defaultProps = {
  last: false
};

const styles = StyleSheet.create({
  notify_item: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 16,
    marginVertical: 8,
    marginLeft: 16,
    flexDirection: 'column',
    height: isIOS ? 150 : 164,
    width: 205,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4
      },
      android: {
        elevation: 2,
        borderWidth: Util.pixel,
        borderColor: '#E1E1E1'
      }
    })
  },
  notifyItemActive: {
    backgroundColor: '#ebebeb'
  },
  notifyItemImageBox: {
    backgroundColor: '#ebebeb',
    width: '100%',
    height: 107
  },
  boxInfoVoucherDiscount: {
    position: 'absolute',
    top: 4,
    right: 10,
    width: 30,
    height: 30,
    backgroundColor: '#1DD76C',
    borderRadius: 15,
    transform: [{ scaleX: 1.3 }],
    alignItems: 'center',
    justifyContent: 'center'
  },
  boxInfoVoucherDiscountValue: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
    transform: [{ scaleX: 0.7 }]
  },
  notifyItemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 2
  },
  notifyItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
    paddingTop: 8
  },
  notifyItemContentBoxRight: {
    flexDirection: 'column',
    flex: 1
  },
  notifyItemContentBox: {
    flexDirection: 'row',
    flex: 2,
    paddingLeft: 5,
    alignItems: 'center'
  },
  notifyItemTitle: {
    fontSize: 12,
    color: '#212C3A',
    fontWeight: '500',
    flex: 1
  }
});

export default VoucherItem;
