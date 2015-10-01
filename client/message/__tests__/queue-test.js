const React = require('react/addons');
const TestUtils = React.addons.TestUtils;

jest.dontMock('../queue.jsx');

const Queue = require('../queue.jsx');

describe('Queue', function() {
    var callbacks, messageQueue;

    beforeEach(function() {
        callbacks = {
            messageSubmitRequest: function(text, messageid) {
            },
            startTypingRequest: function(text, callback) {
                callback();
            },
            typingUpdateRequest: function(text, messageid) {
            }
        };

        spyOn(callbacks, 'messageSubmitRequest');
        spyOn(callbacks, 'startTypingRequest').andCallThrough();
        spyOn(callbacks, 'typingUpdateRequest');

        messageQueue = new Queue.MessageQueue(
            callbacks.messageSubmitRequest,
            callbacks.startTypingRequest,
            callbacks.typingUpdateRequest
        );
    });

    it('processes messages sequentially', function() {
        messageQueue.enqueue(new Queue.MessageStartTyping("h"));
        messageQueue.enqueue(new Queue.MessageTypingUpdate("hel"));
        messageQueue.enqueue(new Queue.MessageSubmit("hello"));

        expect(callbacks.messageSubmitRequest).toHaveBeenCalled();
        expect(callbacks.startTypingRequest).toHaveBeenCalled();
        expect(callbacks.typingUpdateRequest).toHaveBeenCalled();
    });
});
