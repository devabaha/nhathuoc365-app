export {default} from './AttributeSelection';

export interface AttributeSelectionProps {
  defaultSelectedModel: string;
  attrs: Array<any>;
  models: Object;
  onSelectAttr: (selectedAttr: Object, selectedAttrViewData: string[], model: string) => void;
}
