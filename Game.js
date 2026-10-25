const config = {
    width: 800,
    height: 600,
    pixelArt: true,
    audio: { disableWebAudio: true },
    physics: { default: 'arcade' },
    dom: { createContainer: true },
    scene: { preload, create, update }
};
const game = new Phaser.Game(config);

let ship;
let sideBunny;
let cursors;
let spaceKey;
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
let sideBunnyAngryTimer;
let bunniesCollected = 0;
let level = 1;
let backgroundMusic;
let scoreText;
let progressBar;
let levelText;
let levelCompleteText;
let sugarCrashText;
let interactionText;
let dialogueText;
let pauseKey;
let pauseButton;
let pauseOverlay;
let pausePanel;
let pauseTitle;
let resumeButton;
let restartButton;
let isPaused = false;
let gamePhase = 'approach';
let dialogueIndex = 0;

const openingDialogue = [
    'Oh, hello little blue bunny!',
    'could you help us?',
    'the sugar kingdom hasnt been the same ever since the princess got heartbroken..',
    'its a long story..',
    "but you're here now so you can help capture the bunnies that are falling from the sky!",
    'Why are they falling from the sky?',
    'Well its because the princess has been so absent that shes no longer giving orders to the people in charge of the weather.',
    "We'd appriciate it alot!",
    'Can you collect 100 bunnies for me?'
];
const completionDialogue = 'Great job! the sugar kingdom is forever greatful for your help!';

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
    this.load.image('sideBunny', 'Assets/side bunny .png');
    this.load.image('sideBunnyIdle', 'Assets/side bunny idle.png');
    this.load.image('happySideBunny', 'Assets/happy side.png');
    this.load.image('happySideBunny2', 'Assets/happy side 2.png');
    this.load.image('angrySideBunny', 'Assets/angry side.png');
    this.load.audio('backgroundMusic', 'Assets/background music.mp3');
    this.load.audio('bunnyCollectSound', 'Assets/Bunny collect sound.mp3');
}

function create() { 
    gamePhase = 'approach';
    dialogueIndex = 0;
    bunniesCollected = 0;
    level = 1;
    caughtBunny = false;
    failedToCollect = false;
    sugarCrashed = false;
    cheering = false;
    isPaused = false;
    this.time.paused = false;
    this.physics.world.resume();
    catchTimer = undefined;
    failTimer = undefined;
    sugarCrashTimer = undefined;
    cheerTimer = undefined;
    sideBunnyAngryTimer = undefined;
    backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: 0.35 });
    const startBackgroundMusic = () => {
        if (!isPaused && !backgroundMusic.isPlaying) {
            backgroundMusic.play();
        }
    };
    this.input.once('pointerdown', startBackgroundMusic);
    this.input.keyboard.once('keydown', startBackgroundMusic);
    this.events.once('shutdown', () => {
        backgroundMusic.stop();
        backgroundMusic.destroy();
        backgroundMusic = undefined;
    });
    this.add.image(config.width / 2, config.height / 2 + 6, 'background')
        .setDisplaySize(config.width, config.height);

    ship = this.physics.add.sprite(400, 430, 'ship');
    ship.setScale(2);
    ship.setCollideWorldBounds(true);
    sideBunny = this.add.sprite(650, 430, 'sideBunny').setScale(2);

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
    this.anims.create({
        key: 'sideBunnyIdle',
        frames: [{ key: 'sideBunny' }, { key: 'sideBunnyIdle' }],
        frameRate: 2,
        repeat: -1
    });
    this.anims.create({
        key: 'sideBunnyHappy',
        frames: [{ key: 'happySideBunny' }, { key: 'happySideBunny2' }],
        frameRate: 2,
        repeat: -1
    });
    sideBunny.play('sideBunnyIdle');

    scoreText = this.add.text(16, 16, 'Bunnies: 0 / 100', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fff2fb',
        backgroundColor: '#a94f9c',
        stroke: '#632c78',
        strokeThickness: 3,
        shadow: { offsetX: 2, offsetY: 3, color: '#54246b', blur: 0, fill: true },
        padding: { x: 8, y: 8 }
    });
    progressBar = this.add.graphics().setDepth(5);
    drawBunnyProgress();
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
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    interactionText = this.add.text(400, 420, 'Walk up to the side bunny', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fff2fb',
        backgroundColor: '#a94f9c',
        padding: { x: 8, y: 8 },
        align: 'center'
    }).setOrigin(0.5);
    dialogueText = this.add.text(400, 590, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#fff2fb',
        backgroundColor: '#a94f9c',
        stroke: '#632c78',
        strokeThickness: 3,
        padding: { x: 12, y: 12 },
        align: 'left',
        wordWrap: { width: 720 }
    }).setOrigin(0.5, 1).setDepth(10).setVisible(false);

    pauseButton = this.add.text(776, 16, 'PAUSE [P]', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#fff2fb',
        backgroundColor: '#a94f9c',
        padding: { x: 8, y: 8 }
    }).setOrigin(1, 0).setDepth(20).setInteractive({ useHandCursor: true });
    pauseOverlay = this.add.rectangle(400, 300, 800, 600, 0x171024, 0.78)
        .setDepth(30).setVisible(false);
    pausePanel = this.add.rectangle(400, 300, 360, 250, 0xa94f9c)
        .setStrokeStyle(4, 0x632c78).setDepth(31).setVisible(false);
    pauseTitle = this.add.text(400, 235, 'PAUSED', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '20px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    resumeButton = this.add.text(400, 305, 'RESUME', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 12 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    restartButton = this.add.text(400, 370, 'RESTART', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 12 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    const scene = this;
    pauseButton.on('pointerdown', () => togglePause.call(scene));
    resumeButton.on('pointerdown', () => resumeGame.call(scene));
    restartButton.on('pointerdown', () => scene.scene.restart());
    pauseOverlay.setInteractive();

    meteors = this.physics.add.group();
    candies = this.physics.add.group();
    this.physics.add.overlap(ship, meteors, catchBunny, undefined, this);
    this.physics.add.overlap(ship, candies, collectCandy, undefined, this);
    spawnEvent = this.time.addEvent({ delay: 1000, callback: spawnMeteor, loop: true });
    scheduleCandy.call(this);
}

function drawBunnyProgress() {
    progressBar.clear();
    progressBar.fillStyle(0x632c78);
    progressBar.fillRoundedRect(16, 84, 220, 14, 4);
    progressBar.fillStyle(0xffd66b);
    progressBar.fillRoundedRect(18, 86, 216 * (bunniesCollected / 100), 10, 3);
}

function togglePause() {
    if (isPaused) {
        resumeGame.call(this);
        return;
    }

    isPaused = true;
    this.physics.world.pause();
    this.time.paused = true;
    if (backgroundMusic && backgroundMusic.isPlaying) {
        backgroundMusic.pause();
    }
    pauseOverlay.setVisible(true);
    pausePanel.setVisible(true);
    pauseTitle.setVisible(true);
    resumeButton.setVisible(true);
    restartButton.setVisible(true);
}

function resumeGame() {
    isPaused = false;
    this.time.paused = false;
    if (!cheering) {
        this.physics.world.resume();
    }
    if (backgroundMusic && backgroundMusic.isPaused) {
        backgroundMusic.resume();
    }
    pauseOverlay.setVisible(false);
    pausePanel.setVisible(false);
    pauseTitle.setVisible(false);
    resumeButton.setVisible(false);
    restartButton.setVisible(false);
}

function update() {
    if (Phaser.Input.Keyboard.JustDown(pauseKey)) {
        togglePause.call(this);
    }
    if (isPaused) {
        return;
    }

    ship.setVelocity(0);

    if (gamePhase === 'approach') {
        const nearSideBunny = Phaser.Math.Distance.Between(ship.x, ship.y, sideBunny.x, sideBunny.y) < 120;
        interactionText.setText(nearSideBunny ? 'Press SPACE to talk' : 'Walk up to the side bunny');
        interactionText.setVisible(true);
        if (nearSideBunny && Phaser.Input.Keyboard.JustDown(spaceKey)) {
            gamePhase = 'openingDialogue';
            dialogueIndex = 0;
            interactionText.setVisible(false);
            dialogueText.setText(`${openingDialogue[dialogueIndex]}\n\nPress SPACE to continue`).setVisible(true);
        }
    } else if (gamePhase === 'openingDialogue') {
        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            dialogueIndex += 1;
            if (dialogueIndex < openingDialogue.length) {
                const prompt = dialogueIndex === openingDialogue.length - 1
                    ? 'Press SPACE to start collecting'
                    : 'Press SPACE to continue';
                dialogueText.setText(`${openingDialogue[dialogueIndex]}\n\n${prompt}`);
            } else {
                gamePhase = 'playing';
                dialogueText.setVisible(false);
            }
        }
    } else if (gamePhase === 'complete') {
        ship.setVelocity(0);
        ship.anims.stop();
        return;
    }

    if (gamePhase === 'approach') {
        if (cursors.left.isDown) {
            ship.setVelocityX(-250);
            ship.setFlipX(false);
        } else if (cursors.right.isDown) {
            ship.setVelocityX(250);
            ship.setFlipX(true);
        }
        if (cursors.left.isDown || cursors.right.isDown) {
            ship.anims.play('walk', true);
        } else {
            ship.anims.stop();
            ship.setTexture('ship');
        }
        return;
    }

    if (gamePhase !== 'playing') {
        ship.setVelocity(0);
        ship.anims.stop();
        return;
    }

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
    if (gamePhase !== 'playing') {
        return;
    }

    candy.destroy();
    showAngrySideBunny.call(this, 2000);
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
    showAngrySideBunny.call(this, 500);
    if (failTimer) {
        failTimer.remove(false);
    }
    failTimer = this.time.delayedCall(500, () => {
        failedToCollect = false;
    });
}

function showAngrySideBunny(duration) {
    if (sideBunnyAngryTimer) {
        sideBunnyAngryTimer.remove(false);
    }
    sideBunny.anims.stop();
    sideBunny.setTexture('angrySideBunny');
    sideBunnyAngryTimer = this.time.delayedCall(duration, () => {
        if (!cheering) {
            sideBunny.play('sideBunnyIdle', true);
        }
    });
}

function catchBunny(ship, bunny) {
    if (gamePhase !== 'playing') {
        return;
    }

    this.sound.play('bunnyCollectSound');
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
    scoreText.setText(`Bunnies: ${bunniesCollected} / 100`);
    drawBunnyProgress();
    const newLevel = Math.floor(bunniesCollected / 20) + 1;
    if (newLevel > level && bunniesCollected < 100) {
        level = newLevel;
        levelText.setText(`Level: ${level}`);
        celebrateLevel.call(this);
    }

    if (bunniesCollected >= 100) {
        gamePhase = 'complete';
        dialogueText.setText(completionDialogue).setVisible(true);
        interactionText.setVisible(false);
        return;
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
    sideBunny.play('sideBunnyHappy', true);
    levelCompleteText.setText(`Level ${level} complete!`).setVisible(true);
    this.physics.world.pause();
    spawnEvent.paused = true;

    if (cheerTimer) {
        cheerTimer.remove(false);
    }
    cheerTimer = this.time.delayedCall(1500, () => {
        cheering = false;
        sideBunny.play('sideBunnyIdle', true);
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
