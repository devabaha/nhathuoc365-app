import {TFunction} from 'i18next';

export {default} from './ModalLicense';

export type LicenseOption = {
  label: string;
  confirmed?: boolean;
  required?: boolean;
};

export interface ModalLicenseState {
  checkboxes: Array<LicenseOption>;
  agreeBtnDisabled: boolean;
}

export interface ModalLicenseProps {
  t?: TFunction;

  backdropPressToClose?: boolean;

  checkboxes?: Array<LicenseOption>;

  title?: string;
  isHTML?: boolean;
  content?: string;

  agreeTitle?: string;
  declineTitle?: string;

  onAgree?: (
    checkboxes: Array<LicenseOption>,
    confirmedCheckboxes: Array<LicenseOption>,
  ) => void;
  onDisagree?: () => void;
}
