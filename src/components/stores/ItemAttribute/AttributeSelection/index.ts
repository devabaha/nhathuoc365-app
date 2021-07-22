export {default} from './AttributeSelection';

export interface AttributeSelectionProps {
  viewData: Array<any>;
  models: Object;
  onSelectAttr: (selectedAttr: Object, selectedAttrViewData: string[]) => void;
}
