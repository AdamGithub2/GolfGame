var score = 0
var scoreText
var ball
var hole
var stick
var flag

var power = 0
var hitBallStatus = false

var dots

var pointer

let increasePowerFlag = false

let ballIsRunning = false

let maxPowerFlag = false

let cursors

function parabola(value) {
  return (value + 0) * (value + 0) + (value / 2.5) * power
}

//////////////
class SceneA extends Phaser.Scene {
  constructor() {
    super('SceneA')
  }

  preload() {
    this.load.image('sky', 'assets/background.png')
    this.load.image('ground', 'assets/tile_ground01.png')
    this.load.image('hole', 'assets/object_hole.png')
    this.load.image('flagStick', 'assets/object_flag_stick.png')
    this.load.image('ballTexture', 'assets/object_ball.png')
    this.load.image('flagTexture', 'assets/object_flag_anim01.png')
    this.load.image('flag2Texture', 'assets/object_flag_anim02.png')
    this.load.image('dot', 'assets/object_dot.png')
    pointer = this.input.activePointer
  }

  restart = () => {
    power = 0
    ball.enableBody(true, Phaser.Math.Between(100, 150), 300, false, false)
    //set random position of hole
    let rand = Phaser.Math.Between(200, 750)
    stick.enableBody(true, rand, 450, false, false)
    flag.enableBody(true, rand + 29, 414, false, false)
    hole.enableBody(true, rand, 514, false, false)
  }

  goll = () => {
    score += 10
    scoreText.setText('' + score)
    hitBallStatus = false
    ballIsRunning = false
    this.restart()
  }

  shot = () => {
    ball.body.setVelocity(power * 2, power * 7)
    increasePowerFlag = false
    hitBallStatus = true
    ballIsRunning = true
    maxPowerFlag = false
  }

  create() {
    this.input.mouse.disableContextMenu()

    this.add.image(400, 300, 'sky')

    const bottomBackground = this.add.tileSprite(400, 560, 800, 120, 'ground')
    const platforms = this.physics.add.staticGroup()
    platforms.add(bottomBackground)

    hole = this.physics.add.sprite(600, 514, 'hole')
    hole.setScale(0.4)
    hole.setSize(10, 80, true)
    hole.body.allowGravity = false

    ball = this.physics.add.sprite(200, 350, 'ballTexture')
    ball.setScale(0.5)
    ball.setBounce(0.2)
    ball.setSize(30, 30, true)

    stick = this.physics.add.sprite(600, 450, 'flagStick')
    stick.setScale(0.4)
    stick.body.allowGravity = false

    this.anims.create({
      key: 'wind',
      frames: [{ key: 'flagTexture' }, { key: 'flag2Texture' }],
      frameRate: 10,
      repeat: -1,
    })

    scoreText = this.add.text(650, 16, score, {
      fontSize: '64px',
      fill: '#FFD300',
      align: 'right',
      weight: 'bold',
    })

    this.physics.add.collider(ball, platforms)
    this.physics.add.collider(hole, platforms)

    flag = this.physics.add.sprite(629, 414, 'flagTexture').play('wind')
    flag.setScale(0.4)
    flag.body.allowGravity = false

    this.physics.add.overlap(ball, hole, this.goll)

    dots = this.physics.add.group({
      key: 'dot',
      repeat: 8,
      setXY: { x: ball.x, y: ball.y, stepX: 30, stepY: 30 },
      immovable: true,
      allowGravity: false,
    })
  }

  update() {
    //when ball is on the ground
    if (power > 0 && !increasePowerFlag && ball.y > 490) {
      ball.body.setVelocityX((power -= 4))
    }

    //when ball stop out of hole
    if (power <= 0 && ballIsRunning) {
      hitBallStatus = false
      ballIsRunning = false
      this.scene.start('SceneB')
    }

    //calculate dots parabola
    dots.children.iterate(function (child, index) {
      //remove first dot
      if (!hitBallStatus) {
        if (index === 0) {
          child.enableBody(true)
        } else {
          child.setX(0 + ball.x + (index * power) / 6)
          child.setY(0 + ball.y + parabola((index * -power) / 20) / 30)
        }
      } else {
        child.enableBody(true)
      }
    })

    //handle hit ball
    if (pointer.isDown && !maxPowerFlag) {
      power += 4
      increasePowerFlag = true
      if (power >= 500) {
        this.shot()
        increasePowerFlag = false
        maxPowerFlag = true
      }
    } else {
      if (increasePowerFlag) {
        this.shot()
      }
    }
  }
}
