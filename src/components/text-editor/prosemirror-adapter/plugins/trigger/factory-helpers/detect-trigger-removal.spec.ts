jest.mock('./send-trigger-event', () => ({
    sendTriggerEvent: jest.fn(),
}));
import { sendTriggerEvent } from './send-trigger-event';
import { detectTriggerRemoval } from './detect-trigger-removal';
import { ReplaceStep } from 'prosemirror-transform';

describe('detectTriggerRemoval', () => {
    let mockView: any;
    let contentConverter: any;
    let resetActiveTrigger: jest.Mock;

    beforeEach(() => {
        mockView = {
            dom: { dispatchEvent: jest.fn() },
        };
        contentConverter = {};
        resetActiveTrigger = jest.fn();
        jest.clearAllMocks();
    });

    it('calls resetActiveTrigger and emits triggerStop when the trigger character is removed', () => {
        const mockTransaction = {
            steps: [
                new ReplaceStep(5, 6, {
                    content: {
                        textBetween: jest.fn().mockReturnValue(''), // Simulate removal
                        size: 0,
                    },
                } as any),
            ],
        };

        const result = detectTriggerRemoval(
            mockTransaction as any,
            { character: '@', position: 5 },
            resetActiveTrigger,
            contentConverter,
            mockView
        );

        expect(resetActiveTrigger).toHaveBeenCalled();
        expect(sendTriggerEvent).toHaveBeenCalledWith(
            'triggerStop',
            mockView,
            contentConverter,
            { character: '@', position: 5 },
            ''
        );
        expect(result).toBe(true);
    });

    it('does nothing when the trigger character is still present', () => {
        const mockTransaction = {
            steps: [
                new ReplaceStep(5, 6, {
                    content: {
                        textBetween: jest.fn().mockReturnValue('@'), // Trigger still present
                        size: 1,
                    },
                } as any),
            ],
        };

        const result = detectTriggerRemoval(
            mockTransaction as any,
            { character: '@', position: 5 },
            resetActiveTrigger,
            contentConverter,
            mockView
        );

        expect(resetActiveTrigger).not.toHaveBeenCalled();
        expect(sendTriggerEvent).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('does nothing when there is no active trigger', () => {
        const mockTransaction = {
            steps: [
                new ReplaceStep(5, 6, {
                    content: {
                        textBetween: jest.fn().mockReturnValue(''),
                        size: 0,
                    },
                } as any),
            ],
        };

        const result = detectTriggerRemoval(
            mockTransaction as any,
            null, // No active trigger
            resetActiveTrigger,
            contentConverter,
            mockView
        );

        expect(resetActiveTrigger).not.toHaveBeenCalled();
        expect(sendTriggerEvent).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('does nothing if the activeTrigger has invalid position', () => {
        const mockTransaction = {
            steps: [
                new ReplaceStep(5, 6, {
                    content: {
                        textBetween: jest.fn().mockReturnValue(''),
                        size: 0,
                    },
                } as any),
            ],
        };

        const result = detectTriggerRemoval(
            mockTransaction as any,
            { character: '@', position: -1 }, // Invalid position
            resetActiveTrigger,
            contentConverter,
            mockView
        );

        expect(resetActiveTrigger).not.toHaveBeenCalled();
        expect(sendTriggerEvent).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('ignores steps that are not ReplaceStep', () => {
        const mockTransaction = {
            steps: [
                { type: 'NonReplaceStep' }, // Simulate non-replace step
            ],
        };

        const result = detectTriggerRemoval(
            mockTransaction as any,
            { character: '@', position: 5 },
            resetActiveTrigger,
            contentConverter,
            mockView
        );

        expect(resetActiveTrigger).not.toHaveBeenCalled();
        expect(sendTriggerEvent).not.toHaveBeenCalled();
        expect(result).toBe(false);
    });

    it('handles empty slice content gracefully', () => {
        const mockTransaction = {
            steps: [
                new ReplaceStep(5, 6, {
                    content: {
                        textBetween: jest.fn().mockReturnValue(''),
                        size: 0,
                    },
                } as any),
            ],
        };

        const result = detectTriggerRemoval(
            mockTransaction as any,
            { character: '@', position: 5 },
            resetActiveTrigger,
            contentConverter,
            mockView
        );

        expect(resetActiveTrigger).toHaveBeenCalled();
        expect(sendTriggerEvent).toHaveBeenCalledWith(
            'triggerStop',
            mockView,
            contentConverter,
            { character: '@', position: 5 },
            ''
        );
        expect(result).toBe(true);
    });
});
