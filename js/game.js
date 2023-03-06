var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'phaser-example',
  scene: [SceneA],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
}

var game = new Phaser.Game(config)
