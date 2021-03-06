import * as React from 'react';
import * as renderer from 'react-test-renderer';
import Analytics from '../analytics';
import {runImmediate} from '../testUtils';
import {withAnalyticOnEvent} from './with-analytic-on-event';

describe('withAnalyticOnEvent', () => {
    const writer = jest.fn();
    const BaseComponent = jest.fn().mockImplementation(props => {
        props.onClick({
            source: 'MyBaseComponent',
            user: 'McCree',
        });
        return null;
    });

    beforeAll(() => Analytics.setWriter(writer));
    beforeEach(() => writer.mockReset());

    it('Analytic sent when event handler is triggered', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
        });
    });

    it('Analytic not sent when shouldDispatchAnalytics returns false', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent shouldDispatchAnalytics={false} />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(0);
    });

    it('Sends analytic when triggered and calls inner event handler', async () => {
        const eventHandler = jest.fn();
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent onClick={eventHandler} />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
        });
        expect(eventHandler).toHaveBeenCalledTimes(1);
        expect(eventHandler.mock.calls[0][0]).toEqual({
            source: 'MyBaseComponent',
            user: 'McCree',
        });
    });

    it('Analytic sent with extra data from analyticsExtras as an object', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent analyticsExtras={{Name: 'Me'}} />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
            ExtraData: {
                Name: 'Me',
            },
        });
    });

    it('Analytic sent with extra data from analyticsExtras as a function with data from event', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent analyticsExtras={e => ({Source: e.source})} />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
            ExtraData: {
                Source: 'MyBaseComponent',
            },
        });
    });

    it('Analytic sent with identities from analyticsIdentities as an object', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent analyticsIdentities={{User: 'Me'}} />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
            Identities: {
                User: 'Me',
            },
        });
    });

    it('Analytic sent with identities from analyticsIdentities as a function with data from event', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent analyticsIdentities={e => ({User: e.user})} />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
            Identities: {
                User: 'McCree',
            },
        });
    });

    it('Analytic sent with static identities', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
            identities: {
                User: 'McCree',
            },
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
            Identities: {
                User: 'McCree',
            },
        });
    });

    it('Analytic sent with static extras', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
            extras: {
                Source: 'Some source',
            },
        })(BaseComponent);

        const result = renderer.create(<EnhancedComponent />);

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
            ExtraData: {
                Source: 'Some source',
            },
        });
    });

    it('Correctly ignores nulls in extras/identities', async () => {
        const EnhancedComponent = withAnalyticOnEvent({
            eventName: 'onClick',
            analyticName: 'TestAnalytic',
            extras: null,
            identities: undefined,
        })(BaseComponent);

        const result = renderer.create(
            <EnhancedComponent
                analyticsExtras={undefined}
                analyticsIdentities={null}
                shouldDispatchAnalytics={true}
                onClick={0}
            />,
        );

        await runImmediate();
        expect(writer).toHaveBeenCalledTimes(1);
        expect(writer.mock.calls[0][0]).toMatchObject({
            Name: 'TestAnalytic',
        });
    });
});
