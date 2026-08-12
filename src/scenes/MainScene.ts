import Phaser from 'phaser'

const REEL_COUNT = 3
const ROWS_PER_REEL = 3
const CELL_SIZE = 96
const CELL_GAP = 8

export class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene')
  }

  create() {
    this.cameras.main.setBackgroundColor('#111111')

    this.add
      .text(this.scale.width / 2, 60, 'Slot Simulator', {
        fontSize: '32px',
        color: '#ffffff',
      })
      .setOrigin(0.5)

    const gridWidth = REEL_COUNT * CELL_SIZE + (REEL_COUNT - 1) * CELL_GAP
    const gridHeight = ROWS_PER_REEL * CELL_SIZE + (ROWS_PER_REEL - 1) * CELL_GAP
    const originX = (this.scale.width - gridWidth) / 2
    const originY = (this.scale.height - gridHeight) / 2 + 40

    for (let reel = 0; reel < REEL_COUNT; reel++) {
      for (let row = 0; row < ROWS_PER_REEL; row++) {
        const x = originX + reel * (CELL_SIZE + CELL_GAP)
        const y = originY + row * (CELL_SIZE + CELL_GAP)
        this.add
          .rectangle(x, y, CELL_SIZE, CELL_SIZE, 0x222222)
          .setOrigin(0)
          .setStrokeStyle(2, 0x444444)
      }
    }
  }
}
