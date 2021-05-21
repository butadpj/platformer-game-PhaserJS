import Phaser from "phaser";

class HelloWorld extends Phaser.Scene {
  constructor() {
    super("hello-world");
  }
  preload() {}
  create() {
    this.add.text(400, 300, "Hello World").setOrigin(0.5, 0.5);
  }
}

export default HelloWorld;
