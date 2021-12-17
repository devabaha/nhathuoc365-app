import {StyleSheet} from 'react-native';
import config from '../../config';

const styles = StyleSheet.create({
  scrollViewWrapper: {},
  container: {
    flex: 1,
  },
  row: {
    paddingHorizontal: 16,
  },
  topImageWrapper: {
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '100%',
    height: config.device.width / 2,
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -15,
    width: 60,
    height: 60,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerWrapper: {
    paddingBottom: 18,
  },
  heading: {
    fontWeight: 'bold',
    marginTop: 24,
  },
  expireWrapper: {
    alignItems: 'flex-start',
  },
  canBuyCampaign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  voucherField: {
    flex: 1,
    paddingLeft: 16,
  },
  rightField: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#ccc',
  },
  voucherFieldLabel: {
    fontWeight: '400',
  },
  voucherFieldValue: {
    fontWeight: '400',
    marginTop: 6,
  },
  fieldPoint: {
    fontWeight: '600',
  },
  expireBox: {
    marginTop: 14,
  },
  expire: {
    fontWeight: '400',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  contentWrapper: {
    marginBottom: 8,
  },
  barCodeContainer: {
    paddingVertical: 7,
  },
  containerCodeNumber: {
    paddingBottom: 8,
    alignItems: 'center',
  },
  codeNumber: {
    fontWeight: '500',
    letterSpacing: 2,
  },
  getVoucherWrapper: {
    justifyContent: 'center',
  },
  providerWrapper: {
    marginBottom: 8,
  },
  providerImage: {
    width: 50,
    borderRadius: 5,
  },
  providerInfo: {
    flex: 1,
    minHeight: 50,
    marginLeft: 16,
    justifyContent: 'center',
  },
  chevronRightWrapper: {
    justifyContent: 'center',
  },
  addressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressAccordion: {
    marginTop: 12,
  },
  tabBackground: {
    backgroundColor: 'transparent',
  },
});

export default styles;
