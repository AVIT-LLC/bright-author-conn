/* eslint-disable prettier/prettier */
class SomeWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.channel = null;
        this.basePath = '';
        this.imageResourceId = null;
        this.videoResourceId = null;
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <div id="title"></div>
            <button id="mainButton"></button><br/>
            <button id="loadTemplateButton1">Load Template on current page</button><br/>
            <button id="loadTemplateButton2">Load Template on next page</button>
            <br/><br/>
            <div id="uploadFrame" style="border: 1px solid #ccc; padding: 10px; margin: 5px 0;">
                <h3 style="font-size: 14px; margin: 0 0 10px 0;">Upload Media</h3>
                <button id="uploadImage">Upload image</button>
                <button id="cancelImageUpload" disabled>Cancel image upload</button>
                <button id="createImageByResId" disabled>Create image by resId</button>
                <br/><br/>
                <button id="uploadVideo">Upload video</button>
                <button id="cancelVideoUpload" disabled>Cancel video upload</button>
                <button id="createVideoByResId" disabled>Create video by resId</button>
                <br/><br/>
                <button id="uploadSound">Upload sound</button>
                <button id="cancelSoundUpload" disabled>Cancel sound upload</button>
            </div>
            <div id="uploadStatus">
                <div>Image upload: <span id="imageUploadStatus">N/A</span></div>
                <div>Video upload: <span id="videoUploadStatus">N/A</span></div>
                <div>Sound upload: <span id="soundUploadStatus">N/A</span></div>
            </div>
            <br/>
            <div id="createMediaFrame" style="border: 1px solid #ccc; padding: 10px; margin: 5px 0;">
                <h3 style="font-size: 14px; margin: 0 0 10px 0;">Create element from content by ID (content ID from Media/Library)</h3>
                <label for="contentIdInput">Content ID:</label>
                <textarea id="contentIdInput" placeholder="Enter content ID" style="width: 100%; margin-bottom: 5px; height: 60px; resize: vertical;"></textarea>
                <button id="createImageFromContent" disabled>Create image</button>
                <button id="createVideoFromContent" disabled>Create video</button>
            </div>
            <br/><br/>
            <button id="createImage">Create image</button>
            <button id="createVideo">Create video</button>
            <button id="createMediaslide">Create mediaslide</button>
            <button id="createText">Create text</button>
            <br/>
            <input type="checkbox" id="globalWidget" />
            <label for="globalWidget">Toggle global widget</label>
            <br/><br/>
            <button id="openAppSettingsButton">Open app settings</button>
            <div id="message"></div>
        `;

        const vxtSubChannelId = this.getAttribute('data-channelid');
        this.channel = $vxt.createChannel(vxtSubChannelId);
        this.channel.subscribe('control', this.handleControl.bind(this));

        // Add main button click handler
        this.shadowRoot.querySelector('#mainButton').addEventListener('click', () => {
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'openDialog',
                    widgetUrl: `${this.basePath}/dialog.js`,
                    htmlTag: 'dialog-widget'
                }
            });
        });

        // Add loadTemplate button for current page click handler
        this.shadowRoot.querySelector('#loadTemplateButton1').addEventListener('click', async () => {
            const vx = await (await fetch(`${this.basePath}/template-local-only.json`, { headers: { 'Content-Type': 'application/json' } })).json();
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'loadTemplate',
                    vx: JSON.stringify(vx),
                    page: {
                        position: 'current'
                    }
                }
            });
        });

        // Add loadTemplate button for next page click handler
        this.shadowRoot.querySelector('#loadTemplateButton2').addEventListener('click', async () => {
            const vx = await (await fetch(`${this.basePath}/template-local-with-prime.json`, { headers: { 'Content-Type': 'application/json' } })).json();
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'loadTemplate',
                    vx: JSON.stringify(vx),
                    page: {
                        position: 'next'
                    }
                }
            });
        });

        this.shadowRoot.querySelector('#uploadImage').addEventListener('click', async () => {
            this.shadowRoot.querySelector('#uploadImage').disabled = true;
            this.shadowRoot.querySelector('#cancelImageUpload').disabled = false;
            
            const assetsPath = `${this.basePath.replace('/self-render', '/assets')}`;
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'upload',
                    type: 'request',
                    src: `${assetsPath}/bigbuckbunny_trailer_thumb.png`,
                    id: 'upload-image-unique-key'
                }
            });
        });

        this.shadowRoot.querySelector('#uploadVideo').addEventListener('click', async () => {
            this.shadowRoot.querySelector('#uploadVideo').disabled = true;
            this.shadowRoot.querySelector('#cancelVideoUpload').disabled = false;
            
            const assetsPath = `${this.basePath.replace('/self-render', '/assets')}`;
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'upload',
                    type: 'request',
                    src: `${assetsPath}/bigbuckbunny_trailer_480p.mp4`,
                    id: 'upload-video-unique-key'
                }
            });
        });

        this.shadowRoot.querySelector('#uploadSound').addEventListener('click', async () => {
            this.shadowRoot.querySelector('#uploadSound').disabled = true;
            this.shadowRoot.querySelector('#cancelSoundUpload').disabled = false;
            
            const assetsPath = `${this.basePath.replace('/self-render', '/assets')}`;
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'upload',
                    type: 'request',
                    src: `${assetsPath}/sunshine-strum-parade.mp3`,
                    id: 'upload-sound-unique-key'
                }
            });
        });

        this.shadowRoot.querySelector('#cancelImageUpload').addEventListener('click', async () => {
            // Update status display immediately
            const statusSpan = this.shadowRoot.querySelector('#imageUploadStatus');
            statusSpan.textContent = 'Upload cancelled';
            
            this.shadowRoot.querySelector('#uploadImage').disabled = false;
            this.shadowRoot.querySelector('#cancelImageUpload').disabled = true;
            
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'upload',
                    type: 'cancel',
                    id: 'upload-image-unique-key'
                }
            });
        });

        this.shadowRoot.querySelector('#cancelVideoUpload').addEventListener('click', async () => {
            // Update status display immediately
            const statusSpan = this.shadowRoot.querySelector('#videoUploadStatus');
            statusSpan.textContent = 'Upload cancelled';
            
            // Re-enable upload button and disable cancel button
            this.shadowRoot.querySelector('#uploadVideo').disabled = false;
            this.shadowRoot.querySelector('#cancelVideoUpload').disabled = true;
            
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'upload',
                    type: 'cancel',
                    id: 'upload-video-unique-key'
                }
            });
        });

        this.shadowRoot.querySelector('#cancelSoundUpload').addEventListener('click', async () => {
            // Update status display immediately
            const statusSpan = this.shadowRoot.querySelector('#soundUploadStatus');
            statusSpan.textContent = 'Upload cancelled';
            
            // Re-enable upload button and disable cancel button
            this.shadowRoot.querySelector('#uploadSound').disabled = false;
            this.shadowRoot.querySelector('#cancelSoundUpload').disabled = true;
            
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'upload',
                    type: 'cancel',
                    id: 'upload-sound-unique-key'
                }
            });
        });

        // Create test image element in current page
        this.shadowRoot.querySelector('#createImage').addEventListener('click', async () => {
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'createElement',
                    type: 'image',
                    files: [{
                        src: `${location.origin}/images/whatispirs.png`
                    }]
                }
            });
        });

        this.shadowRoot.querySelector('#createImageByResId').addEventListener('click', async () => {
            if (this.imageResourceId) {
                this.channel.publish('control', {
                    type: 'execute',
                    payload: {
                        command: 'createElement',
                        type: 'image',
                        files: [{
                            src: this.imageResourceId
                        }]
                    }
                });
            }
        });

        // Create test video element in current page
        this.shadowRoot.querySelector('#createVideo').addEventListener('click', async () => {
            const assetsPath = `${this.basePath.replace('/self-render', '/assets')}`;
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'createElement',
                    type: 'video',
                    files: [{
                        src: `${assetsPath}/bigbuckbunny_trailer_480p.mp4`,
                        thumb: `${assetsPath}/bigbuckbunny_trailer_thumb.png`,
                        duration: 33
                    }]
                }
            });
        });

        this.shadowRoot.querySelector('#createVideoByResId').addEventListener('click', async () => {
            if (this.videoResourceId) {
                this.channel.publish('control', {
                    type: 'execute',
                    payload: {
                        command: 'createElement',
                        type: 'video',
                        files: [{
                            src: this.videoResourceId,
                        }]
                    }
                });
            }
        });

        // Create test mediaslide in current page
        this.shadowRoot.querySelector('#createMediaslide').addEventListener('click', async () => {
            const assetsPath = `${this.basePath.replace('/self-render', '/assets')}`;
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'createElement',
                    type: 'mediaslide',
                    files: [
                        {
                            src: `${origin}/images/whatispirs.png`
                        },
                        {
                            src: `${assetsPath}/bigbuckbunny_trailer_480p.mp4`,
                            thumb: `${assetsPath}/bigbuckbunny_trailer_thumb.png`,
                            duration: 33
                        }
                    ]
                }
            });
        });
        // Create test text element in current page
        this.shadowRoot.querySelector('#createText').addEventListener('click', () => {
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'createElement',
                    type: 'text',
                    text: 'VXT App test message\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                }
            });
        });

        // Open app settings
        this.shadowRoot.querySelector('#openAppSettingsButton').addEventListener('click', async () => {
            this.channel.publish('control', {
                type: 'execute',
                payload: { command: 'openAppSettings' }
            });
        });

        // Event subscriptions (keep original functionality)
        this.channel.subscribe('data:broadcast-test-input', (data) => {
            this.shadowRoot.querySelector('#title').textContent = data.value.input;
            this.channel.publish('control', {
                type: 'selfConfig',
                payload: {
                    buttonText: 'Open dialog',
                    title: data.value.input
                }
            });
        });

        this.channel.subscribe('data:broadcast-test', (data) => {
            this.shadowRoot.querySelector('#message').textContent = data.value.message;
        });

        const globalWidget = this.shadowRoot.querySelector('#globalWidget');

        globalWidget.addEventListener('change', () => {
            globalWidget.disabled = true;
            this.channel.publish('control', {
                type: 'execute',
                payload: {
                    command: 'toggleGlobalWidget',
                    toggle: globalWidget.checked
                }
            });
        });

        let storageId = null;

        this.channel.subscribe('config', (data) => {
            if(data.storageId && data.storageId !== storageId) {
                storageId = data.storageId;

                this.channel.subscribe(`data:${storageId}`, (msg) => {
                    globalWidget.disabled = false;
                    const status = msg.payload[storageId];
                    if(status && status.globalWidgetEnabled !== undefined) {
                        globalWidget.checked = status.globalWidgetEnabled;
                    }
                });

                this.channel.publish('get', {
                    type: 'storage',
                    payload: {
                        prefix: storageId,
                        key: 'status'
                    }
                });
            }
            this.basePath = data.serverData.baseUrl;
            this.shadowRoot.querySelector('#title').innerHTML = data.data.title;
            this.shadowRoot.querySelector('#mainButton').textContent = data.data.buttonText;
        });

        this.channel.subscribe('data:upload-image-unique-key', (data) => {
            const statusSpan = this.shadowRoot.querySelector('#imageUploadStatus');
            const status = data.value.status;
            const message = data.value.message;
            
            switch (status) {
            case 'uploading':
                statusSpan.textContent = `Uploading: ${message}%`;
                this.shadowRoot.querySelector('#createImageByResId').disabled = true;
                break;
            case 'completed':
                statusSpan.textContent = 'Upload completed';
                this.imageResourceId = message;
                this.shadowRoot.querySelector('#createImageByResId').disabled = false;
                // Keep upload button disabled after completion
                this.shadowRoot.querySelector('#uploadImage').disabled = true;
                this.shadowRoot.querySelector('#cancelImageUpload').disabled = true;
                break;
            case 'error':
                statusSpan.textContent = `Error: ${message}`;
                this.shadowRoot.querySelector('#createImageByResId').disabled = true;
                // Re-enable upload button on error
                this.shadowRoot.querySelector('#uploadImage').disabled = false;
                this.shadowRoot.querySelector('#cancelImageUpload').disabled = true;
                break;
            case 'cancelled':
                statusSpan.textContent = 'Upload cancelled';
                this.shadowRoot.querySelector('#createImageByResId').disabled = true;
                // Re-enable upload button on cancel
                this.shadowRoot.querySelector('#uploadImage').disabled = false;
                this.shadowRoot.querySelector('#cancelImageUpload').disabled = true;
                break;
            default:
                statusSpan.textContent = status;
                if (status === 'completed') {
                    this.imageResourceId = message;
                    this.shadowRoot.querySelector('#createImageByResId').disabled = false;
                    // Keep upload button disabled after completion
                    this.shadowRoot.querySelector('#uploadImage').disabled = true;
                    this.shadowRoot.querySelector('#cancelImageUpload').disabled = true;
                } else {
                    this.shadowRoot.querySelector('#createImageByResId').disabled = true;
                    // Re-enable upload button for other statuses
                    this.shadowRoot.querySelector('#uploadImage').disabled = false;
                    this.shadowRoot.querySelector('#cancelImageUpload').disabled = true;
                }
            }
        });

        this.channel.subscribe('data:upload-video-unique-key', (data) => {
            const statusSpan = this.shadowRoot.querySelector('#videoUploadStatus');
            const status = data.value.status;
            const message = data.value.message;
            
            switch (status) {
            case 'uploading':
                statusSpan.textContent = `Uploading: ${message}%`;
                this.shadowRoot.querySelector('#createVideoByResId').disabled = true;
                break;
            case 'completed':
                statusSpan.textContent = 'Upload completed';
                this.videoResourceId = message;
                this.shadowRoot.querySelector('#createVideoByResId').disabled = false;
                // Keep upload button disabled after completion
                this.shadowRoot.querySelector('#uploadVideo').disabled = true;
                this.shadowRoot.querySelector('#cancelVideoUpload').disabled = true;
                break;
            case 'error':
                statusSpan.textContent = `Error: ${message}`;
                this.shadowRoot.querySelector('#createVideoByResId').disabled = true;
                // Re-enable upload button on error
                this.shadowRoot.querySelector('#uploadVideo').disabled = false;
                this.shadowRoot.querySelector('#cancelVideoUpload').disabled = true;
                break;
            case 'cancelled':
                statusSpan.textContent = 'Upload cancelled';
                this.shadowRoot.querySelector('#createVideoByResId').disabled = true;
                // Re-enable upload button on cancel
                this.shadowRoot.querySelector('#uploadVideo').disabled = false;
                this.shadowRoot.querySelector('#cancelVideoUpload').disabled = true;
                break;
            default:
                statusSpan.textContent = status;
                if (status === 'completed') {
                    this.videoResourceId = message;
                    this.shadowRoot.querySelector('#createVideoByResId').disabled = false;
                    // Keep upload button disabled after completion
                    this.shadowRoot.querySelector('#uploadVideo').disabled = true;
                    this.shadowRoot.querySelector('#cancelVideoUpload').disabled = true;
                } else {
                    this.shadowRoot.querySelector('#createVideoByResId').disabled = true;
                    // Re-enable upload button for other statuses
                    this.shadowRoot.querySelector('#uploadVideo').disabled = false;
                    this.shadowRoot.querySelector('#cancelVideoUpload').disabled = true;
                }
            }
        });

        this.channel.subscribe('data:upload-sound-unique-key', (data) => {
            const statusSpan = this.shadowRoot.querySelector('#soundUploadStatus');
            const status = data.value.status;
            const message = data.value.message;
            
            switch (status) {
            case 'uploading':
                statusSpan.textContent = `Uploading: ${message}%`;
                break;
            case 'completed':
                statusSpan.textContent = 'Upload completed';
                break;
            case 'error':
                statusSpan.textContent = `Error: ${message}`;
                // Re-enable upload button on error
                this.shadowRoot.querySelector('#uploadSound').disabled = false;
                this.shadowRoot.querySelector('#cancelSoundUpload').disabled = true;
                break;
            case 'cancelled':
                statusSpan.textContent = 'Upload cancelled';
                // Re-enable upload button on cancel
                this.shadowRoot.querySelector('#uploadSound').disabled = false;
                this.shadowRoot.querySelector('#cancelSoundUpload').disabled = true;
                break;
            default:
                statusSpan.textContent = status;
                if (status === 'completed') {
                    this.videoResourceId = message;
                    // Keep upload button disabled after completion
                    this.shadowRoot.querySelector('#uploadSound').disabled = true;
                    this.shadowRoot.querySelector('#cancelSoundUpload').disabled = true;
                } else {
                    // Re-enable upload button for other statuses
                    this.shadowRoot.querySelector('#uploadSound').disabled = false;
                    this.shadowRoot.querySelector('#cancelSoundUpload').disabled = true;
                }
            }
        });
        
        
        // Add event listeners for input fields to enable/disable buttons
        const contentIdInput = this.shadowRoot.querySelector('#contentIdInput');
        const createImageBtn = this.shadowRoot.querySelector('#createImageFromContent');
        const createVideoBtn = this.shadowRoot.querySelector('#createVideoFromContent');

        const updateButtonStates = () => {
            const hasContentId = !!contentIdInput.value.trim();
            createImageBtn.disabled = !hasContentId;
            createVideoBtn.disabled = !hasContentId;
        };

        // Update button states when input changes
        contentIdInput.addEventListener('input', updateButtonStates);
        
        // Also update button states when user types (key events)
        contentIdInput.addEventListener('keyup', updateButtonStates);
        contentIdInput.addEventListener('paste', () => {
            // Small delay to ensure paste content is registered
            setTimeout(updateButtonStates, 10);
        });

        // Update button event listeners to use input values
        createImageBtn.addEventListener('click', async () => {
            const contentId = contentIdInput.value.trim();
            if (contentId) {
                this.channel.publish('control', {
                    type: 'execute',
                    payload: {
                        command: 'createElement',
                        type: 'image',
                        files: [{
                            src: contentId
                        }]
                    }
                });
            }
        });

        createVideoBtn.addEventListener('click', async () => {
            const contentId = contentIdInput.value.trim();
            if (contentId) {
                this.channel.publish('control', {
                    type: 'execute',
                    payload: {
                        command: 'createElement',
                        type: 'video',
                        files: [{
                            src: contentId
                        }]
                    }
                });
            }
        });
    }

    // Rest of the class remains the same
    disconnectedCallback() {
        if (this.channel) {
            this.channel.unsubscribe('control', this.handleControl);
        }
    }

    handleControl(value) {
        this.shadowRoot.querySelector('#title').textContent = value.payload.title;
        this.shadowRoot.querySelector('#mainButton').textContent = value.payload.buttonText;
    }
}

customElements.define('some-widget', SomeWidget);
