import Phaser from "phaser";

import ScoreLabel from "../ui/ScoreLabel";
import BombSpawner from "./BombSpawner";

const GROUND = "ground";
const PLAYER = "player";
const BOMB = "bomb";
class Game extends Phaser.Scene {
  constructor() {
    super("game-scene");
  }

  init() {
    this.platforms;
    this.player;
    this.stars;
    this.starsLength;
    this.bombSpawner;
    this.playerPlatformColliders;
    this.width = this.scale.width;
    this.height = this.scale.height;
    this.isGameOver = false;
    this.isAllStarsCollected = false;
    this.bg;
  }

  preload() {}

  create() {
    this.setBackground();
    this.setPlatform();
    this.createPlayer();
    this.createStars(20);

    this.playerPlatformColliders = this.physics.add.collider(
      this.player,
      this.platforms
    ); // Set collision between player and platforms

    this.physics.add.collider(this.stars, this.platforms); // Set collision between stars and platforms

    this.physics.add.overlap(
      this.stars,
      this.player,
      this.collectStar,
      null,
      this
    );

    // STARS LENGTH
    this.starsLength = this.stars.getLength();

    // BOMB
    this.bombSpawner = new BombSpawner(this, BOMB);

    const bombGroup = this.bombSpawner.group;

    this.physics.add.collider(bombGroup, this.platforms);

    this.physics.add.collider(
      this.player,
      bombGroup,
      this.hitByBomb,
      null,
      this
    );

    // Spawn bomb at the start
    // const totalBombs = 50;

    // for (let i = 0; i < totalBombs; i++) {
    //   this.bombSpawner.spawn(this.player.x);
    // }

    // KEYS
    this.cursors = this.input.keyboard.createCursorKeys();

    // SCORE
    this.scoreLabel = this.createScoreLabel(
      this.width * 0.08,
      this.height * 0.1,
      0
    ).setScrollFactor(0);

    // CAMERA
    const cameraWidth = this.width * 2;
    const cameraHeight = this.height * 2;
    this.cameras.main.setBounds(0, 0, cameraWidth, cameraHeight);
    this.cameras.main.startFollow(this.player);
    this.physics.world.bounds.width = cameraWidth;
    this.physics.world.bounds.height = cameraHeight;
  }

  update() {
    if (this.isGameOver == false) {
      if (this.cursors.right.isDown) {
        this.player.setVelocityX(500);
        this.player.anims.play("right", true);
      } else if (this.cursors.left.isDown) {
        this.player.setVelocityX(-500);
        this.player.anims.play("left", true);
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
    } else {
      if (this.cursors.space.isDown) {
        this.scene.restart();
      }
    }
  }

  setBackground() {
    const bg = this.add.image(this.width * 0.5, this.height * 0.5, "bg-sky");
    bg.setScrollFactor(0);
    bg.setScale(3);
  }

  setPlatform() {
    this.platforms = this.physics.add.staticGroup();

    // Call create() method from this.physics.add.staticGroup() to create a platform
    const base = this.platforms.create(
      this.width * 0.5,
      this.height * 2.15,
      "ground"
    );
    base.setScale(15).refreshBody();

    this.platforms.create(this.width * 0.5, this.height * 1.6, GROUND);
    this.platforms
      .create(this.width * 0.3, this.height * 1.3, GROUND)
      .setScale(0.5)
      .refreshBody();
    this.platforms.create(this.width * 0, this.height * 1.2, GROUND);

    this.platforms.create(this.width * 0.05, this.height * 1.5, GROUND);

    this.platforms
      .create(this.width * 0.5, this.height * 1.05, GROUND)
      .setScale(1.5)
      .refreshBody();

    this.platforms
      .create(this.width * 0.7, this.height * 1.3, GROUND)
      .setScale(0.3)
      .refreshBody();

    // const totalPlatforms = 20;
    // let startX = this.width * 0.5;
    // let startY = this.height * 0;
    // let stepX, stepY;

    // for (let i = 0; i < totalPlatforms; i++) {
    //   stepX = Phaser.Math.Between(-500, 500);
    //   stepY = Phaser.Math.Between(100, 200);
    //   startX += stepX;
    //   startY += stepY;

    //   this.platforms.create(startX, startY, GROUND);
    // }
  }

  createPlayer() {
    this.player = this.physics.add.sprite(50, this.height * 1.8, PLAYER);

    this.player.setBounce(0.3);
    this.player.setCollideWorldBounds(true, 1, 1); // Set wall collision

    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers(PLAYER, { start: 0, end: 3 }),
      frameRate: 10,
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
    });
  }

  createStars(totalStars = 5) {
    // const star = this.add.image(400, 300, "star"); // Add the star image
    // this.physics.add.existing(star, false); // Add physics to star
    // star.body.setBounce(0.5, 0.5);
    // star.body.setCollideWorldBounds(true, 1, 1); // Add collision to wall

    // star.body.setVelocity(0, 0); // Move the star

    this.stars = this.physics.add.group({
      key: "star",
      repeat: totalStars - 1, // Always minus 1
      setXY: {
        x: this.width * Phaser.Math.FloatBetween(0.2, 0.5),
        y: this.height * 0.7,
        stepX: 100,
      },
    });

    this.stars.children.iterate((child) => {
      child.setBounceY(Phaser.Math.FloatBetween(0.5, 0.8));
      child.setVelocityX(Phaser.Math.Between(-200, 100));
      child.setCollideWorldBounds(true, 1, 1); // Set wall collision
    });
  }

  nextLevelStars() {
    this.createStars(5);
    this.starsLength = this.stars.getLength();
    console.log(this.starsLength);
    this.physics.add.overlap(
      this.stars,
      this.player,
      this.collectStar,
      null,
      this
    );
    this.physics.add.collider(this.stars, this.platforms); // Set collision between stars and platforms
    this.bombSpawner.setBombBounce(0.5);
    this.isAllStarsCollected = false;
  }

  collectStar(player, star) {
    star.disableBody(true, true);
    this.starsLength--;
    console.log(this.starsLength);

    this.scoreLabel.add(50);

    if (this.starsLength <= 0) {
      this.isAllStarsCollected = true;
    }
    if (this.isAllStarsCollected) {
      // Call new level
      this.nextLevelStars();
    }

    this.bombSpawner.spawn(player.x, player.y, 1);
  }

  hitByBomb(player) {
    console.log("HIT BY BOMB! GAME OVER");

    player.setTint(0xa1a1a1);
    player.anims.play("turn");
    player.rotation = 3;

    this.physics.world.removeCollider(this.playerPlatformColliders);
    this.player.setCollideWorldBounds(false); // Remove wall collision

    this.isGameOver = true;

    const gameOverStyle = {
      fontSize: "8rem",
      strokeThickness: 8,
      fill: "white",
      stroke: "white",
    };
    const gameOverText = this.add.text(
      this.width * 0.5,
      this.height * 0.4,
      "GAME OVER",
      gameOverStyle
    );
    gameOverText.setOrigin(0.5, 0.5);
    gameOverText.setScrollFactor(0);

    const restartStyle = {
      fontSize: "3.5rem",
      strokeThickness: 2,
      fill: "white",
    };
    const restartText = this.add.text(
      this.width * 0.5,
      this.height * 0.6,
      "Press SPACE key to\n restart the game",
      restartStyle
    );
    restartText.setOrigin(0.5, 0.5);
    restartText.setScrollFactor(0);
  }

  createScoreLabel(x, y, score) {
    const style = { fontSize: "2rem", fill: "white", strokeThickness: 1.5 };

    const label = new ScoreLabel(this, x, y, score, style).setOrigin(0.5, 0.5);

    this.add.existing(label); // Add your own Object type

    return label;
  }
}

export default Game;
