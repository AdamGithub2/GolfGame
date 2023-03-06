class SceneB extends Phaser.Scene {
  constructor() {
    super('SceneB')
  }

  create() {
    const screenCenterX =
      this.cameras.main.worldView.x + this.cameras.main.width / 2
    const screenCenterY =
      this.cameras.main.worldView.y + this.cameras.main.height / 2
    const scoreText = this.add
      .text(screenCenterX, screenCenterY, 'GAME OVER \nScore:\n' + score, {
        align: 'center',
      })
      .setFontSize(50)
      .setOrigin(0.5)

    const infoText = this.add
      .text(
        screenCenterX,
        this.cameras.main.height - 100,
        'Press Enter to continue',
      )
      .setFontSize(20)
      .setOrigin(0.5)

    cursors = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  }

  update() {
    if (cursors.isDown) {
      score = 0
      this.scene.start('SceneA')
    }
  }
}
