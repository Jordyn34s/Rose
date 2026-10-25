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
let candies;
let spawnEvent;
let caughtBunny = false;
let failedToCollect = false;
let sugarCrashed = false;
let cheering = false;
let catchTimer;
let failTimer;
let sugarCrashTimer;
let cheerTimer;
let bunniesCollected = 0;
let level = 1;
let scoreText;
let levelText;
let levelCompleteText;
let sugarCrashText;

function preload() {
    this.load.image('ship', 'Assets/Main character.png');
    this.load.image('shipWalking', 'Assets/Main character walking.png');
    this.load.image('background', 'Assets/Background.jpg');
    this.load.image('candy', 'Assets/Candy.png');
    this.load.image('failIdle', 'Assets/Fail idle.png');
    this.load.image('walkingFail', 'Assets/Walking fail.png');
    this.load.image('meteor', 'Assets/Bunny.png');
    this.load.image('meteor2', 'Assets/Bunny 2.png');
    this.load.image('bunnyCatch', 'Assets/Bunny catch.png');
    this.load.image('bunnyCatch2', 'Assets/Bunny catch 2.png');
    this.load.image('cheer1', 'Assets/Cheer 1.png');
    this.load.image('cheer2', 'Assets/Cheer 2.png');
}

function create() { 
    this.add.image(config.width / 2, config.height / 2 + 6, 'background')
        .setDisplaySize(config.width, config.height);

    ship = this.physics.add.sprite(400, 530, 'ship');
    ship.setScale(2);
    ship.setCollideWorldBounds(true);

    this.anims.create({
        key: 'walk',
        frames: [{ key: 'ship' }, { key: 'shipWalking' }],
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'cheer',
        frames: [{ key: 'cheer1' }, { key: 'cheer2' }],
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'failWalk',
        frames: [{ key: 'failIdle' }, { key: 'walkingFail' }],
        frameRate: 6,
        repeat: -1
    });

    scoreText = this.add.text(16, 16, 'Bunnies collected: 0', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fff2fb',
        backgroundColor: '#a94f9c',
        stroke: '#632c78',
        strokeThickness: 3,
        shadow: { offsetX: 2, offsetY: 3, color: '#54246b', blur: 0, fill: true },
        padding: { x: 8, y: 8 }
    });
    levelText = this.add.text(16, 48, 'Level: 1', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#f4ffff',
        backgroundColor: '#548fc2',
        stroke: '#315b91',
        strokeThickness: 3,
        shadow: { offsetX: 2, offsetY: 3, color: '#315b91', blur: 0, fill: true },
        padding: { x: 8, y: 8 }
    });
    levelCompleteText = this.add.text(400, 200, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '20px',
        color: '#fff4b8',
        backgroundColor: '#a94f9c',
        stroke: '#632c78',
        strokeThickness: 4,
        shadow: { offsetX: 3, offsetY: 4, color: '#54246b', blur: 0, fill: true },
        padding: { x: 12, y: 12 }
    }).setOrigin(0.5).setVisible(false);
    sugarCrashText = this.add.text(400, 280, 'Sugar crash! slowed down for 2 seconds!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fff4b8',
        backgroundColor: '#a94f75',
        stroke: '#632c4f',
        strokeThickness: 3,
        shadow: { offsetX: 2, offsetY: 3, color: '#54243f', blur: 0, fill: true },
        padding: { x: 8, y: 8 },
        align: 'center'
    }).setOrigin(0.5).setVisible(false);

    cursors = this.input.keyboard.createCursorKeys();
    meteors = this.physics.add.group();
    candies = this.physics.add.group();
    this.physics.add.overlap(ship, meteors, catchBunny, undefined, this);
    this.physics.add.overlap(ship, candies, collectCandy, undefined, this);
    spawnEvent = this.time.addEvent({ delay: 1000, callback: spawnMeteor, loop: true });
    scheduleCandy.call(this);
}
function update() {
    ship.setVelocity(0);

    if (!cheering) {
        checkMissedBunnies.call(this);
        checkMissedCandies();
    }

    if (cursors.left.isDown) {
        ship.setVelocityX(sugarCrashed ? -175 : -350);
        ship.setFlipX(false);
    } else if (cursors.right.isDown) {
        ship.setVelocityX(sugarCrashed ? 175 : 350);
        ship.setFlipX(true);
    }

    if (caughtBunny) {
        ship.anims.stop();
        return;
    }

    if (cheering) {
        ship.anims.play('cheer', true);
        return;
    }

    if (failedToCollect) {
        if (cursors.left.isDown || cursors.right.isDown) {
            ship.anims.play('failWalk', true);
        } else {
            ship.anims.stop();
            ship.setTexture('failIdle');
        }
        return;
    }

    if (sugarCrashed) {
        if (cursors.left.isDown || cursors.right.isDown) {
            ship.anims.play('failWalk', true);
        } else {
            ship.anims.stop();
            ship.setTexture('failIdle');
        }
        return;
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
    const texture = Phaser.Math.Between(0, 1) === 0 ? 'meteor' : 'meteor2';
    const meteor = meteors.create(x, -40, texture);

    meteor.setScale(2);
    setBunnyFallSpeed(meteor);
}

function setBunnyFallSpeed(bunny) {
    const speedIncrease = (level - 1) * 30;
    bunny.setVelocity(0, Phaser.Math.Between(150 + speedIncrease, 300 + speedIncrease));
}

function scheduleCandy() {
    this.time.delayedCall(Phaser.Math.Between(8000, 15000), () => {
        spawnCandy.call(this);
        scheduleCandy.call(this);
    });
}

function spawnCandy() {
    const candy = candies.create(Phaser.Math.Between(20, 780), -40, 'candy');
    candy.setScale(2);
    const speedIncrease = (level - 1) * 30;
    candy.setVelocity(0, Phaser.Math.Between(150 + speedIncrease, 300 + speedIncrease));
}

function checkMissedCandies() {
    candies.getChildren().slice().forEach((candy) => {
        if (candy.getBounds().top >= config.height) {
            candy.destroy();
        }
    });
}

function checkMissedBunnies() {
    meteors.getChildren().slice().forEach((bunny) => {
        if (bunny.getBounds().bottom >= config.height) {
            bunny.destroy();
            showFailedToCollect.call(this);
        }
    });
}

function collectCandy(ship, candy) {
    candy.destroy();
    sugarCrashed = true;
    sugarCrashText.setVisible(true);
    if (sugarCrashTimer) {
        sugarCrashTimer.remove(false);
    }
    sugarCrashTimer = this.time.delayedCall(2000, () => {
        sugarCrashed = false;
        sugarCrashText.setVisible(false);
        if (!caughtBunny && !failedToCollect && !cheering) {
            ship.anims.stop();
            ship.setTexture('ship');
        }
    });
}

function showFailedToCollect() {
    failedToCollect = true;
    if (failTimer) {
        failTimer.remove(false);
    }
    failTimer = this.time.delayedCall(500, () => {
        failedToCollect = false;
    });
}

function catchBunny(ship, bunny) {
    const catchTexture = bunny.texture.key === 'meteor2' ? 'bunnyCatch2' : 'bunnyCatch';
    failedToCollect = false;
    if (failTimer) {
        failTimer.remove(false);
    }
    ship.setTexture(catchTexture);
    ship.anims.stop();
    caughtBunny = true;
    bunny.destroy();
    bunniesCollected += 1;
    scoreText.setText(`Bunnies collected: ${bunniesCollected}`);
    const newLevel = Math.floor(bunniesCollected / 20) + 1;
    if (newLevel > level) {
        level = newLevel;
        levelText.setText(`Level: ${level}`);
        celebrateLevel.call(this);
    }

    if (catchTimer) {
        catchTimer.remove(false);
    }
    catchTimer = this.time.delayedCall(300, () => {
        caughtBunny = false;
    });
}

function celebrateLevel() {
    cheering = true;
    levelCompleteText.setText(`Level ${level} complete!`).setVisible(true);
    this.physics.world.pause();
    spawnEvent.paused = true;

    if (cheerTimer) {
        cheerTimer.remove(false);
    }
    cheerTimer = this.time.delayedCall(1500, () => {
        cheering = false;
        levelCompleteText.setVisible(false);
        ship.anims.stop();
        if (!caughtBunny && !failedToCollect) {
            ship.setTexture('ship');
        }
        meteors.getChildren().forEach(setBunnyFallSpeed);
        this.physics.world.resume();
        spawnEvent.paused = false;
    });
}
