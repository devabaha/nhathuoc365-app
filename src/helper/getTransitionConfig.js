import { StackViewStyleInterpolator } from 'react-navigation-stack';

export default function getTransitionConfig() {
  return {
    screenInterpolator: StackViewStyleInterpolator.forFadeFromBottomAndroid
  };
}
