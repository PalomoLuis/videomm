export default class Video {

    /**
     * 
     * @type {Object} The main document element after body. 
     * @type {Object} The container where you want to add the controls UI.
     * @type {{completeVolume, initialVolume, vertical}} (optional) The video configuration: { completeVolume, initialVolume, vertial }. 
     * @type {object} Gsap animation tool.
     * @type {Object} The configuration for icon assets. 
     */

    constructor( mainPartentElement, controlsContainer, videoConfig, gsapTool = false, assetsConfig) {
        if (!!assetsConfig) {
            if(typeof assetsConfig !== 'object') {
                console.warn('Config param must be an object');
            }
            this.config = assetsConfig;
        } else {
            this.config = {
                content: {
                  icon_colors: "ffffff",
                  local: true
                }
              }
        }

        if (videoConfig) {
            if(typeof videoConfig !== 'object') {
                console.warn('video configuration param must be an object');
            }
            this.videoConfig = videoConfig;
        }

        this.body = mainPartentElement;
        this.content = controlsContainer;
        this.variables = {
            display0: 'display-0',
            play_icon: 'play-icon',
            pause_icon: 'pause-icon',
            replay_icon: 'replay-icon'
        };

        if(typeof gsapTool === 'undefined') {
            console.warn('Video controls use Gsap to work. Install Gsap on your files.')
        } else {
            let gsapDNS = typeof gsap !== 'undefined' ? gsap : false
            this.gsap = gsapTool || gsapDNS;
        }
    };

    videoControls = () => {

        this.createTemplate();
        this.videoStyling();
        
        this.video = document.getElementById('video');
        
        // Video controls
        this.controls = document.querySelector('.controls');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.playIcon = document.getElementById(this.variables.play_icon);
        this.pauseIcon = document.getElementById(this.variables.pause_icon);
        this.replayIcon = document.getElementById(this.variables.replay_icon);
        this.soundBtn = document.getElementById('soundBtn');
        this.volMute = document.getElementById('mute-icon');
        this.volDown = document.getElementById('volDown-icon');
        this.volUp = document.getElementById('volUp-icon');
        this.volume = 100;

        //Video initial
        this.playIcon.classList.add(this.variables.display0);
        this.pauseIcon.classList.remove(this.variables.display0);

        // Video Play/Pause Control
        this.playPauseBtn.addEventListener('click', this.playPause);
        this.video.addEventListener('ended', () => {
            this.playIcon.classList.add(this.variables.display0);
            this.pauseIcon.classList.add(this.variables.display0);
            this.replayIcon.classList.remove(this.variables.display0);
        });

        
        // Video Volume Controls
        if(!this.videoConfig.completeVolume || this.videoConfig.completeVolume === undefined) {
            // Simple video volume
            this.soundBtn.addEventListener('click', this.mute);
        } else {
            // Complete video volume
            this.body.classList.add('complete-volume');
            this.volRange = document.getElementById('volRange');
            this.volume = this.volRange.value / 100;
            this.mute2 = document.getElementById('mute_2');
            this.soundBtn.addEventListener('mouseover', () => {
                this.gsap.to(volRange, 0.4, { opacity: 1});
            })
            this.body.addEventListener('mouseout', (e) => {
                this.gsap.to(volRange, 0.4, { opacity: 0});
            })
            this.volRange.addEventListener('change', this.setVolume);
            this.mute2.addEventListener('click', this.mute);
        };

        // Video events
        this.videoEvents();
    };

    mute = () => {
        if (!this.videoConfig.completeVolume) {
            // Simple volume settings
            if(this.video.muted) {
            this.video.muted = false;
            this.volMute.classList.add(this.variables.display0);
            this.volUp.classList.remove(this.variables.display0);
            } else {
            this.video.muted = true;
            this.volMute.classList.remove(this.variables.display0);
            this.volUp.classList.add(this.variables.display0);
            }
        } else {
            // Complete volume settings
            if (this.video.muted) {
            this.video.muted = false;
            if (this.video.volume < 0.4) {
                this.volMute.classList.add(this.variables.display0);
                this.volDown.classList.remove(this.variables.display0);
                this.volUp.classList.add(this.variables.display0);
            } else {
                this.volMute.classList.add(this.variables.display0);
                this.volDown.classList.add(this.variables.display0);
                this.volUp.classList.remove(this.variables.display0);
            }
            this.volRange.value = this.volume * 100;
            this.video.volume = this.volume;
            } else {
                this.video.muted = true;
                this.volRange.value = 0;
                this.volMute.classList.remove(this.variables.display0);
                this.volDown.classList.add(this.variables.display0);
                this.volUp.classList.add(this.variables.display0);
            }
        }
    };

    setVolume = () => {
        this.volume = this.volRange.value / 100;
        this.video.volume = this.volume;
        if (this.volume === 0) {
            this.volMute.classList.remove(this.variables.display0);
            this.volDown.classList.add(this.variables.display0);
            this.volUp.classList.add(this.variables.display0);
        } else if (this.volume >= 0.51) {
            this.video.muted = false;
            this.volMute.classList.add(this.variables.display0);
            this.volDown.classList.add(this.variables.display0);
            this.volUp.classList.remove(this.variables.display0);
        } else {
            this.video.muted = false;
            this.volMute.classList.add(this.variables.display0);
            this.volDown.classList.remove(this.variables.display0);
            this.volUp.classList.add(this.variables.display0);
        }
    };

    playPause = async () => {
        if(this.video.ended) {
            this.playIcon.classList.add(this.variables.display0);
            this.pauseIcon.classList.remove(this.variables.display0);
            this.replayIcon.classList.add(this.variables.display0);
        }
        if (this.video.paused) {
            try {
                await this.video.play();
            } catch(err) {
                console.error(`The video could be not supported by the user agent or it don't have permissions to use play() method`);
                console.error('Error: ', err);
            }
            this.playIcon.classList.add(this.variables.display0);
            this.pauseIcon.classList.remove(this.variables.display0);
        } else {
            this.video.pause();
            this.playIcon.classList.remove(this.variables.display0);
            this.pauseIcon.classList.add(this.variables.display0);
        }
    };

    createTemplate = () => {
        // Paramerets added by user
        const {
            play_icon,
            pause_icon,
            replay_icon,
            muted_icon,
            volume_down_icon,
            volume_up_icon
        } = this.config.content.video || false;

        const { completeVolume, vertical } = this.videoConfig;

        let initialVolume
        if (completeVolume) {
            initialVolume = this.videoConfig.initialVolume ? this.videoConfig.initialVolume : 60
        }

        //Parameter add by default
        const icon_colors = this.config.content.icon_colors;
        

        let template = `
            <div class="controls">
                ${
                    (() => {
                        if(this.config.content.local){
                            return `
                                <button id="playPauseBtn">
                                    <div id="${this.variables.play_icon}">
                                        <?xml version="1.0" encoding="UTF-8"?>
                                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                            <rect width="36" height="36" fill="#a9a8a9" opacity="0"/>
                                            <polygon fill="#${icon_colors}" points="22.91 18 15.09 11.74 15.09 24.26 22.91 18"/>
                                        </svg>
                                    </div>
                                    <div id="${this.variables.pause_icon}" class="${this.variables.display0}">
                                        <?xml version="1.0" encoding="UTF-8"?>
                                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                        <rect width="36" height="36" fill="#a9a8a9" opacity="0"/>
                                        <g>
                                            <rect fill="#${icon_colors}" x="13.36" y="12.28" width="3.19" height="11.43"/>
                                            <rect fill="#${icon_colors}" x="19.45" y="12.28" width="3.19" height="11.43"/>
                                        </g>
                                        </svg>
                                    </div>
                                    <div id="${this.variables.replay_icon}" class="${this.variables.display0}">
                                        <?xml version="1.0" encoding="UTF-8"?>
                                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                            <rect width="36" height="36" fill="#a9a8a9" opacity="0"/>
                                            <path fill="#${icon_colors}" d="M25.15,12.98l-4.47-.78,.78,4.47,1.34-1.34c.44,.79,.69,1.7,.69,2.66,0,3.03-2.46,5.49-5.49,5.49s-5.49-2.46-5.49-5.49,2.46-5.49,5.49-5.49v-1.66c-3.95,0-7.15,3.2-7.15,7.15s3.2,7.15,7.15,7.15,7.15-3.2,7.15-7.15c0-1.43-.42-2.76-1.14-3.87l1.14-1.14Z"/>
                                        </svg>
                                    </div>
                                </button>
                                <button id="soundBtn">
                                    <div id="mute-icon">
                                        <?xml version="1.0" encoding="UTF-8"?>
                                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                        <rect width="36" height="36" fill="#a9a8a9" opacity="0"/>
                                        <g>
                                            <polygon fill="#${icon_colors}" points="13.94 15.17 11.76 15.17 11.76 20.94 14.06 20.94 17.79 24.43 17.79 11.57 13.94 15.17"/>
                                            <polygon fill="#${icon_colors}" points="24.33 16.5 23.38 15.55 21.88 17.06 20.38 15.55 19.43 16.5 20.94 18 19.43 19.5 20.38 20.45 21.88 18.94 23.38 20.45 24.33 19.5 22.82 18 24.33 16.5"/>
                                        </g>
                                        </svg>
                                    </div>
                                    <div id="volDown-icon" class="${this.variables.display0}">
                                        <?xml version="1.0" encoding="UTF-8"?>
                                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                        <rect width="36" height="36" fill="#a9a8a9" opacity="0"/>
                                        <g>
                                            <path fill="#ffffff" d="M19,18c0-1-.47-1.88-1.21-2.44v-3.99l-3.85,3.61h-2.18v5.76h2.3l3.73,3.49v-3.99c.73-.56,1.21-1.45,1.21-2.44Z"/>
                                            <path fill="#ffffff" d="M19.97,13.94l-1.06,1.06c.77,.77,1.24,1.83,1.24,2.99s-.47,2.23-1.24,2.99l1.06,1.06c1.04-1.04,1.68-2.47,1.68-4.06s-.64-3.02-1.68-4.06Z"/>
                                        </g>
                                        </svg>
                                    </div>
                                    <div id="volUp-icon" class="${this.variables.display0}">
                                        <?xml version="1.0" encoding="UTF-8"?>
                                        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
                                        <rect width="36" height="36" fill="#a9a8a9" opacity="0"/>
                                        <g>
                                            <path fill="#ffffff" d="M19,18c0-.99-.48-1.87-1.21-2.43v-4l-3.85,3.61h-2.18v5.76h2.3l3.73,3.49v-4c.73-.56,1.21-1.44,1.21-2.43Z"/>
                                            <path fill="#ffffff" d="M19.97,13.94l-1.06,1.06c.77,.77,1.24,1.83,1.24,2.99s-.47,2.23-1.24,2.99l1.06,1.06c1.04-1.04,1.68-2.47,1.68-4.06s-.64-3.02-1.68-4.06Z"/>
                                            <path fill="#ffffff" d="M21.8,12.11l-1.07,1.07c1.23,1.23,1.99,2.93,1.99,4.82s-.76,3.58-1.99,4.82l1.07,1.07c1.51-1.51,2.44-3.59,2.44-5.89s-.93-4.38-2.44-5.89Z"/>
                                        </g>
                                        </svg>
                                    </div>
                                    ${
                                    (() => {
                                        if(completeVolume) {
                                            return `
                                                <input type="range"
                                                    name="volumeRange"
                                                    id="volRange"
                                                    min="0" max="100"
                                                    value="${initialVolume}"
                                                >
                                                <div id="mute_2"></div>
                                                `
                                        }
                                        return ""
                                    })()
                                    }
                                </button>
                            `;
                        } else {
                            return `
                                <button id="playPauseBtn">
                                    <img src="${play_icon}" id="${this.variables.play_icon}"/>
                                    <img src="${pause_icon}" id="${this.variables.pause_icon}" class="${this.variables.display0}"/>
                                    <img src="${replay_icon}" id="${this.variables.replay_icon}" class="${this.variables.display0}"/>
                                </button>
                                <button id="soundBtn">
                                    <img src="${muted_icon}" id="mute-icon"/>
                                    <img src="${volume_down_icon}" id="volDown-icon" class="${this.variables.display0}"/>
                                    <img src="${volume_up_icon}" id="volUp-icon" class="${this.variables.display0}"/>
                                    ${ this.createInput(completeVolume, initialVolume) }
                                </button>
                            `;
                        }
                    })()
                }
            </div>
        `;
        if(completeVolume) {
            this.body.classList.add('complete-volume');
        }
        this.content.innerHTML += template;
    };

    createInput(completeVolume, initialVolume) {
        const complete = completeVolume;
        const initial = initialVolume;
        if(complete) {
            return `
                <input type="range"
                    name="volumeRange"
                    id="volRange"
                    min="0" max="100"
                    value="${initial}"
                >
                <div id="mute_2"></div>
                `
        }
        return ""
    }

    videoStyling = () => {
        this.body.classList.add('video');
        if(this.videoConfig.vertical) {
            this.body.classList.add('vertical');
        }
    };

    videoEvents = () => {
        const mainContent = this.body;

        //Video start
        this.video.onplaying = function() {
            const event = new Event('videoPlaying');
            mainContent.dispatchEvent(event);
        }
        //Video ended
        this.video.onended = function() {
            const event = new Event('videoEnded');
            mainContent.dispatchEvent(event);
        }
    };

    // Methods
    showControls = () => {
        this.gsap.to('.controls', 0.3, { opacity: 1 });
    }
    hideControls = () => {
        this.gsap.to('.controls', 0.3, { opacity: 0 });
    }
    /**
     * 
     * @param {function} callbackfunction 
     * @param {*} callbackParams 
     * @param {number} time 
     */
    onVideoTime = ( callbackfunction, callbackParams, time = this.video.duration) => {
        const callbackFn = callbackfunction;
        const params = callbackParams;
        const tm = parseFloat(time.toFixed(1));
        let currentTime = 0;
        this.video.ontimeupdate = () => {
            currentTime = parseFloat(this.video.currentTime.toFixed(1));
            // console.log(tm + 0.2);
            if(currentTime > tm && currentTime < (tm + 0.5)) {
                // console.log(true);
                callbackFn(params);
                return
            }
        }
    };
};