import * as React from 'react';
import * as renderer from 'react-test-renderer';
import * as PropTypes from 'prop-types';
import * as shisell from 'shisell';

import {enrichAnalytics} from './enrich-analytics';
import Analytics from '../analytics';
import analyticsContextTypes, {AnalyticsContext} from './analytics-context-types';

class AnalyticsSender extends React.Component {
    static contextTypes = analyticsContextTypes;
    
    render() {
        this.context.analytics.dispatcher.dispatch('TestAnalytic');
        return null;
    }
}

const identity = <T extends {}>(f: T) => f;

describe('enrichAnalytics', () => {
    const writer = jest.fn();

    beforeAll(() => {
        Analytics.setWriter(writer);
    });

    it('Applies transformation to dispatchers below in context', () => {
        const EnhancedComponent = enrichAnalytics(dispatcher => dispatcher.createScoped('Rawr'))(AnalyticsSender);

        const result = renderer.create(<EnhancedComponent />);

        setImmediate(() => {
            expect(writer).toHaveBeenCalledTimes(1);

            expect(writer.mock.calls[0][0]).toMatchObject({
                Name: 'TestAnalytic',
                Scope: 'Rawr',
            });
        });
    });
});
