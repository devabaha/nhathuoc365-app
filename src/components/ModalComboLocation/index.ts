export {default} from './ModalComboLocation';
import {StyleProp, ViewStyle} from 'react-native';

export interface ModalComboAddressProps {
  type?: 0 | 1 | 2;
  parentId?: number | string;
  provinceId?: number | string;
  districtId?: number | string;
  wardsId?: number | string;
  provinceName?: string;
  districtName?: string;
  wardsName?: string;

  modalStyle?: StyleProp<ViewStyle>;
  onCloseModal?: Function;
  onSelectProvince?: Function;
  onSelectDistrict?: Function;
  onSelectWards?: Function;
}
