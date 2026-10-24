const config = {
    width: 800,
    height: 600,
    pixelArt: true,
    physics: { default: 'arcade' },
    dom: { createContainer: true },
    scene: { preload, create, update }
};
const game = new Phaser.Game(config);

let ship;
let cursors;
let meteors;

function preload() {
    this.load.image('ship', 'Assets/Main character.png');
    this.load.image('shipWalking', 'Assets/Main character walking.png');
    this.load.image('meteor', 'Assets/Bunny.png');
}

function create() { 
    ship = this.physics.add.sprite(400, 530, 'ship');
ship.setScale(2);
ship.setCollideWorldBounds(true);

this.anims.create({
    key: 'walk',
    frames: [{ key: 'ship' }, { key: 'shipWalking' }],
    frameRate: 6,
    repeat: -1
});

cursors = this.input.keyboard.createCursorKeys();
meteors = this.physics.add.group();
this.time.addEvent({ delay: 1000, callback: spawnMeteor, loop: true });
}
function update() {
    ship.setVelocity(0);

    if (cursors.left.isDown) {
        ship.setVelocityX(-350);
    } else if (cursors.right.isDown) {
        ship.setVelocityX(350);
    }

    if (cursors.left.isDown || cursors.right.isDown) {
        ship.anims.play('walk', true);
    } else {
        ship.anims.stop();
        ship.setTexture('ship');
    }
}
function spawnMeteor() {
    const x = Phaser.Math.Between(20, 780);
    const meteor = meteors.create(x, -40, 'meteor');

    meteor.setVelocity(0, Phaser.Math.Between(150, 300));
}
