import moment from 'moment';

export const getDateTimeSelected = (dateTime: string) => {
  const deliveryTime = moment(dateTime, 'YYYY-MM-DD HH:mm:ss').format(
    'DD/MM/YYYY HH:mm',
  );
  const [date, time] = deliveryTime.split(' ');

  return {date: date, time: time};
};

export const findDateTimeIndex = (data, itemSelected) => {
  const index = data.findIndex((item: any) => item?.value === itemSelected);

  if (index < 0) {
    return 0;
  } else return index;
};
