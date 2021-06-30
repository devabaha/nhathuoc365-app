import React from 'react';
import {StyleSheet, View, Text, TouchableHighlight} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import {Container} from 'src/components/Layout';

import appConfig from 'app-config';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: Util.pixel,
    borderBottomWidth: Util.pixel,
    borderColor: '#dddddd',
  },
  topSpacing: {
    marginTop: 8,
  },

  titleWrapper: {
    paddingTop: 12,
  },
  titleContainer: {},
  icon: {
    width: 15,
    color: '#999',
    fontSize: 15,
  },
  title: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 8,
  },
  actionTitle: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  btnAction: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  changeTitle: {
    color: appConfig.colors.primary,
    fontSize: 12,
  },
});

const SectionContainer = ({
  style,
  marginTop,
  title,
  customIcon,
  iconStyle,
  iconName,
  children,
  actionBtnTitle,
  actionBtnStyle,
  onPressActionBtn = () => {},
}) => {
  const hasHeading = !!title && !!actionBtnTitle;

  return (
    <View style={[styles.container, style, marginTop && styles.topSpacing]}>
      {!!hasHeading && (
        <Container row style={styles.titleWrapper}>
          {!!title && (
            <Container row>
              {customIcon || (
                <FontAwesome5Icon
                  style={[styles.icon, iconStyle]}
                  name={iconName}
                />
              )}
              <Text style={styles.title}>{title}</Text>
            </Container>
          )}
          {!!actionBtnTitle && (
            <View style={styles.actionTitle}>
              <TouchableHighlight
                style={[styles.btnAction, actionBtnStyle]}
                underlayColor="transparent"
                onPress={onPressActionBtn}>
                <Text style={styles.changeTitle}>{actionBtnTitle}</Text>
              </TouchableHighlight>
            </View>
          )}
        </Container>
      )}
      {children}
    </View>
  );
};

export default React.memo(SectionContainer);
