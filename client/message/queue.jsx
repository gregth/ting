function MessageQueue(
    messageSubmitRequest,
    startTypingRequest,
    typingUpdateRequest
) {
    this._messageSubmitRequest = messageSubmitRequest;
    this._startTypingRequest = startTypingRequest;
    this._typingUpdateRequest = typingUpdateRequest;
}

MessageQueue.prototype = {
    queue: [],
    _currentMessageId: 0,
    _pendingStartTyping: false,
    _doRequest(item) {
        switch (item.type) {
            case 'submit':
                this._messageSubmitRequest(
                    item.text,
                    this._currentMessageId
                );
                break;
            case 'start':
                this._pendingStartTyping = true;
                this._startTypingRequest(
                    item.text,
                    this.onStartTypingResponse.bind(this)
                );
                break;
            case 'update':
                this._typingUpdateRequest(
                    item.text,
                    this._currentMessageId
                );
                break;
        }
    },
    _process() {
        if (this.queue.length == 0) {
            return;
        }
        if (this._pendingStartTyping) {
            return;
        }

        var item = this.queue.shift();
        this._doRequest(item);
        this._process();
    },
    onStartTypingResponse(messageid) {
        console.log('onStartTypingResponse');

        this._currentMessageId = messageid;
        this._pendingStartTyping = false;
        this._process();
    },
    enqueue(message) {
        this.queue.push(message);
        this._process();
    }
};

function MessageSubmit(text) {
    this.text = text;
    this.type = 'submit';
}

function MessageTypingUpdate(text) {
    this.text = text;
    this.type = 'update';
}

function MessageStartTyping(text) {
    this.text = text;
    this.type = 'start';
}

module.exports = {
    MessageQueue,
    MessageSubmit,
    MessageTypingUpdate,
    MessageStartTyping
};
