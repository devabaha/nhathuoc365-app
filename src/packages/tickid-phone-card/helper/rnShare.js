import { Share } from 'react-native';
import { showMessage } from '../constants';

export default async function rnShare({ title, message, successMessage }) {
  try {
    const result = await Share.share({ title, message });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        showMessage({
          type: 'success',
          message: successMessage
        });
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    console.log(error);
  }
}
