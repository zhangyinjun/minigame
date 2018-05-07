import Piece from './piece'

let touchId = -1
let des = []
let randArr = []

export default class Op {
  constructor (pCount, img, ix, iy, iw, ih, ox, oy, ow, oh) {

    this.canvas = wx.createCanvas()
    this.ctx = this.canvas.getContext('2d')
    this.pCnt = pCount

    let i
    for (i = 0; i < pCount; i++) randArr[i] = i
    for (i = 1; i < pCount; i++) {
      let temp = randArr[i]
      let j = Math.floor(Math.random() * i)
      randArr[i] = randArr[j]
      randArr[j] = temp
    }
    console.log(randArr)
    for (i=Math.floor(Math.sqrt(pCount)); i>=1; i--) {
      if (pCount % i == 0) break;
    }
    this.divX = i
    this.divY = Math.round(pCount / i)
    console.log(this.divX, this.divY)
    
    for (i=0; i<pCount; i++) {
      // x: ow/(2*divX) ~ (width-ow/(2*divX))
      // y: oy+oh+oh/(2*divY)+gap ~ (height-oh/(2*divY))
      let gap = 10
      let xx = Math.random() * (this.canvas.width - ow / this.divX) + ow / (2 * this.divX)     
      let yy = Math.random() * (this.canvas.height - oh / this.divY - oy - oh - gap) + oy + oh + oh / (2 * this.divY) + gap
      
      des[i] = [xx, yy]
    }
    this.piece = []
    let flag = []
    for (i=0; i<pCount; ) {
      let l_ix = ix + (i % this.divX) * (iw / this.divX)
      let l_iy = iy + (Math.floor(i / this.divX)) * (ih / this.divY)
      let l_ox = ox + (i % this.divX) * (ow / this.divX)
      let l_oy = oy + (Math.floor(i / this.divX)) * (oh / this.divY)
      let j = Math.floor(Math.random() * pCount)
      if (!!flag[j]) {
        continue
      }
      flag[j] = 1
      this.piece[i] = new Piece(img, l_ix, l_iy, iw / this.divX, ih / this.divY, l_ox, l_oy, ow / this.divX, oh / this.divY, this.ctx, des[j])
      i++
    }

    this.tp = -1
    this.ox = ox
    this.oy = oy
    this.ow = ow
    this.oh = oh
  }

  refresh() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    let i
    /*
    let image
    for (i=0; i<this.pCnt; i++) {
      image = (this.piece[i].state == 2)? img2 : img1
      this.ctx.drawImage(image, this.piece[i].des[0]-image.width/2, this.piece[i].des[1]-image.height/2, image.width, image.height)
    }*/
    for (i=0; i<this.pCnt; i++) {
      let j = randArr[i]
      if (j == this.tp) continue;
      this.piece[j].refresh()
    }
    if ((0 <= this.tp) && (this.tp < this.pCnt)) {
      this.piece[this.tp].refresh()
    }
  }

  notify(res) {
    let tx = res.touch.clientX
    let ty = res.touch.clientY
    if (touchId == -1) {
      touchId = res.touch.identifier
    }
    else if (touchId != res.touch.identifier) {
      return
    }

    if (0 == res.event) {
      this.tp = -1
      for (let i=0; i<this.pCnt; i++) {
        let j = randArr[i]
        if (this.piece[j].state == 2) continue
        if ((Math.abs(tx - this.piece[j].des[0]) < this.ow / (2 * this.divX))
          && (Math.abs(ty - this.piece[j].des[1]) < this.oh / (2 * this.divY))) {
            this.tp = j
          }
      }
    }
    if ((0 <= this.tp) && (this.tp < this.pCnt)) {
      this.piece[this.tp].notify({
        event:res.event,
        x:tx,
        y:ty
      })
    }
    if (2 == res.event) {
      touchId = -1
      this.tp = -1
    }
  }
}