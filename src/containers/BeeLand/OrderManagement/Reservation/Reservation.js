import React, { PureComponent } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import appConfig from 'app-config';
import Button from '../../../../components/Button';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15
  },
  label: {
    fontSize: 13,
    color: '#555'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  body: {
    paddingVertical: 10,
    alignItems: 'flex-start'
  },
  mainBlock: {
    flex: 1
  },
  note: {
    color: '#777',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 3
  },
  image: {
    width: 90,
    height: 90,
    marginRight: 15,
    backgroundColor: '#eee'
  },
  heading: {
    letterSpacing: 0.3,
    color: appConfig.colors.primary,
    fontWeight: '500'
  },
  title: {
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
    fontWeight: '500'
  },
  highlight: {
    color: '#AA8754',
    fontWeight: 'bold',
    fontSize: 16
  },
  footerContainer: {
    marginHorizontal: -15,
    marginBottom: -15,
    padding: 15,
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: '#ddd'
  },
  btnContainer: {
    paddingHorizontal: 0,
    paddingVertical: 0
  },
  btn: {
    width: undefined,
    paddingVertical: 10,
    paddingHorizontal: 15
  },
  btnTxt: {
    fontSize: 12,
    letterSpacing: 0.3
  }
});

class Reservation extends PureComponent {
  state = {};
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.row, styles.header]}>
          <View style={styles.mainBlock}>
            <Text style={styles.label}>Mã đơn: {this.props.code}</Text>
            <Text style={styles.note}>{this.props.date}</Text>
          </View>
          <Text style={[styles.label, { color: this.props.statusColor }]}>
            {this.props.status}
          </Text>
        </View>

        <View style={[styles.row, styles.body]}>
          <Image style={styles.image} source={{ uri: this.props.image }} />
          <View style={styles.mainBlock}>
            <Text style={styles.heading}>{this.props.projectName}</Text>
            <Text style={styles.title}>{this.props.name}</Text>
            <Text style={styles.label}>
              Tổng tiền:{' '}
              <Text style={styles.highlight}>{this.props.total}</Text>
            </Text>
          </View>
        </View>

        <View style={[styles.row, styles.footerContainer]}>
          <View style={styles.mainBlock}>
            <Text style={styles.label}>
              Đặt cọc:{' '}
              <Text style={styles.highlight}>{this.props.deposit}</Text>
            </Text>
          </View>
          {!!!this.props.isPaid && (
            <View>
              <Button
                containerStyle={styles.btnContainer}
                btnContainerStyle={styles.btn}
                titleStyle={styles.btnTxt}
                title="Thanh toán"
                onPress={this.props.onPress}
              />
            </View>
          )}
        </View>
      </View>
    );
  }
}

export default Reservation;
