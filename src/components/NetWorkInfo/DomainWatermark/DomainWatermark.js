import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
// configs
import appConfig from 'app-config';
// custom components
import DomainItem from './DomainItem';

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999999,
    top: 0,
    right: 0,
    position: 'absolute',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    position: 'absolute',
    top: appConfig.device.isIOS ? appConfig.device.statusBarHeight : 5,
    zIndex: 9999999,
    alignSelf: 'center',
  },
  domainContainer: {
    zIndex: -1,
    position: 'absolute',
    alignSelf: 'center',
  },
});

const DomainWatermark = ({domains = []}) => {
  const [isShowAllDomains, setShowAllDomains] = useState(false);

  const mainDomain = useMemo(() => {
    return domains[0];
  }, domains);
  const otherDomains = useMemo(() => {
    return domains.slice(1);
  }, domains);

  const handleShowAllDomains = useCallback(() => {
    setShowAllDomains(!isShowAllDomains);
  }, [isShowAllDomains]);

  const renderOtherDomains = () => {
    return otherDomains.map((domain, index) => {
      return (
        <DomainItem
          key={index}
          index={index + 1}
          totalDomains={domains.length}
          containerStyle={styles.domainContainer}
          visible={isShowAllDomains}
          title={domain}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <DomainItem
        title={mainDomain}
        visible
        iconName={isShowAllDomains ? 'up' : 'down'}
        onPress={handleShowAllDomains}
      />
      {renderOtherDomains()}
    </View>
  );
};

export default React.memo(DomainWatermark);
