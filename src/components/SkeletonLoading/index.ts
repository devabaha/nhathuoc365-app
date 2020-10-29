export { default } from "./SkeletonLoading";
import { StyleProp, ViewStyle } from "react-native";

export interface SkeletonLoadingProps {
  width: number | string;
  height: number | string;
  style?: StyleProp<ViewStyle>;
  start?: number;
  end?: number;
  loading?: boolean;
  backgroundColor?: string;
  foregroundColor?: string;
}
