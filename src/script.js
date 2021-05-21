import Phaser from "phaser";

import HelloWorld from "./scenes/HelloWorld";
import Game from "./scenes/Game";

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 800 },
      debug: false,
    },
  },
  scene: [Game],

  //   backgroundColor: "#000000",
};

const game = new Phaser.Game(config);

// game.scene.add("game", Game);
// game.scene.add("hello-world", HelloWorld);

// game.scene.start("game");
// game.scene.start("hello-world");
