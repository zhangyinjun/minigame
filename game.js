import Piece from './piece'
import Op from './op'
import Welc from './welcome'

let canvas_main = wx.createCanvas()
let context_main = canvas_main.getContext('2d')
let canvas_img = wx.createCanvas()
let context_img = canvas_img.getContext('2d')

let x_work = 0
let y_work = canvas_main.height / 10
let w_work = canvas_main.width
let h_work = canvas_main.height * 3 / 5
let grade = [9, 16, 24]
let piece_count
let image = wx.createImage()
let finishDelay = 0
let op
let scd = 180
//let randArr = []

function reset() {
  wx.triggerGC()
  finishDelay = 0
  scd = 180
  context_img.fillStyle = "#ffffff"
  context_img.fillRect(0, 0, canvas_img.width, canvas_img.height)
  context_main.clearRect(0, 0, canvas_main.width, canvas_main.height)
}


function showImage () {
  let ih = image.height
  let iw = image.width
  let ix = 0
  let iy = 0
  if ((h_work / w_work) > (ih / iw)) {
    iw = w_work * ih / h_work
    ix = (image.width - iw) / 2
  }
  else {
    ih = iw * h_work / w_work
    iy = (image.height - ih) / 2
  }
  context_img.drawImage(image, ix, iy, iw, ih, x_work, y_work, w_work, h_work)
  
  let i
  for (i = Math.floor(Math.sqrt(piece_count)); i >= 1; i--) {
    if (piece_count % i == 0) break;
  }
  let divX = i
  let divY = Math.round(piece_count / i) 
  context_img.strokeStyle = "#576b95"
  context_img.lineWidth = 2
  for (i=1; i<divX; i++) {
    context_img.beginPath()
    context_img.moveTo(i * w_work/divX, y_work);
    context_img.lineTo(i * w_work / divX, y_work + h_work);
    context_img.stroke()
  }
  for (i=1; i<divY; i++) {
    context_img.beginPath()
    context_img.moveTo(0, y_work + i * h_work/divY)
    context_img.lineTo(w_work, y_work + i * h_work/divY)
    context_img.stroke()
  }
  context_img.beginPath()
  context_img.strokeStyle = "#e64340"
  context_img.lineWidth = 5
  context_img.moveTo(0, y_work);
  context_img.lineTo(w_work, y_work);
  context_img.stroke()
  context_img.moveTo(0, y_work + h_work);
  context_img.lineTo(w_work, y_work + h_work);
  context_img.stroke()
  /*
  context_img.fillStyle = '#ff0000'
  for (let i=0; i<6; i++) {
    context_img.fillText(String(i+1), canvas_img.width/3*(i%3)+canvas_img.width/6, (i>=3)? y_work*4.5 : y_work/2)
  }
  */
  op = new Op(piece_count, image, ix, iy, iw, ih, x_work, y_work, w_work, h_work)
}

function gameOver() {
  finishDelay = 0
  wx.showModal({
    title: '干得漂亮',
    content: '是否再来一局',
    showCancel: true,
    confirmColor: '#09bb07',
    success: function (res) {
      if (res.confirm) {
        newGame()
      }
      else if (res.cancel) {
        init()
      }
      else {
        wx.exitMiniProgram()
      }
    },
    fail: function (res) {
      console.log(res)
      wx.exitMiniProgram()
    }
  })
}

function runningGame() {
  context_main.clearRect(0, 0, canvas_main.width, canvas_main.height)
  context_main.drawImage(canvas_img, 0, 0)
  context_main.drawImage(op.canvas, 0, 0)

  let finish_state = 0
  for (let i=0; i<piece_count; i++) {
    op.piece[i].running()
    finish_state += op.piece[i].state
  }
  op.refresh()

  if (finish_state == 2*piece_count) {
    finishDelay++
  }

  if (finishDelay == 5) {
    gameOver()
  }
  else {
    requestAnimationFrame(runningGame)
  }
}

function startGame() {
  context_img.fillStyle = 'rgba(225,225,225,0.8)'
  context_img.fillRect(x_work, y_work, w_work, h_work)
  wx.onTouchStart(function(res) {
    op.notify({
      event: 0,
      touch: res.changedTouches[0]
    })
    //console.log(res.changedTouches[0])
  })
  wx.onTouchMove(function (res) {
    op.notify({
      event: 1,
      touch: res.changedTouches[0]
    })
  })
  wx.onTouchEnd(function(res) {
    op.notify({
      event: 2,
      touch: res.changedTouches[0]
    })
  })
  requestAnimationFrame(runningGame)
}

function countdown() {
  if (scd % 60 == 0) {
    wx.showToast({
      title: String(scd/60),
      icon: 'loading',
      duration: 1020
    })
  }
  scd--
  if (scd > 0) {
    requestAnimationFrame(countdown)
  }
  else {
    startGame()
  }
}

image.onload = function() {
  showImage()
  context_main.drawImage(canvas_img, 0, 0)
  
  requestAnimationFrame(countdown)
}

function newGame() {
  reset()
  wx.showModal({
    title: '选择图片',
    content: '相册中选择或自拍一张',
    showCancel: true,
    cancelText: '自拍',
    cancelColor: '#09bb07',
    confirmText: '相册',
    confirmColor: '#09bb07',
    success: function(res) {
      if (res.confirm) {
        wx.chooseImage({
          count: 1,
          sizeType: 'compressed',
          sourceType: ['album'],
          success: function (res) {
            let imageFile = res.tempFiles[0]
            image.src = imageFile.path
          },
          fail: res => {
            console.log(res)
            wx.exitMiniProgram()
          }
        })
      }
      else if (res.cancel) {
        wx.chooseImage({
          count: 1,
          sizeType: 'compressed',
          sourceType: ['camera'],
          success: function (res) {
            let imageFile = res.tempFiles[0]
            image.src = imageFile.path
          },
          fail: res => {
            console.log(res)
            wx.exitMiniProgram()
          }
        })
      }
      else {
        wx.exitMiniProgram()
      }
    },
    fail: function(res) {
      console.log(res)
      wx.exitMiniProgram()
    }
  })
}
/*
wx.showShareMenu({})
wx.onShareAppMessage(function() {
  return {
    title: '转发标题'
  }
})*/
let wel
function showWelcome() {
  context_main.clearRect(0, 0, canvas_main.width, canvas_main.height)
  wel.refresh()
  context_main.drawImage(wel.canvas, 0, 0)

  if (wel.begin == 0) {
    requestAnimationFrame(showWelcome)
  }
  else {
    piece_count = grade[wel.grade]
    newGame()
  }
}
function init() {
  wel = new Welc()
  wel.begin = 0
  wx.setPreferredFramesPerSecond(60)
  wx.onTouchEnd(function (res) {   
      let tx = res.changedTouches[0].clientX
      let ty = res.changedTouches[0].clientY

      wel.notify(tx, ty)
  })
  requestAnimationFrame(showWelcome)
}

init()