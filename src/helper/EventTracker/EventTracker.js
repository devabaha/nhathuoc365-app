import { Actions } from 'react-native-router-flux';
import { formatViewEvents } from '../../constants';
import { ANALYTICS_DELAY_LOG_EVENT } from '../../constants/analytics';
import store from 'app-store';

class EventTracker {
  timer = -1;
  defaultLogOptions = {
    callBack: undefined,
    delay: ANALYTICS_DELAY_LOG_EVENT,
    params: undefined
  };
  currentEventName = '';

  setCurrentEventName(eventName) {
    this.currentEventName = eventName;
  }

  isEventNameHasNotChanged(eventName) {
    return eventName && this.currentEventName === eventName;
  }

  mergeLogOptionsWithDefault(options) {
    return {
      ...this.defaultLogOptions,
      ...options
    };
  }

  analystLogEvent(eventName, params) {
    if (this.isEventNameHasNotChanged(eventName)) {
      // if (!__DEV__) {
      try {
        if (
          params &&
          typeof params === 'object' &&
          Object.keys(params).length === 0
        ) {
          params = undefined;
        }
        store.analyst.logEvent(eventName, { ...params });
        console.log(
          '%canalytics',
          'background-color:#FFA611;color:white;padding-left:5px;padding-right: 5px;padding-top: 2px;padding-bottom: 2px;border-radius:5px',
          eventName,
          params || ''
        );
      } catch (error) {
        console.log(
          '%canalytics',
          'background-color:red;color:white;padding-left:5px;padding-right: 5px;padding-top: 2px;padding-bottom: 2px;border-radius:5px',
          error,
          params || ''
        );
        console.warn(`analytics_${eventName}_fails`, error);
      }
      // }
    }
  }

  timeoutLogEvent(eventName, options = this.defaultLogOptions) {
    const mergedOptions = this.mergeLogOptionsWithDefault(options);
    const { delay, callBack, params } = mergedOptions;
    this.setCurrentEventName(eventName);
    this.timer = setTimeout(() => {
      // if (!__DEV__) {
      try {
        if (typeof callBack === 'function') {
          callBack(eventName, mergedOptions);
        } else {
          this.analystLogEvent(eventName, params);
        }
      } catch (error) {
        console.warn(
          `%canalytics_${eventName}`,
          'background-color:red;color:white',
          error
        );
      }
      // }
    }, delay);
  }

  logEvent(eventName, options = this.defaultLogOptions) {
    options.delay = 0;
    this.timeoutLogEvent(eventName, options);
  }

  logPaymentInfo(){
    store.analyst.logAddPaymentInfo();
  }

  logCurrentView(options = this.defaultLogOptions) {
    const eventOptions = {
      ...options,
      callBack: (eName, { delay, callBack, params }) => {
        const currentViewName = Actions.currentScene.split('_1')[0];
        if (currentViewName) {
          const eventName = formatViewEvents(currentViewName);
          this.analystLogEvent(eventName, params);
        }
      }
    };

    setTimeout(() => {
      const beforeLoggingViewName = Actions.currentScene.split('_1')[0];
      if (beforeLoggingViewName) {
        const formattedBeforeLoggingViewName = formatViewEvents(
          beforeLoggingViewName
        );
        this.timeoutLogEvent(formattedBeforeLoggingViewName, eventOptions);
      }
    });
  }

  clearTracking() {
    clearTimeout(this.timer);
  }
}

export default EventTracker;
