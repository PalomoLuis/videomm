export default class Video {

    /**
     * 
     * @type {Object} The main document element after body. 
     * @type {Object} The container where you want to add the controls UI.
     * @type {Object} The configuration for icon assets. 
     * @type {{completeVolume, initialVolume, vertical}} (optional) The video configuration: { completeVolume, initialVolume, vertial }. 
     */

    constructor( mainPartentElement, controlsContainer, assetsConfig, videoConfig ) {
        if (assetsConfig) {
            if(typeof assetsConfig !== 'object') {
                console.warn('Config param must be an object');
            }
            this.config = assetsConfig;
        } else {
            this.config = {
                "content": {
                  "video": {
                    "muted_icon": "./src/img/video_icons/muted-icon.png",
                    "pause_icon": "./src/img/video_icons/pause-icon.png",
                    "play_icon": "./src/img/video_icons/play-icon.png",
                    "replay_icon": "./src/img/video_icons/replay-icon.png",
                    "volume_down_icon": "./src/img/video_icons/volume-down-icon.png",
                    "volume_up_icon": "./src/img/video_icons/volume-up-icon.png"
                  }
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

        if(typeof gsap === 'undefined') {
            console.warn('Video controls use Gsap to work. Install Gsap on your files.')
        } else {
            this.gsap = gsap;
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
        const {
            play_icon,
            pause_icon,
            replay_icon,
            muted_icon,
            volume_down_icon,
            volume_up_icon
        } = this.config.content.video;
        const { completeVolume, vertical } = this.videoConfig;
        let initialVolume
        if (completeVolume) {
            initialVolume = this.videoConfig.initialVolume ? this.videoConfig.initialVolume : 60
        }

        let template = `
            <div class="controls">
                <button id="playPauseBtn">
                    <img src="${play_icon}" id="${this.variables.play_icon}"/>
                    <img src="${pause_icon}" id="${this.variables.pause_icon}" class="${this.variables.display0}"/>
                    <img src="${replay_icon}" id="${this.variables.replay_icon}" class="${this.variables.display0}"/>
                </button>
                <button id="soundBtn">
                    <img src="${muted_icon}" id="mute-icon"/>
                    <img src="${volume_down_icon}" id="volDown-icon" class="${this.variables.display0}"/>
                    <img src="${volume_up_icon}" id="volUp-icon" class="${this.variables.display0}"/>
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
            </div>
        `;
        if(completeVolume) {
            this.body.classList.add('complete-volume');
        }
        this.content.innerHTML += template;
    };

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
    mouseOver = () => {
        this.gsap.to('.controls', 0.3, { opacity: 1 });
    }
    mouseOut = () => {
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