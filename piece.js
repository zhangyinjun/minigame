
let speed_per_fram = 30
export default class Piece {
  constructor(img, ix, iy, iw, ih, ox, oy, ow, oh, parentCtx, des) {
    this.canvas = wx.createCanvas()
    this.canvas.width = ow
    this.canvas.height = oh

    this.ctx = this.canvas.getContext('2d')
    this.ctx.drawImage(img, ix, iy, iw, ih, 0, 0, ow, oh)
    this.ctx.strokeStyle = 'rgba(0,0,0,0.2)'
    this.ctx.lineWidth = 5
    this.ctx.strokeRect(0, 0, ow, oh)

    this.x = ox + ow / 2
    this.y = oy + oh / 2

    this.parentCtx = parentCtx

    this.des = des

    this.state = 0
    this.event = -1
    this.tx = 0
    this.ty = 0

    this.fx = this.x
    this.fy = this.y
  }

  refresh() {
    this.parentCtx.drawImage(this.canvas, this.x - this.canvas.width / 2, this.y - this.canvas.height / 2)
  }

  move(des) {
    if (Math.abs(this.x - des[0]) >= 1) {
      let dx = (des[0] > this.x) ? 1 : -1
      this.x += speed_per_fram * dx
      if (((des[0] > this.x) ? 1 : -1) != dx) {
        this.x = des[0]
      }
    }
    else {
      this.x = des[0]
    }
    if (Math.abs(this.y - des[1]) >= 1) {
      let dy = (des[1] > this.y) ? 1 : -1
      this.y += speed_per_fram * dy
      if (((des[1] > this.y) ? 1 : -1) != dy) {
        this.y = des[1]
      }
    }
    else {
      this.y = des[1]
    }
  }

  running() {
    if (0 == this.state) {
      this.move(this.des)
      if ((Math.abs(this.x - this.des[0]) < 0.001) && (Math.abs(this.y - this.des[1]) < 0.001)) {
        this.state = 1
      }
    }
    else if (1 == this.state) {
      if (0 == this.event) {
      }
      else if (1 == this.event) {
        this.move([this.tx, this.ty])
      }
      else if (2 == this.event) {
        if ((Math.abs(this.x - this.fx) <= 10) && (Math.abs(this.y - this.fy) <= 10)) {
          this.state = 2
        }
        else {
          this.move(this.des)
        }
      }
    }
    else if (2 == this.state) {
      this.move([this.fx, this.fy])
    }
  }

  notify(res) {
    this.event = res.event
    this.tx = res.x
    this.ty = res.y
    //console.log(this.event, this.x, this.y, this.tx, this.ty)
  }
}