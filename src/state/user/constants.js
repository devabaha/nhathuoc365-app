import appConfig from 'app-config';

export const NAMESPACE = 'user';

/*
 * Redux actions
 */
const ACTION_NAMESPACE = `${appConfig.namespace}:${NAMESPACE}`;

export const USER_SET = `${ACTION_NAMESPACE}:set`;
