import Phaser from "phaser";
const GROUND = "ground";
const PLAYER = "player";
const BOMB = "bomb";

class LoadingScreen extends Phaser.Scene {
  constructor() {
    super({
      key: "loading-screen",
      pack: {
        files: [
          {
            type: "image",
            key: "bg-sky",
            url: "assets/sky.png",
          },
        ],
      },
    });
  }

  init() {
    this.percent;
    this.loadingText;
  }

  preload() {
    this.load.image("bg-sky", "assets/sky.png");
    this.load.image("star", "assets/star.png");
    this.load.image(GROUND, "assets/platform.png");
    this.load.image(BOMB, "assets/bomb.png");

    this.load.spritesheet(PLAYER, "assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48,
    });

    this.add.image(0, 0, "bg-sky").setScale(10).push;

    this.loadingText = this.add
      .text(
        this.scale.width * 0.5,
        this.scale.height * 0.5,
        `LOADING...${this.percent}`,
        { fontSize: "4rem", stroke: "white", strokeThickness: 3 }
      )
      .setOrigin(0.5);

    this.load.on("progress", (percent) => {
      //   loadingBar.fillRect(
      //     0,
      //     this.scale.height * 0.5,
      //     this.scale.width * percent,
      //     50
      //   );
      this.percent = Math.round(percent * 100 * 100) / 100;
      this.loadingText.setText(`LOADING...${this.percent}`);

      console.log(this.percent);
    });

    // this.load.on("complete", () => {
    //   console.log("complete!!");
    // });
  }

  create() {
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.scene.start("game-scene");
      },
      loop: true,
    });
  }
  update() {}
}

export default LoadingScreen;
