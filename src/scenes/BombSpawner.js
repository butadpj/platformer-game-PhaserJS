import Phaser from "phaser";

class BombSpawner {
  constructor(scene, bombKey) {
    this.scene = scene;
    this.key = bombKey;

    this.bombGroup = this.scene.physics.add.group();
  }

  get group() {
    return this.bombGroup;
  }

  spawn(playerX = 0, playerY = 0) {
    const x = playerX + Phaser.Math.Between(-200, 200);
    const y = playerY + Phaser.Math.Between(-300, -500);

    const bombs = this.group.create(x, y, this.key);

    bombs.setBounce(1);

    bombs.setCollideWorldBounds(true);
    bombs.setVelocity(Phaser.Math.Between(-200, 200), 20);

    return bombs;
  }
  setBombBounce(bounce = 1) {
    // const bombs = this.bombGroup;
    // bombs.setBounce(bounce);
    this.bombGroup.children.iterate((bomb) => {
      bomb.setBounce(bounce);
      bomb.setVelocityX(0);
    });
  }
}

export default BombSpawner;
