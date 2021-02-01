import {FirebaseAnalyticsTypes} from '@react-native-firebase/analytics';
import store from 'app-store';

class SearchModel {
    searchInfo: FirebaseAnalyticsTypes.SearchEventParameters = {
      search_term: ''
  };

  constructor(searchInfo: FirebaseAnalyticsTypes.SearchEventParameters) {
    this.searchInfo = {
        ...this.searchInfo,
        ...searchInfo
    };
  }

  get eventName(){
      return 'search'
  }

  logEvent() {
    return store.analyst.logSearch(this.searchInfo);
  }
}

export default SearchModel;
