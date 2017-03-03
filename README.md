# thumos
Hip module for emitting face movement and emotion events

## install it

`npm install thumos`

## usage

Thumos is built upon the [clmtrackr](https://github.com/auduno/clmtrackr) library and emits only one event every 5 seconds:

- `faceMoving`: emitted every 5 seconds with data desribing the change in facial movement during 5 second intervals

Thumos initiates with three different variables:

- `videoId`: id of HTML5 video element
- `overlayId`: id of overlay element necessary for clmtrackr to work correctly
- `drawModel`: boolean toggle for turning the facial model on the video overlay on/off

It also emits data containing:

- `data.start`: start time of change in face movement
- `data.end`: end time of change in face movement
- `data.now`: time event trigged
- `data.delta`: integer representing average of all the euclidean differences from the start to end of the movement interval
- `data.array`: array of position differences for every coordinate during the movement interval
- `data.xArray`: array of x coordinates 
- `data.yArray`: array of y coordinates

```javascript
const Thumos = require('thumos')

var faceEvents = new Thumos(videoId, overlayId, drawModel)
faceEvents.bind('faceMoving', function (data) {
	console.log('Face moved!', 'start:', data.start, 'end:', data.end, 'now:' data.now, 'delta average:' data.delta, 'delta arrays:' data.array)
})
```

## coming soon!
The ability to emit events based on emotion change

## license
MIT
