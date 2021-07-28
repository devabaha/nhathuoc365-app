import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

import {Container} from 'src/components/Layout';

import appConfig from 'app-config';
import SectionContainerSkeleton from './SectionContainerSkeleton';

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
    justifyContent: 'space-between',
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
  actionTitle: {},
  btnAction: {},
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
  loading,
  actionBtnTitle,
  actionBtnStyle,
  onPressActionBtn = () => {},
}) => {
  const hasHeading = !!title || !!actionBtnTitle;

  return loading ? (
    <SectionContainerSkeleton />
  ) : (
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
            <TouchableOpacity
              hitSlop={HIT_SLOP}
              style={[styles.btnAction, actionBtnStyle]}
              onPress={onPressActionBtn}>
              <Text style={styles.changeTitle}>{actionBtnTitle}</Text>
            </TouchableOpacity>
          )}
        </Container>
      )}
      {children}
    </View>
  );
};

export default React.memo(SectionContainer);
