import { StyleSheet, Dimensions } from 'react-native';
import config from '../../config';

const screenWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  scrollViewWrapper: {
    backgroundColor: '#f1f1f1'
  },
  container: {
    flex: 1
  },
  row: {
    paddingHorizontal: 16
  },
  topImageWrapper: {
    position: 'relative',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  topImage: {
    width: '100%',
    height: config.device.width / 2
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -15,
    width: 60,
    height: 60,
    ...elevationShadowStyle(2)
  },
  avatar: {
    width: '100%',
    height: '100%'
  },
  headerWrapper: {
    backgroundColor: '#ffffff',
    paddingBottom: 18
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 24
  },
  exprireWrapper: {
    alignItems: 'flex-start'
  },
  canBuyCampaign: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24
  },
  voucherField: {
    flex: 1,
    paddingLeft: 16
  },
  rightField: {
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#ccc'
  },
  voucherFieldLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400'
  },
  voucherFieldValue: {
    fontSize: 15,
    color: config.colors.black,
    fontWeight: '400',
    marginTop: 6
  },
  fieldPoint: {
    color: '#00b140',
    fontWeight: '600'
  },
  exprireBox: {
    backgroundColor: '#00bc3c',
    borderRadius: 4,
    marginTop: 14
  },
  exprire: {
    color: config.colors.white,
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  contentWrapper: {
    marginTop: 8,
    marginBottom: 8
  },
  getVoucherWrapper: {
    backgroundColor: config.colors.white,
    height: 62,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginBottom: config.device.bottomSpace
  },
  getVoucherBtn: {
    backgroundColor: config.colors.primary,
    borderRadius: 8,
    paddingVertical: 14
  },
  removeVoucherBtn: {
    backgroundColor: '#fe796c'
  },
  getVoucherTitle: {
    color: config.colors.white,
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 16
  },
  providerWrapper: {
    marginBottom: 8
  },
  providerBody: {
    backgroundColor: config.colors.white,
    padding: 16,
    flexDirection: 'row'
  },
  providerImage: {
    width: 50,
    borderRadius: 5
  },
  providerInfo: {
    flex: 1,
    minHeight: 50,
    marginLeft: 16,
    justifyContent: 'center'
  },
  providerBy: {
    fontSize: 14,
    color: '#666'
  },
  providerName: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: '500',
    color: '#333'
  },
  chevronRightWrapper: {
    justifyContent: 'center'
  },
  addressWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  infoSubHeading: {
    fontSize: 14,
    color: '#666'
  },
  addressAccordion: {
    marginTop: 12
  }
});

export default styles;
