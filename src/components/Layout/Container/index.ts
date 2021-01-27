export { default } from "./Container";
import { ViewProps } from "react-native";

export interface ContainerProps extends ViewProps {
  centerVertical?: boolean;
  centerHorizontal?: boolean;
  center?: boolean;
  flex?: boolean;
  row?: boolean;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}
