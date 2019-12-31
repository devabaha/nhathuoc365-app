export const logger = (namespace = '') => {
  return (log, ...argurments) => {
    console.log(namespace + ' ' + log, argurments);
  };
};
