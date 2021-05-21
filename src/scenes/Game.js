import Phaser from "phaser";

import ScoreLabel from "../ui/ScoreLabel";

const GROUND = "ground";
const PLAYER = "player";

class Game extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  init() {
    this.platforms;
    this.player;
    this.stars;
  }

  preload() {
    this.load.image("bg-sky", "assets/sky.png");
    this.load.image("star", "assets/star.png");
    this.load.image(GROUND, "assets/platform.png");
    this.load.spritesheet(PLAYER, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });
  }

  create() {
    this.setBackground();
    this.setPlatform();
    this.createPlayer();
    this.createStars();

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      null,
      this
    );

    // KEYS
    this.cursors = this.input.keyboard.createCursorKeys();

    // SCORE
    this.scoreLabel = this.createScoreLabel(window.innerWidth / 2, 200, 0);
  }

  update() {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);

      this.player.anims.play("left", true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);

      this.player.anims.play("right", true);
    } else {
      this.player.setVelocityX(0);

      this.player.anims.play("turn");
    }

    if (this.cursors.space.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-700);
      this.player.body.setGravityY(0);
    } else if (this.cursors.space.isUp) {
      this.player.body.setGravityY(1000);
    }
  }

  setBackground() {
    const bg = this.add.image(
      window.innerWidth / 2,
      window.innerHeight / 2,
      "bg-sky"
    );

    bg.setScale(2.5);
  }

  setPlatform() {
    this.platforms = this.physics.add.staticGroup();

    const base = this.platforms.create(
      window.innerWidth / 2,
      window.innerHeight,
      GROUND
    );

    base.setScale(5).refreshBody();

    this.platforms.create(window.innerWidth / 2.2, 100, GROUND);
    this.platforms.create(30, 300, GROUND).setScale(0.8).refreshBody();
    this.platforms.create(700, 400, GROUND);

    this.platforms
      .create(window.innerWidth, 500, GROUND)
      .setScale(0.5)
      .refreshBody();

    this.platforms.create(30, 650, GROUND);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(50, window.innerHeight - 100, PLAYER);
    this.player.setBounce(0.3);
    this.player.setCollideWorldBounds(true, 1, 1);

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(PLAYER, { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "turn",
      frames: [{ key: PLAYER, frame: 4 }],
      frameRate: 5,
    });

    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers(PLAYER, { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1,
    });
  }

  createStars() {
    // const star = this.add.image(400, 300, "star"); // Add the star image
    // this.physics.add.existing(star, false); // Add physics to star
    // star.body.setBounce(0.5, 0.5);
    // star.body.setCollideWorldBounds(true, 1, 1); // Add collision to wall

    // star.body.setVelocity(0, 0); // Move the star

    this.stars = this.physics.add.group({
      key: "star",
      repeat: 20,
      setXY: { x: 50, y: 0, stepX: 70 },
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.8));
    });
  }

  collectStar(player, star) {
    star.disableBody(true, true);

    this.scoreLabel.add(10);
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "2rem", fill: "white", fontFamily: "Seoge UI" };
    const label = new ScoreLabel(this, x, y, score, style).setOrigin(0.5, 0.5);

    this.add.existing(label);

    return label;
  }
}

export default Game;
