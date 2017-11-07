import { AnalyticsDispatcher } from 'shisell';
import { propsWithAnalytics } from './HOC/types'
import * as Types from './HOC/types';
import * as PropTypes from 'prop-types';

import { ComponentEnhancer, InferableComponentEnhancerWithProps } from 'recompose'

export * from './HOC/analytics-context-types';
export * from './HOC/with-analytics';
export * from './HOC/without-analytics';
export * from './HOC/enrich-analytics';
export * from './HOC/with-analytic-on-event';
export * from './HOC/with-analytic-on-mount';
export * from './HOC/with-on-prop-changed-analytic';
export * from './HOC/with-time-on-page-analytic';

import Analytics from './analytics';

export const analytics = Analytics ;

