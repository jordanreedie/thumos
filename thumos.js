const microevent = require('microevent')
const clm = require('clmtrackr')
const pModel = require('./model_pca_20_svm.json')
var raf = require('raf')

var Thumos = function (videoId, overlayId, drawModel, delta=500) {
  var self = this
  var video = document.getElementById(videoId)
  var overlay = document.getElementById(overlayId)
  var overlayCC = overlay.getContext('2d')
  var positions

  var ctrack = new clm.tracker({useWebGL: true})
  ctrack.init(pModel)

  // start tracking
  ctrack.start(video)
  // start loop to draw face and obtain position data
  update()
  emit()

  function emit () {
    setInterval(function () {
      var deltaPositions = []
      var startPositions = positions
      var endPositions
      var startTime
      var endTime
      var x_array = []
      var y_array = []
      startTime = new Date()
      setTimeout(function deltas () {
        endPositions = positions
        if (endPositions && endPositions.length) {
          endTime = new Date()
          for (var i = 0; i < startPositions.length; i++) {
            // find euclidean differences between start and end points and average that
            deltaPositions.push(Math.sqrt(Math.pow(endPositions[i][0] - startPositions[i][0], 2) + Math.pow(endPositions[i][1] - startPositions[i][1], 2)))
            x_array.push(endPositions[i][0])
            y_array.push(endPositions[i][1])
          }
          if (deltaPositions && deltaPositions.length) {
            var faceDelta = deltaPositions.reduce(function (a, b) { return a + b }) / deltaPositions.length
            self.trigger('faceMoving', {'now': new Date(),
                                        'delta': faceDelta,
                                        'array': deltaPositions,
                                        'xArray': x_array,
                                        'yArray': y_array})
          }
        }
      }, delta)
    }, delta)
  }

  function update () {
    raf(update)
    overlayCC.clearRect(0, 0, video.videoWidth, video.videoHeight)
    positions = ctrack.getCurrentPosition()
    if (positions && drawModel) {
      ctrack.draw(overlay)
    }
  }
}

microevent.mixin(Thumos)

module.exports = Thumos

