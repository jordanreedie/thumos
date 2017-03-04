const microevent = require('microevent')
const clm = require('clmtrackr')
const pModel = require('./model_pca_20_svm.json')
var raf = require('raf')

var Thumos = function (videoId, overlayId, drawModel, delta=500) {
  var self = this
  var video = document.getElementById(videoId)
  var overlay = document.getElementById(overlayId)
  if (drawModel) {
    var overlayCC = overlay.getContext('2d')
  }
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
          for (var i = 0; i < endPositions.length; i++) {
            x_array.push(endPositions[i][0])
            y_array.push(endPositions[i][1])
          }
          self.trigger('faceMoving',
                       {'time': new Date(),
                        'xArray': x_array,
                        'yArray': y_array})
        }
      }, delta)
    }, delta)
  }

  function update () {
    raf(update)
    if (drawModel) {
      overlayCC.clearRect(0, 0, video.videoWidth, video.videoHeight)
    }
    positions = ctrack.getCurrentPosition()
    if (positions && drawModel) {
      ctrack.draw(overlay)
    }
  }
}

microevent.mixin(Thumos)

module.exports = Thumos

