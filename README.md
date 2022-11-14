# VideoMM
VideoMM is a simple video template, supported by all browsers with a friendly UI and easy to change. Using gsap as the only library required by it.

## Includes:

- Basic controls.
- Editable style classes.
- Editable visual assets.
- Video events management.

## Installation

VideoMM requires [Node.js](https://nodejs.org/) v14+ and npm to run.
Install the dependencies and start the server.

```
npm install videomm
```

VideoMM will install visual assets and a style sheet file. You can edit them by using the same selectors on your own stylesheet. However, VideoMM has been made for you not have to worry about it.

## Get started
Import VideoMM and CSS styles in your javascript file:

```
import VideoMM from 'videomm';
import 'videomm/src/css/video.css';
```

After that, you need to create a video tag in your html:

    <body class="main-content">
        <div class="controls-container">
            <video id="video" muted autoplay>
                <source
                    src="./src/video.mp4"
                    type="video/mp4
                />
            </video>
        </div>
    </body>

> **Note**: `id="video"` is required. 
>   It is important to add a container for video controls and specify the main container. It could be the body, main, or content section. In display ads you can use the html tag with a class "banner".

#### Initialization
To start using the Video you have to initiate an instance of VideoMM:
```
const main = document.querySelector('.main-content');
const controls = d.querySelector('.controls-container');

let videoUi = new VideoMM(main, controls);
videoUi.videoControls()
```
VideoMM instance requires two main parameters: the first one is the main container of the app (ex.: body tag, main tag, .banner-container). It will receive the events and styles. The second parameter is the container where you want to add the controls. It is really helpful when you want to have other layers between the video and the controls (ex.: a click tag to take you off to a link).
Finally, you will create the basic controls with the method **videoControls()**.

#### video configuration
You can add extra parameters in the VideoMM instance to manage the video configuration. In this case, you will need to install [gsap](https://greensock.com/docs/v3/Installation) in your project.

```
npm install gsap;
```

Import gsap in your project:

```
import { gsap } from 'gsap';
```

Add the configuration in your VideoMM instance:

```
const videoConfig = {
    completeVolume: true,
    initialVolume: 40,
    vertical: false
}
let videoUi = new VideoMM(main, controls, videoConfig, gsap);
```

The third parameter is the extra configuration:
- **completeVolume**: add a volume user control.
- **initialVolume**: handle the volume when the video start (only works when completeVolume is true).
- **vertial**: use it when your video is too narrow.

Finally, you need to add gsap for the animation. This source can be used on the rest of the tools.

> **Note**: `fullscreen video` and `download video` are not part of this util for now. Wait for the next version.

#### Assets management

VideoMM has its own video icons but you can add your own icons using the fifth parameter.

```
import playIcon from './play-icon.png';
import pauseIcon from './pause-icon.png';
import replayIcon from './replay-icon.png';
import mutedIcon from './muted-icon.png';
import volumeDownIcon from './volume-down-icon.png';
import volumeUpIcon from './volume-up-icon.png';

const assetsConfig = {
    content: {
        video: {
            play_icon: playIcon,
            pause_icon: pauseIcon,
            replay_icon: replayIcon,
            muted_icon: mutedIcon,
            volume_down_icon: volumeDownIcon,
            volume_up_icon: volumeUpIcon
        }
    }
}
  
let videoUi = new VideoMM(main, controls, videoConfig, gsap, assetsConfig);
```

#### Style management

Also you can edit the CSS styles using the following selectors:
```
:root {
    --videomm-icon-size: 36px;
    --videomm-height: 1080px;
    --videomm-width: 1920px;
    --videomm-bg-gradient: linear-gradient(0deg, rgba(0,0,0,70) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0) 100%);
    --videomm-color-black: #000000;
    --videomm-color-gray: #707070;
    --videomm-color-white: #ffffff;
}

#video, .controls {
    position: absolute;
    top: 0;
    left: 0;
    width: var(--videomm-width);
    height: var(--videomm-height);
}
```

> **Note**: The examples above are the default styles of the VideoMM.

#### Events and Methods
##### Events:
- **'videoPlaying'**: video playing event.
- **'videoEnded'**: video end event.
##### Methods:
- **showControls**: (function) simple animation that shows the controls container.
- **hideControls**: (function) simple animation that hides the controls container.
 
example:
```
main.addEventListener('videoPlaying', () => {
    main.addEventListener('mouseover', videoUi.showControls);
    main.addEventListener('mouseout', videoUi.hideControls);
})
main.addEventListener('videoEnded', () => {
    main.removeEventListener('mouseover', videoUi.showControls);
    main.removeEventListener('mouseout', videoUi.hideControls);
    gsap.to('.controls', { duration: 1, opacity: 1 })
})
```

Enjoy it!
VideoMM is open to any contributors.
