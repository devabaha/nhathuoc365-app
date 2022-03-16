const START = '00:00';
const END = '23:55';
const MINUTE_STEP = 5;

const getHours = (hour, stepInMinute = MINUTE_STEP) => {
  const minuteArr = new Array(60 / stepInMinute).fill(0).map((_, index) => {
    const minute = String(index * stepInMinute).padStart(2, '0');
    return {
      label: `${hour}:${minute}`,
      value: `${hour}:${minute}`,
    };
  });

  return minuteArr;
};

const TIME_ARRAY = new Array(24) // 24 hours
  .fill(0)
  .map((_, index) => {
    const hour = String(index).padStart(2, '0');

    return getHours(hour);
  })
  .flat();

const getIndexByTime = (time, isToday = false, stepInMinute = MINUTE_STEP) => {
  const [hour, minute] = time.split(':');
  return isToday
    ? hour * (60 / stepInMinute) + Math.ceil(parseInt(minute) / stepInMinute)
    : hour * (60 / stepInMinute) + parseInt(minute) / 5;
};

const TIME_ARRAY_FORMATTED = TIME_ARRAY.slice(
  getIndexByTime(START),
  getIndexByTime(END) + 1,
);

export const isTimeAvailable = (h = '', m = '') => {
  const date = new Date();
  const hour = h || String(date.getHours()).padStart(2, '0');
  const minute = m || String(date.getMinutes()).padStart(2, '0');
  const [endHour, endMinute] = END.split(':');

  return (
    Number(hour) < Number(endHour) ||
    (Number(hour) === Number(endHour) && Number(minute) < Number(endMinute))
  );
};

export const getDataSchedule = (
  deliveryNowLabel = '',
  todayLabel = '',
  totalDay = 7,
) =>
  Array.from({length: totalDay}).map((_, index) => {
    const date = new Date();

    const timeDeliveryNow = new Date();
    timeDeliveryNow.setMinutes(timeDeliveryNow.getMinutes() + 10);
    const hourToDeliveryNow = String(date.getHours()).padStart(2, '0');
    const minuteToDeliveryNow = String(date.getMinutes()).padStart(2, '0');

    const timeToDeliveryNow = `${hourToDeliveryNow}:${minuteToDeliveryNow}`;

    let todayTimeFormatted = TIME_ARRAY.slice(
      getIndexByTime(timeToDeliveryNow, true),
      getIndexByTime(END) + 1,
    );

    if (index === 0 && isTimeAvailable() && deliveryNowLabel) {
      todayTimeFormatted[0] = {
        ...todayTimeFormatted[0],
        label: deliveryNowLabel,
        value: '',
      };
    }

    date.setDate(date.getDate() + index);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = date.getFullYear();
    const fullDate = `${dd}/${mm}/${yyyy}`;

    if (index == 0) {
      return {
        label: todayLabel || fullDate,
        value: fullDate,
        time: todayTimeFormatted,
      };
    } else
      return {
        label: fullDate,
        value: fullDate,
        time: TIME_ARRAY_FORMATTED,
      };
  });
