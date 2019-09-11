import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Image,
  TouchableHighlight,
  StyleSheet
} from 'react-native';

const ServiceButton = props => {
  return (
    <TouchableHighlight
      underlayColor="transparent"
      style={[{}]}
      onPress={() => props.onPress(props.service_type, props.service_id)}
    >
      <View
        style={[
          {
            alignItems: 'center',
            width: ~~(Util.size.width / 5)
          },
          props.style
        ]}
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 10 }}>
          <Image style={styles.icon_service} source={props.iconName} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: '#262C35',
              fontSize: 12,
              textAlign: 'center'
            }}
          >
            {props.title}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

ServiceButton.propTypes = {
  onPress: PropTypes.func,
  service_type: PropTypes.string,
  service_id: PropTypes.number,
  style: PropTypes.object,
  iconName: Image.propTypes.source,
  title: PropTypes.string
};

ServiceButton.defaultProps = {
  onPress: () => '',
  service_type: '',
  service_id: '',
  style: undefined,
  iconName: undefined,
  title: ''
};

const styles = StyleSheet.create({
  icon_service: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
  }
});

export default ServiceButton;
