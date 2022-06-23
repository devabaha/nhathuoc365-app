import moment from 'moment';

export const getDateTimeSelected = (dateTime: string) => {
  const deliveryTime: any = moment(dateTime).format('DD/MM/YYYY HH:mm');
  const [date, time] = deliveryTime.split(' ');

  return {date: date, time: time};
};
