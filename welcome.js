let instance

class ElemTitle {
  constructor (len, str, strStyle, bStyle) {
    this.canvas = wx.createCanvas()
    this.canvas.width = len
    this.canvas.height = len

    let ctx = this.canvas.getContext('2d')

    ctx.fillStyle = bStyle
    ctx.fillRect(0, 0, len, len)
    ctx.clearRect(5, 5, len-10, len-10)

    ctx.fillStyle = strStyle
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.font = String(len - 10) + "px STKaiti"
    ctx.fillText(str, len/2, len/2)
  }
}

class BeginButton {
  constructor(w, h, back, fore, pw, ph) {
    this.canvas = wx.createCanvas()
    this.canvas.width = w
    this.canvas.height = h

    this.x = pw / 2 - w / 2
    this.y = ph * 5 / 6
    
    let ctx = this.canvas.getContext('2d')
    
    ctx.beginPath()
    ctx.arc(5, 5, 5, Math.PI*3/2, Math.PI, true)
    ctx.lineTo(0, h - 5)
    ctx.arc(5, h - 5, 5, Math.PI, Math.PI/2, true)
    ctx.lineTo(w - 5, h)
    ctx.arc(w - 5, h - 5, 5, Math.PI/2, 0, true)
    ctx.lineTo(w, 5)
    ctx.arc(w-5, 5, 5, 0, Math.PI*3/2, true)
    ctx.closePath()
    ctx.fillStyle = back
    ctx.fill()

    ctx.fillStyle = fore
    ctx.font = String(h) + "px LiSu"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("开始游戏", w / 2, h / 2)
  }

  inArea(x, y) {
    if (x < this.x) return false
    if (x > this.x + this.canvas.width) return false
    if (y < this.y) return false
    if (y > this.y + this.canvas.height) return false
    return true
  }
}

let gradeElem = ["简单", "一般", "困难"]
class Grade {
  constructor(id, w, h, style, pw, ph) {
    this.canvas = wx.createCanvas()
    this.canvas.width = w
    this.canvas.height = h

    this.x = pw / 2 - w / 2
    this.y = ph / 2 + (id - 1) * (h + 10)

    this.ctx = this.canvas.getContext('2d')
    this.ctx.fillStyle = style
    this.ctx.font = String(h) + "px LiSu"
    this.ctx.textAlign = "center"
    this.ctx.textBaseline = "middle"
    this.ctx.fillText(gradeElem[id], w / 2 , h / 2)
  }

  selected() {
    let r = 5
    this.ctx.fillStyle = "#00ff00"
    this.ctx.beginPath()
    this.ctx.arc(r, this.canvas.height/2, r, 0, Math.PI * 2, true)
    this.ctx.fill()

    this.ctx.beginPath()
    this.ctx.arc(this.canvas.width - r, this.canvas.height / 2, r, 0, Math.PI * 2, true)
    this.ctx.fill()
  }

  inArea(x, y) {
    if (x < this.x) return false
    if (x > this.x + this.canvas.width) return false
    if (y < this.y) return false
    if (y > this.y + this.canvas.height) return false
    return true
  }
}

export default class Welc {
  constructor () {
    if (instance) {
      return instance
    }

    instance = this
    let i
    this.begin = 0
    this.canvas = wx.createCanvas()
    this.ctx = this.canvas.getContext('2d')

    this.t = []
    this.t[0] = new ElemTitle(50, "芊", "#66cccc", "#ff99cc")
    this.t[1] = new ElemTitle(50, "羽", "#666699", "#ff9999")
    this.t[2] = new ElemTitle(50, "拼", "#66cccc", "#0099cc")
    this.t[3] = new ElemTitle(50, "图", "#ff9933", "#666699")

    this.grade = 0
    this.g = []
    for (i=0; i<3; i++) {
      this.g[i] = new Grade(i, 90, 20, "#ff00ff", this.canvas.width, this.canvas.height)
    }

    this.bb = new BeginButton(150, 30, "#ff9966", "#0066cc", this.canvas.width, this.canvas.height)
    
  }

  notify(tx, ty) {
    if (this.bb.inArea(tx, ty)) {
      this.begin = 1
    }

    for (let i=0; i<3; i++) {
      if (this.g[i].inArea(tx, ty)) {
        this.grade = i
        break
      }
    }
  }

  refresh() {
    this.ctx.fillStyle = "#ffffcc"
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.bb.canvas, this.bb.x, this.bb.y)
    let i
    for (i = 0; i < 3; i++) {
      if (i == this.grade) {
        let r = 5
        this.ctx.fillStyle = "#00ff00"
        this.ctx.beginPath()
        this.ctx.arc(this.g[i].x - r, this.g[i].y + this.g[i].canvas.height / 2, r, 0, Math.PI * 2, true)
        this.ctx.fill()

        this.ctx.beginPath()
        this.ctx.arc(this.g[i].x + this.g[i].canvas.width, this.g[i].y + this.g[i].canvas.height / 2, r, 0, Math.PI * 2, true)
        this.ctx.fill()
      }
      this.ctx.drawImage(this.g[i].canvas, this.g[i].x, this.g[i].y)
    }
    for (i = 0; i < 4; i++) {
      this.ctx.drawImage(this.t[i].canvas, this.canvas.width / 2 - 115 + 60 * i, this.canvas.height / 6)
    }
  }
}