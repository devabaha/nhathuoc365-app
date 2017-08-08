'use strict';

import {
  LoginManager,
  AccessToken,
  ShareDialog,
  GraphRequest,
  GraphRequestManager
} from 'react-native-fbsdk';

class Facebook {

  /**
  * Hàm login facebook
  * Có thể dùng để xin thêm permission, khi đó truyền vào `permission`
  * là object các quyền
  */
  async login(permission) {
    permission = typeof permission == 'object' ? permission : FACEBOOK_PERMISSIONS;
    return await LoginManager.logInWithReadPermissions(permission);
  }

  /**
  * Hàm lấy fb_access_token của phiên hiện tại.
  * Cần login xong mới gọi hàm này
  */
  async getAccessToken() {
    var data = await AccessToken.getCurrentAccessToken();
    if (data.accessToken) {
      return data.accessToken.toString();
    }
  }
  
  // Share Dialogs
  shareLinkWithShareDialog(contentUrl, contentDescription,callback,_this) {
    var shareLinkContent = {
      contentType: 'link',
      contentUrl,
      contentDescription,
    };

    ShareDialog.canShow(shareLinkContent).then((canShow) => {
      
      if (canShow) {
        return ShareDialog.show(shareLinkContent);
      }
    }).then((result) => {
        callback(_this);
        if (result.isCancelled) {
          
          alert('Share operation was cancelled');

        } else {
          alert('Share was successful with postId: '
            + result.postId);
          
        }
      },
      (error) => {
        alert('Share failed with error: ' + error.message);
      }
    );
  }

}
export {
  LoginManager,
  AccessToken,
  ShareDialog,
  GraphRequest,
  GraphRequestManager,
}
export default new Facebook();
