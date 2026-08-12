import Phaser from 'phaser'
import { MainScene } from './scenes/MainScene'
import './style.css'

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'app',
  width: 800,
  height: 600,
  backgroundColor: '#111111',
  scene: [MainScene],
})
