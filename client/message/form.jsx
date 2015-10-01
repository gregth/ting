const React = require('react/addons'),
      i18n = require('i18next-client');

const MessageForm = React.createClass({
    _MIN_UPDATE_WHILE_TYPING: 2000,
    _MIN_UPDATE_WHEN_STOPPED: 500,
    _lastUpdate: 0,
    _lastUpdateTimeout: null,
    queue: null,
    getInitialState() {
        return {
            message: ''
        };
    },
    handleSubmit(event) {
        event.preventDefault();

        var message = this.state.message;

        if (message.trim().length > 0) {
            this.queue.enqueue(new MessageSubmit(message));

            React.findDOMNode(this.refs.inputField).value = '';
        }

        this.setState({
            message: ''
        });
    },
    onLogin() {
        React.findDOMNode(this.refs.inputField).focus();
    },
    handleChange(event) {
        var message = event.target.value;

        if (message.trim().length > 0) {
            if (this.state.message == '') {
                this.queue.enqueue(new MessageStartTyping(message));
            }
            else if (Date.now() - this._lastUpdate >= this._MIN_UPDATE_WHILE_TYPING) {
                this.queue.enqueue(new MessageTypingUpdate(message));
                this._lastUpdate = Date.now();
                clearTimeout(this._lastUpdateTimeout);
            }
            else {
                clearTimeout(this._lastUpdateTimeout);
                this._lastUpdateTimeout = setTimeout(() => {
                    this.props.onTypingUpdate(message);
                }, this._MIN_UPDATE_WHEN_STOPPED);
            }
        }
        else if (this.state.message.trim().length > 0) { // message was deleted
            this.queue.enqueue(new MessageTypingUpdate(message));
        }
        this.setState({message});
    },
    componentWillMount() {
        this.queue = new MessageQueue(
            this.onMessageSubmit,
            this.onStartTyping,
            this.onTypingUpdate
        );
    },
    render() {
        return (
            <div className='textarea'>
                <form id='message'
                      onSubmit={this.handleSubmit}>
                    <input type='text'
                           className='form-control'
                           placeholder={i18n.t('messageInput.placeholder')}
                           value={this.state.message}
                           onChange={this.handleChange}
                           ref='inputField' />
                </form>
            </div>
        );
    }
});

module.exports = MessageForm;
