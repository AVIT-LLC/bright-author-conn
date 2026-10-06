class DialogWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.channel = null;
        this.vxtSubChannelIds = [];
    }

    connectedCallback() {
        const channelId = this.dataset.channelid;

        if (!this.vxtSubChannelIds.includes(channelId)) {
            this.vxtSubChannelIds.push(channelId);
            this.channel = $vxt.createChannel(channelId);

            this.setupUI();
            this.setupSubscriptions();
        }
    }

    setupUI() {
        this.shadowRoot.innerHTML = `
      <div>Custom component self rendered in dialog</div>
      <div id="buttonContainer"></div>
      <div id="inputContainer"></div>
      <div id="configContainer"></div>
      <div id="broadcastContainer"></div>
    `;

        this.createButtonClose();
        this.createInputField();
        this.createSelfConfigButton();
        this.createBroadcastButton();
    }

    createButtonClose() {
        const buttonClose = document.createElement('button');
        buttonClose.textContent = 'Button control -> execute  (closeDialog)';
        buttonClose.addEventListener('click', () => {
            this.channel.publish('control', {
                type: 'execute',
                payload: { command: 'closeDialog' }
            });
        });
        this.shadowRoot.querySelector('#buttonContainer').appendChild(buttonClose);
    }

    createInputField() {
        this.input = document.createElement('input');
        this.shadowRoot.querySelector('#inputContainer').appendChild(this.input);
    }

    createSelfConfigButton() {
        const selfConfig = document.createElement('button');
        selfConfig.textContent = 'Button control -> selfConfig (confirm)';
        selfConfig.addEventListener('click', () => {
            this.channel.publish('set', {
                type: 'broadcast',
                payload: {
                    'broadcast-test-input': { input: this.input.value }
                }
            });
        });
        this.shadowRoot.querySelector('#configContainer').appendChild(selfConfig);
    }

    createBroadcastButton() {
        const broadcastButton = document.createElement('button');
        broadcastButton.textContent = 'Button set broadcast';
        broadcastButton.addEventListener('click', () => {
            this.channel.publish('set', {
                type: 'broadcast',
                payload: {
                    'broadcast-test': { message: 'broadcast-message' }
                }
            });
        });
        this.shadowRoot.querySelector('#broadcastContainer').appendChild(broadcastButton);
    }

    setupSubscriptions() {
        this.channel.subscribe('control', (value) => {
            if (this.input && value.payload.closeButtonText) {
                this.input.value = value.payload.closeButtonText;
            }
        });
    }
}

customElements.define('dialog-widget', DialogWidget);
