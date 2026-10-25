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
let gummyBunny;
let cursors;
let spaceKey;
let meteors;
let candies;
let gummyTreats;
let scene2Slimes;
let scene2Ground;
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
let missedBunniesThisRun = 0;
let gummyTreatsCollected = 0;
let unlockedAchievements = [];
let level = 1;
let backgroundMusic;
let backgroundImage;
let musicVolume = 0.35;
let soundEffectsVolume = 1;
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
let settingsButton;
let restartButton;
let achievementsButton;
let settingsPanel;
let achievementsPanel;
let settingsTitle;
let achievementsTitle;
let achievementsList;
let resetAchievementsButton;
let resetConfirmationPanel;
let resetConfirmationText;
let confirmResetButton;
let cancelResetButton;
let achievementToast;
let achievementToastTitle;
let achievementToastDescription;
let achievementToastSparkles = [];
let achievementToastQueue = [];
let achievementToastActive = false;
let musicVolumeLabel;
let soundEffectsVolumeLabel;
let musicSliderTrack;
let soundEffectsSliderTrack;
let musicSliderFill;
let soundEffectsSliderFill;
let musicSliderKnob;
let soundEffectsSliderKnob;
let musicVolumeValue;
let soundEffectsVolumeValue;
let settingsBackButton;
let skipToStageTwoButton;
let quickTravelDivider;
let quickTravelLabel;
let achievementsBackButton;
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
const scene2Dialogue = [
    'Welcome to the Gummy Grove!',
    'Our blue candies and donuts have scattered all across the grass.',
    'Collect 20 treats to help the kingdom restock its candy pantry!',
    'Beware of slimes! Jump on them to make them poof. Press UP or SPACE to jump!'
];
const scene2CompletionDialogue = 'You did it! The Gummy Grove is sweet again. Thanks for helping!';
const achievementStorageKey = 'rose-game-achievements';
const achievements = [
    { id: 'first-catch', name: 'First Catch', description: 'Catch your first falling bunny.' },
    { id: '20-bunnies', name: 'Bunny Helper', description: 'Collect 20 bunnies in one run.' },
    { id: '50-bunnies', name: 'Halfway There', description: 'Collect 50 bunnies in one run.' },
    { id: '100-bunnies', name: 'Sugar Kingdom Hero', description: 'Collect all 100 bunnies.' },
    { id: 'perfect-run', name: 'Perfect Forecast', description: 'Collect all 100 bunnies without missing any.' },
    { id: 'gummy-first', name: 'Gummy Taster', description: 'Pick up a treat in the Gummy Grove.' },
    { id: 'gummy-10', name: 'Gummy Gatherer', description: 'Collect 10 treats in the Gummy Grove.' },
    { id: 'gummy-20', name: 'Gummy Grove Hero', description: 'Collect all 20 treats in the Gummy Grove.' },
    { id: 'ouch', name: 'Ouch..', description: "You ignored the red bunnies task and continued on" }
];

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
    this.load.image('scene2PlayerIdle', 'Assets/player idle.png');
    this.load.image('scene2PlayerIdle2', 'Assets/player idle 2.png');
    this.load.image('scene2Background', 'background 2.jpg');
    this.load.image('gummyBunny', 'Assets/gummy bunny.png');
    this.load.image('gummyBunnyIdle', 'Assets/gummy bunny idle.png');
    this.load.image('blueCandy', 'Assets/Candy blue.png');
    this.load.image('donut', 'Assets/donut.png');
    this.load.image('slime', 'Assets/slime.png');
    this.load.audio('backgroundMusic', 'Assets/background music.mp3');
    this.load.audio('scene2BackgroundMusic', 'Assets/Background music 2.mp3');
    this.load.audio('bunnyCollectSound', 'Assets/Bunny collect sound.mp3');
    this.load.audio('levelRewardSound', 'Assets/reward que.mp3');
}

function create() { 
    gamePhase = 'approach';
    dialogueIndex = 0;
    bunniesCollected = 0;
    missedBunniesThisRun = 0;
    gummyTreatsCollected = 0;
    unlockedAchievements = loadAchievements();
    achievementToastQueue = [];
    achievementToastActive = false;
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
    backgroundMusic = this.sound.add('backgroundMusic', { loop: true, volume: musicVolume });
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
    backgroundImage = this.add.image(config.width / 2, config.height / 2 + 6, 'background')
        .setDisplaySize(config.width, config.height);

    ship = this.physics.add.sprite(400, 430, 'ship');
    ship.setScale(2);
    ship.setCollideWorldBounds(true);
    ship.body.setAllowGravity(false);
    sideBunny = this.add.sprite(650, 430, 'sideBunny').setScale(2);

    this.anims.create({
        key: 'walk',
        frames: [{ key: 'ship' }, { key: 'shipWalking' }],
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'idle',
        frames: [{ key: 'ship' }, { key: 'shipWalking' }],
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'scene2Walk',
        frames: [{ key: 'scene2PlayerIdle' }, { key: 'scene2PlayerIdle2' }],
        frameRate: 6,
        repeat: -1
    });
    this.anims.create({
        key: 'scene2Idle',
        frames: [{ key: 'scene2PlayerIdle' }, { key: 'scene2PlayerIdle2' }],
        frameRate: 1,
        repeat: -1
    });
    this.anims.create({
        key: 'gummyBunnyIdle',
        frames: [{ key: 'gummyBunny' }, { key: 'gummyBunnyIdle' }],
        frameRate: 2,
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
    const toastBackground = this.add.graphics();
    toastBackground.fillStyle(0x6d3c8f, 0.97);
    toastBackground.fillRoundedRect(0, 0, 270, 86, 14);
    toastBackground.lineStyle(3, 0xffd66b, 1);
    toastBackground.strokeRoundedRect(0, 0, 270, 86, 14);
    toastBackground.fillStyle(0xf08acb, 1);
    toastBackground.fillRoundedRect(5, 5, 7, 76, 4);
    toastBackground.fillStyle(0x4c2c70, 1);
    toastBackground.fillCircle(39, 43, 23);
    toastBackground.lineStyle(2, 0xffd66b, 1);
    toastBackground.strokeCircle(39, 43, 23);
    const toastBadge = this.add.text(39, 43, '★', {
        fontFamily: 'Arial, sans-serif',
        fontSize: '24px',
        color: '#ffd66b'
    }).setOrigin(0.5);
    const toastHeader = this.add.text(72, 10, 'ACHIEVEMENT UNLOCKED!', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '7px',
        color: '#ffd66b'
    });
    achievementToastTitle = this.add.text(72, 31, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: '#fff2fb',
        wordWrap: { width: 185 }
    });
    achievementToastDescription = this.add.text(72, 53, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '6px',
        color: '#f5d9ff',
        wordWrap: { width: 185 },
        lineSpacing: 2
    });
    achievementToastSparkles = [
        this.add.text(16, 13, '✦', { fontFamily: 'Arial, sans-serif', fontSize: '15px', color: '#fff2a6' }),
        this.add.text(247, 17, '✧', { fontFamily: 'Arial, sans-serif', fontSize: '17px', color: '#f8a9e2' }),
        this.add.text(250, 65, '✦', { fontFamily: 'Arial, sans-serif', fontSize: '13px', color: '#fff2a6' })
    ];
    achievementToastSparkles.forEach((sparkle) => sparkle.setOrigin(0.5).setAlpha(0));
    achievementToast = this.add.container(820, 502, [
        toastBackground,
        toastBadge,
        toastHeader,
        achievementToastTitle,
        achievementToastDescription,
        ...achievementToastSparkles
    ]).setDepth(60).setVisible(false);

    pauseButton = this.add.text(776, 16, 'PAUSE [P]', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#fff2fb',
        backgroundColor: '#a94f9c',
        padding: { x: 8, y: 8 }
    }).setOrigin(1, 0).setDepth(20).setInteractive({ useHandCursor: true });
    pauseOverlay = this.add.rectangle(400, 300, 800, 600, 0x171024, 0.78)
        .setDepth(30).setVisible(false);
    pausePanel = this.add.rectangle(400, 300, 400, 380, 0xa94f9c)
        .setStrokeStyle(4, 0x632c78).setDepth(31).setVisible(false);
    pauseTitle = this.add.text(400, 150, 'PAUSED', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '20px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    resumeButton = this.add.text(400, 220, 'RESUME', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 12 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    settingsButton = this.add.text(400, 280, 'SETTINGS', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 12 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    achievementsButton = this.add.text(400, 340, 'ACHIEVEMENTS', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 12 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    restartButton = this.add.text(400, 400, 'RESTART', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '14px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 12 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    achievementsPanel = this.add.rectangle(400, 300, 620, 500, 0xa94f9c)
        .setStrokeStyle(4, 0x632c78).setDepth(31).setVisible(false);
    achievementsTitle = this.add.text(400, 80, 'ACHIEVEMENTS', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '16px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    achievementsList = this.add.text(125, 130, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: '#fff2fb',
        lineSpacing: 5,
        wordWrap: { width: 550 }
    }).setDepth(32).setVisible(false);
    achievementsBackButton = this.add.text(400, 515, 'BACK', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 10 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    resetAchievementsButton = this.add.text(400, 465, 'RESET ACHIEVEMENTS', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '9px',
        color: '#fff2fb',
        backgroundColor: '#a94f75',
        padding: { x: 12, y: 10 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    resetConfirmationPanel = this.add.rectangle(400, 300, 440, 210, 0x4c2c70)
        .setStrokeStyle(4, 0xffd66b).setDepth(40).setVisible(false);
    resetConfirmationText = this.add.text(400, 250, 'Are you sure?\nThis will reset all achievements.', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#fff2fb',
        align: 'center',
        lineSpacing: 12
    }).setOrigin(0.5).setDepth(41).setVisible(false);
    confirmResetButton = this.add.text(310, 345, 'YES, RESET', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '9px',
        color: '#fff2fb',
        backgroundColor: '#a94f75',
        padding: { x: 12, y: 10 }
    }).setOrigin(0.5).setDepth(41).setInteractive({ useHandCursor: true }).setVisible(false);
    cancelResetButton = this.add.text(490, 345, 'CANCEL', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '9px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 12, y: 10 }
    }).setOrigin(0.5).setDepth(41).setInteractive({ useHandCursor: true }).setVisible(false);
    settingsPanel = this.add.rectangle(400, 300, 460, 460, 0xa94f9c)
        .setStrokeStyle(4, 0x632c78).setDepth(31).setVisible(false);
    settingsTitle = this.add.text(400, 170, 'SETTINGS', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '18px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    musicVolumeLabel = this.add.text(400, 235, 'MUSIC VOLUME', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '11px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    soundEffectsVolumeLabel = this.add.text(400, 335, 'SOUND EFFECTS', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '11px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    musicSliderTrack = this.add.rectangle(400, 280, 240, 12, 0x632c78)
        .setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    soundEffectsSliderTrack = this.add.rectangle(400, 380, 240, 12, 0x632c78)
        .setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    musicSliderFill = this.add.rectangle(280, 280, 1, 8, 0xffd66b)
        .setOrigin(0, 0.5).setDepth(33).setVisible(false);
    soundEffectsSliderFill = this.add.rectangle(280, 380, 1, 8, 0xffd66b)
        .setOrigin(0, 0.5).setDepth(33).setVisible(false);
    musicSliderKnob = this.add.circle(280, 280, 10, 0xfff2fb)
        .setDepth(34).setInteractive({ draggable: true, useHandCursor: true }).setVisible(false);
    soundEffectsSliderKnob = this.add.circle(280, 380, 10, 0xfff2fb)
        .setDepth(34).setInteractive({ draggable: true, useHandCursor: true }).setVisible(false);
    musicVolumeValue = this.add.text(400, 305, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    soundEffectsVolumeValue = this.add.text(400, 405, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '10px',
        color: '#fff2fb'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    quickTravelDivider = this.add.rectangle(400, 430, 300, 2, 0xffd66b)
        .setDepth(32).setVisible(false);
    quickTravelLabel = this.add.text(400, 443, 'QUICK TRAVEL', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: '#ffd66b'
    }).setOrigin(0.5).setDepth(32).setVisible(false);
    settingsBackButton = this.add.text(400, 510, 'BACK', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '12px',
        color: '#fff2fb',
        backgroundColor: '#548fc2',
        padding: { x: 14, y: 10 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    skipToStageTwoButton = this.add.text(400, 472, 'SKIP TO STAGE 2', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '9px',
        color: '#fff2fb',
        backgroundColor: '#a94f75',
        padding: { x: 12, y: 10 }
    }).setOrigin(0.5).setDepth(32).setInteractive({ useHandCursor: true }).setVisible(false);
    const scene = this;
    pauseButton.on('pointerdown', () => togglePause.call(scene));
    resumeButton.on('pointerdown', () => resumeGame.call(scene));
    settingsButton.on('pointerdown', () => showSettings());
    skipToStageTwoButton.on('pointerdown', () => skipToStageTwo.call(scene));
    achievementsButton.on('pointerdown', () => showAchievements());
    restartButton.on('pointerdown', () => scene.scene.restart());
    settingsBackButton.on('pointerdown', () => showPauseMenu());
    achievementsBackButton.on('pointerdown', () => showPauseMenu());
    resetAchievementsButton.on('pointerdown', () => showResetConfirmation(true));
    confirmResetButton.on('pointerdown', () => resetAchievements());
    cancelResetButton.on('pointerdown', () => showResetConfirmation(false));
    pauseOverlay.setInteractive();
    this.input.setDraggable(musicSliderKnob);
    this.input.setDraggable(soundEffectsSliderKnob);
    musicSliderTrack.on('pointerdown', (pointer) => setVolumeFromPointer('music', pointer.x));
    soundEffectsSliderTrack.on('pointerdown', (pointer) => setVolumeFromPointer('effects', pointer.x));
    musicSliderKnob.on('drag', (pointer, dragX) => setVolumeFromPointer('music', dragX));
    soundEffectsSliderKnob.on('drag', (pointer, dragX) => setVolumeFromPointer('effects', dragX));
    drawVolumeSliders();

    meteors = this.physics.add.group();
    candies = this.physics.add.group();
    gummyTreats = this.physics.add.group();
    scene2Slimes = this.physics.add.group();
    this.physics.add.overlap(ship, meteors, catchBunny, undefined, this);
    this.physics.add.overlap(ship, candies, collectCandy, undefined, this);
    this.physics.add.overlap(ship, gummyTreats, collectGummyTreat, undefined, this);
    this.physics.add.overlap(ship, scene2Slimes, stompSlime, undefined, this);
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

function loadAchievements() {
    try {
        const storedAchievements = JSON.parse(localStorage.getItem(achievementStorageKey) || '[]');
        if (!Array.isArray(storedAchievements)) {
            throw new Error('Stored achievements are not an array.');
        }
        return storedAchievements.filter((id) => achievements.some((achievement) => achievement.id === id));
    } catch (error) {
        console.error('Unable to load saved achievements:', error);
        return [];
    }
}

function saveAchievements() {
    try {
        localStorage.setItem(achievementStorageKey, JSON.stringify(unlockedAchievements));
    } catch (error) {
        console.error('Unable to save achievements:', error);
    }
}

function unlockAchievement(id, scene) {
    if (unlockedAchievements.includes(id)) {
        return;
    }

    unlockedAchievements.push(id);
    saveAchievements();
    if (achievementsList) {
        renderAchievements();
    }
    const achievement = achievements.find((entry) => entry.id === id);
    if (achievement) {
        achievementToastQueue.push(achievement);
        showNextAchievementToast(scene);
    }
}

function showNextAchievementToast(scene) {
    if (achievementToastActive || achievementToastQueue.length === 0) {
        return;
    }

    const achievement = achievementToastQueue.shift();
    achievementToastTitle.setText(achievement.name);
    achievementToastDescription.setText(achievement.description);
    achievementToast.setPosition(820, 502).setVisible(true);
    achievementToastActive = true;
    achievementToastSparkles.forEach((sparkle, index) => {
        sparkle.setAlpha(1).setScale(0.6);
        scene.tweens.add({
            targets: sparkle,
            scale: 1.2,
            alpha: 0.25,
            angle: index % 2 === 0 ? 18 : -18,
            duration: 450 + index * 120,
            yoyo: true,
            repeat: -1
        });
    });

    scene.tweens.add({
        targets: achievementToast,
        x: 518,
        duration: 450,
        ease: 'Back.Out',
        onComplete: () => {
            scene.time.delayedCall(2600, () => {
                scene.tweens.add({
                    targets: achievementToast,
                    x: 820,
                    duration: 350,
                    ease: 'Cubic.In',
                    onComplete: () => {
                        scene.tweens.killTweensOf(achievementToastSparkles);
                        achievementToastSparkles.forEach((sparkle) => sparkle.setAlpha(0));
                        achievementToast.setVisible(false);
                        achievementToastActive = false;
                        showNextAchievementToast(scene);
                    }
                });
            });
        }
    });
}

function renderAchievements() {
    achievementsList.setText(achievements.map((achievement) => {
        const unlocked = unlockedAchievements.includes(achievement.id);
        return `${unlocked ? '[UNLOCKED]' : '[LOCKED]'} ${achievement.name}\n${achievement.description}`;
    }).join('\n'));
}

function showResetConfirmation(show) {
    resetConfirmationPanel.setVisible(show);
    resetConfirmationText.setVisible(show);
    confirmResetButton.setVisible(show);
    cancelResetButton.setVisible(show);
}

function resetAchievements() {
    try {
        localStorage.setItem(achievementStorageKey, '[]');
        unlockedAchievements = [];
        renderAchievements();
        showResetConfirmation(false);
    } catch (error) {
        console.error('Unable to reset saved achievements:', error);
    }
}

function drawVolumeSliders() {
    musicSliderFill.width = 240 * musicVolume;
    musicSliderKnob.x = 280 + 240 * musicVolume;
    musicVolumeValue.setText(`${Math.round(musicVolume * 100)}%`);

    soundEffectsSliderFill.width = 240 * soundEffectsVolume;
    soundEffectsSliderKnob.x = 280 + 240 * soundEffectsVolume;
    soundEffectsVolumeValue.setText(`${Math.round(soundEffectsVolume * 100)}%`);
}

function setVolumeFromPointer(type, pointerX) {
    const volume = Phaser.Math.Clamp((pointerX - 280) / 240, 0, 1);
    if (type === 'music') {
        musicVolume = volume;
        if (backgroundMusic) {
            backgroundMusic.setVolume(musicVolume);
        }
    } else {
        soundEffectsVolume = volume;
    }
    drawVolumeSliders();
}

function showSettings() {
    pausePanel.setVisible(false);
    pauseTitle.setVisible(false);
    resumeButton.setVisible(false);
    settingsButton.setVisible(false);
    restartButton.setVisible(false);

    settingsPanel.setVisible(true);
    settingsTitle.setVisible(true);
    musicVolumeLabel.setVisible(true);
    soundEffectsVolumeLabel.setVisible(true);
    musicSliderTrack.setVisible(true);
    soundEffectsSliderTrack.setVisible(true);
    musicSliderFill.setVisible(true);
    soundEffectsSliderFill.setVisible(true);
    musicSliderKnob.setVisible(true);
    soundEffectsSliderKnob.setVisible(true);
    musicVolumeValue.setVisible(true);
    soundEffectsVolumeValue.setVisible(true);
    quickTravelDivider.setVisible(true);
    quickTravelLabel.setVisible(true);
    settingsBackButton.setVisible(true);
    skipToStageTwoButton.setVisible(
        !['transition', 'scene2Meet', 'scene2Dialogue', 'scene2', 'scene2Complete'].includes(gamePhase)
    );
    drawVolumeSliders();
}

function showAchievements() {
    pausePanel.setVisible(false);
    pauseTitle.setVisible(false);
    resumeButton.setVisible(false);
    settingsButton.setVisible(false);
    achievementsButton.setVisible(false);
    restartButton.setVisible(false);

    achievementsPanel.setVisible(true);
    achievementsTitle.setVisible(true);
    achievementsList.setVisible(true);
    resetAchievementsButton.setVisible(true);
    achievementsBackButton.setVisible(true);
    showResetConfirmation(false);
    renderAchievements();
}

function showPauseMenu() {
    settingsPanel.setVisible(false);
    settingsTitle.setVisible(false);
    musicVolumeLabel.setVisible(false);
    soundEffectsVolumeLabel.setVisible(false);
    musicSliderTrack.setVisible(false);
    soundEffectsSliderTrack.setVisible(false);
    musicSliderFill.setVisible(false);
    soundEffectsSliderFill.setVisible(false);
    musicSliderKnob.setVisible(false);
    soundEffectsSliderKnob.setVisible(false);
    musicVolumeValue.setVisible(false);
    soundEffectsVolumeValue.setVisible(false);
    quickTravelDivider.setVisible(false);
    quickTravelLabel.setVisible(false);
    settingsBackButton.setVisible(false);
    skipToStageTwoButton.setVisible(false);
    achievementsPanel.setVisible(false);
    achievementsTitle.setVisible(false);
    achievementsList.setVisible(false);
    resetAchievementsButton.setVisible(false);
    achievementsBackButton.setVisible(false);
    showResetConfirmation(false);

    pausePanel.setVisible(true);
    pauseTitle.setVisible(true);
    resumeButton.setVisible(true);
    settingsButton.setVisible(true);
    achievementsButton.setVisible(true);
    restartButton.setVisible(true);
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
    settingsButton.setVisible(true);
    achievementsButton.setVisible(true);
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
    settingsButton.setVisible(false);
    achievementsButton.setVisible(false);
    restartButton.setVisible(false);
    settingsPanel.setVisible(false);
    settingsTitle.setVisible(false);
    musicVolumeLabel.setVisible(false);
    soundEffectsVolumeLabel.setVisible(false);
    musicSliderTrack.setVisible(false);
    soundEffectsSliderTrack.setVisible(false);
    musicSliderFill.setVisible(false);
    soundEffectsSliderFill.setVisible(false);
    musicSliderKnob.setVisible(false);
    soundEffectsSliderKnob.setVisible(false);
    musicVolumeValue.setVisible(false);
    soundEffectsVolumeValue.setVisible(false);
    quickTravelDivider.setVisible(false);
    quickTravelLabel.setVisible(false);
    settingsBackButton.setVisible(false);
    skipToStageTwoButton.setVisible(false);
    achievementsPanel.setVisible(false);
    achievementsTitle.setVisible(false);
    achievementsList.setVisible(false);
    resetAchievementsButton.setVisible(false);
    achievementsBackButton.setVisible(false);
    showResetConfirmation(false);
}

function update() {
    if (Phaser.Input.Keyboard.JustDown(pauseKey)) {
        togglePause.call(this);
    }
    if (isPaused) {
        return;
    }

    sideBunny.setFlipX(ship.x > sideBunny.x);
    if (gummyBunny && gummyBunny.visible) {
        gummyBunny.setFlipX(ship.x > gummyBunny.x);
    }
    if (gamePhase === 'scene2Meet' || gamePhase === 'scene2') {
        ship.setVelocityX(0);
    } else {
        ship.setVelocity(0);
    }

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
        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            gamePhase = 'exit';
            dialogueText.setVisible(false);
            interactionText.setText('Walk right to continue').setVisible(true);
        }
        ship.anims.play('idle', true);
        return;
    } else if (gamePhase === 'scene2Meet') {
        const nearGummyBunny = Phaser.Math.Distance.Between(ship.x, ship.y, gummyBunny.x, gummyBunny.y) < 120;
        interactionText.setText(nearGummyBunny ? 'Press SPACE to talk' : 'Walk up to the gummy bunny');
        interactionText.setVisible(true);
        if (nearGummyBunny && Phaser.Input.Keyboard.JustDown(spaceKey)) {
            gamePhase = 'scene2Dialogue';
            dialogueIndex = 0;
            interactionText.setVisible(false);
            dialogueText.setText(`${scene2Dialogue[dialogueIndex]}\n\nPress SPACE to continue`).setVisible(true);
        }
    } else if (gamePhase === 'scene2Dialogue') {
        if (Phaser.Input.Keyboard.JustDown(spaceKey)) {
            dialogueIndex += 1;
            if (dialogueIndex < scene2Dialogue.length) {
                const prompt = dialogueIndex === scene2Dialogue.length - 1
                    ? 'Press SPACE to start'
                    : 'Press SPACE to continue';
                dialogueText.setText(`${scene2Dialogue[dialogueIndex]}\n\n${prompt}`);
            } else {
                startGummyMinigame.call(this);
            }
        }
        if (gamePhase === 'scene2Dialogue') {
            ship.setVelocity(0);
            ship.anims.play('scene2Idle', true);
            return;
        }
    } else if (gamePhase === 'scene2Complete') {
        ship.setVelocity(0);
        ship.anims.play('scene2Idle', true);
        return;
    }

    if (gamePhase === 'scene2Meet' || gamePhase === 'scene2') {
        const isJumping = Phaser.Input.Keyboard.JustDown(spaceKey)
            || Phaser.Input.Keyboard.JustDown(cursors.up);
        if (isJumping && (ship.body.blocked.down || ship.body.touching.down)) {
            ship.setVelocityY(-430);
        }

        if (cursors.left.isDown) {
            ship.setVelocityX(-250);
            ship.setFlipX(false);
            ship.anims.play('scene2Walk', true);
        } else if (cursors.right.isDown) {
            ship.setVelocityX(250);
            ship.setFlipX(true);
            ship.anims.play('scene2Walk', true);
        } else if (ship.body.velocity.y === 0) {
            ship.anims.play('scene2Idle', true);
        }
        if (gamePhase === 'scene2') {
            scene2Slimes.getChildren().forEach((slime) => {
                if (!slime.active || !slime.body.enable) {
                    return;
                }

                if (slime.x < 0 || slime.x > config.width) {
                    return;
                }

                const distanceX = ship.x - slime.x;
                const isNearby = Math.abs(distanceX) < 300 && Math.abs(ship.y - slime.y) < 140;
                slime.setVelocityX(Math.sign(distanceX) * (isNearby ? 55 : 35));
            });
        }
        return;
    }

    if (gamePhase === 'exit') {
        if (cursors.right.isDown) {
            ship.setVelocityX(250);
            ship.setFlipX(true);
            ship.anims.play('walk', true);
        } else {
            ship.anims.play('idle', true);
        }
        if (ship.getBounds().right >= config.width && gamePhase === 'exit') {
            transitionToSceneTwo.call(this);
        }
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
            ship.anims.play('idle', true);
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
        ship.anims.play('idle', true);
    }
}
function spawnMeteor() {
    if (gamePhase !== 'playing') {
        return;
    }

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
        if (gamePhase !== 'playing') {
            return;
        }
        spawnCandy.call(this);
        scheduleCandy.call(this);
    });
}

function startGummyMinigame() {
    gamePhase = 'scene2';
    gummyTreatsCollected = 0;
    ship.setVelocity(0, 0);
    scoreText.setText('Treats: 0 / 20').setVisible(true);
    dialogueText.setVisible(false);
    interactionText
        .setPosition(config.width / 2, 70)
        .setText('MOVE: LEFT / RIGHT   JUMP: UP / SPACE')
        .setVisible(true);
    scheduleGummyTreat.call(this);
    scheduleSlime.call(this);
}

function spawnCandy() {
    if (gamePhase !== 'playing') {
        return;
    }

    const candy = candies.create(Phaser.Math.Between(20, 780), -40, 'candy');
    candy.setScale(2);
    const speedIncrease = (level - 1) * 30;
    candy.setVelocity(0, Phaser.Math.Between(150 + speedIncrease, 300 + speedIncrease));
}

function scheduleGummyTreat() {
    this.time.delayedCall(900, () => {
        if (gamePhase !== 'scene2') {
            return;
        }

        if (gummyTreats.countActive(true) < 6) {
            const texture = Phaser.Math.Between(0, 1) === 0 ? 'blueCandy' : 'donut';
            const treat = gummyTreats.create(Phaser.Math.Between(50, 750), 520, texture);
            const targetScale = texture === 'blueCandy' ? 0.12 : 0.15;
            treat.setScale(targetScale * 0.65);
            treat.setAlpha(0);
            treat.setData('readyToCollect', false);
            treat.setImmovable(true);
            treat.setAllowGravity(false);
            this.tweens.add({
                targets: treat,
                alpha: 1,
                scale: targetScale,
                duration: 500,
                ease: 'Sine.easeIn',
                onComplete: () => {
                    if (treat.active) {
                        treat.setData('readyToCollect', true);
                    }
                }
            });
        }
        scheduleGummyTreat.call(this);
    });
}

function scheduleSlime() {
    this.time.delayedCall(3500, () => {
        if (gamePhase !== 'scene2') {
            return;
        }

        if (scene2Slimes.countActive(true) < 3) {
            const comesFromLeft = Phaser.Math.Between(0, 1) === 0;
            const slime = scene2Slimes.create(comesFromLeft ? -40 : config.width + 40, 532, 'slime');
            slime.setScale(0.12);
            slime.setAllowGravity(false);
            slime.body.setSize(330, 300, true);
            slime.setVelocityX(comesFromLeft ? 35 : -35);
        }
        scheduleSlime.call(this);
    });
}

function stompSlime(player, slime) {
    if (gamePhase !== 'scene2' || !slime.active || player.body.velocity.y <= 0) {
        return;
    }

    const previousBottom = player.body.prev.y + player.body.height;
    if (previousBottom > slime.body.top + 16) {
        return;
    }

    const poof = this.add.circle(slime.x, slime.y, 8, 0xffe5f5).setDepth(4);
    this.tweens.add({
        targets: poof,
        scale: 4,
        alpha: 0,
        duration: 240,
        onComplete: () => poof.destroy()
    });
    slime.disableBody(true, true);
    this.tweens.add({
        targets: slime,
        scale: 0,
        alpha: 0,
        duration: 180,
        onComplete: () => slime.destroy()
    });
    player.setVelocityY(-350);
}

function collectGummyTreat(ship, treat) {
    if (gamePhase !== 'scene2' || !treat.getData('readyToCollect')) {
        return;
    }

    treat.destroy();
    gummyTreatsCollected += 1;
    scoreText.setText(`Treats: ${gummyTreatsCollected} / 20`);
    this.sound.play('bunnyCollectSound', { volume: soundEffectsVolume });
    if (gummyTreatsCollected >= 1) {
        unlockAchievement('gummy-first', this);
    }
    if (gummyTreatsCollected >= 10) {
        unlockAchievement('gummy-10', this);
    }
    if (gummyTreatsCollected >= 20) {
        unlockAchievement('gummy-20', this);
        gamePhase = 'scene2Complete';
        gummyTreats.clear(true, true);
        interactionText.setVisible(false);
        dialogueText.setText(scene2CompletionDialogue).setVisible(true);
    }
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
            missedBunniesThisRun += 1;
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

    this.sound.play('bunnyCollectSound', { volume: soundEffectsVolume });
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
    if (bunniesCollected >= 1) {
        unlockAchievement('first-catch', this);
    }
    if (bunniesCollected >= 20) {
        unlockAchievement('20-bunnies', this);
    }
    if (bunniesCollected >= 50) {
        unlockAchievement('50-bunnies', this);
    }
    const newLevel = Math.floor(bunniesCollected / 20) + 1;
    if (newLevel > level || bunniesCollected >= 100) {
        this.sound.play('levelRewardSound', { volume: soundEffectsVolume });
    }
    if (newLevel > level && bunniesCollected < 100) {
        level = newLevel;
        levelText.setText(`Level: ${level}`);
        celebrateLevel.call(this);
    }

    if (bunniesCollected >= 100) {
        unlockAchievement('100-bunnies', this);
        if (missedBunniesThisRun === 0) {
            unlockAchievement('perfect-run', this);
        }
        gamePhase = 'complete';
        spawnEvent.paused = true;
        meteors.getChildren().forEach((bunny) => bunny.setVelocity(0, 0));
        dialogueText.setText(`${completionDialogue}\n\nPress SPACE to continue`).setVisible(true);
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

function enterSceneTwo() {
    gamePhase = 'scene2Meet';
    interactionText.setVisible(false);
    dialogueText.setVisible(false);
    scoreText.setVisible(false);
    progressBar.setVisible(false);
    levelText.setVisible(false);
    levelCompleteText.setVisible(false);
    sugarCrashText.setVisible(false);
    sideBunny.setVisible(false);
    scoreText.setText('Treats: 0 / 20').setVisible(false);
    meteors.clear(true, true);
    candies.clear(true, true);
    gummyTreats.clear(true, true);
    scene2Slimes.clear(true, true);

    backgroundImage.setTexture('scene2Background')
        .setPosition(config.width / 2, 270)
        .setDisplaySize(990, 660);
    ship.setPosition(80, 455).setTexture('scene2PlayerIdle').setFlipX(true);
    ship.setVelocity(0, 0);
    ship.body.setAllowGravity(true);
    ship.body.setGravityY(1100);
    scene2Ground = this.add.rectangle(config.width / 2, 565, config.width, 30).setVisible(false);
    this.physics.add.existing(scene2Ground, true);
    this.physics.add.collider(ship, scene2Ground);
    ship.anims.play('scene2Idle', true);
    gummyBunny = this.add.sprite(650, 455, 'gummyBunny').setScale(2);
    gummyBunny.play('gummyBunnyIdle');
    interactionText.setText('Walk up to the gummy bunny').setVisible(true);

    if (backgroundMusic) {
        backgroundMusic.stop();
        backgroundMusic.destroy();
    }
    backgroundMusic = this.sound.add('scene2BackgroundMusic', {
        loop: true,
        volume: musicVolume
    });
    backgroundMusic.play();
}

function skipToStageTwo() {
    if (['transition', 'scene2Meet', 'scene2Dialogue', 'scene2', 'scene2Complete'].includes(gamePhase)) {
        return;
    }

    unlockAchievement('ouch', this);
    cheering = false;
    resumeGame.call(this);
    sideBunny.anims.stop();
    sideBunny.setTexture('angrySideBunny').setFlipX(ship.x > sideBunny.x).setVisible(true);
    gamePhase = 'skipReaction';
    this.time.delayedCall(1200, () => {
        transitionToSceneTwo.call(this);
    });
}

function transitionToSceneTwo() {
    if (gamePhase === 'transition') {
        return;
    }

    gamePhase = 'transition';
    const camera = this.cameras.main;
    camera.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        enterSceneTwo.call(this);
        camera.fadeIn(600, 0, 0, 0);
    });
    camera.fadeOut(600, 0, 0, 0);
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
