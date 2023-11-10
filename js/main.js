// Assuming Phaser 3.x
class DeepSeaDash extends Phaser.Scene {
    constructor() {
        super({ key: 'DeepSeaDash' });
    }

    preload() {
        this.load.image('sea', 'assets/Underwater_Afternoon_1.jpg');

        this.load.spritesheet('dude', 
        'assets/SpearFishing Assets Pack/Sprites/Diver-32x32/Diver 3.png',
        { frameWidth: 32, frameHeight: 32 }
    );
    }

    create() {
        this.add.image(400, 400, 'sea');
        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setScale(2); // Scale the player sprite by 1.5 times

        this.player.setGravityY(10);
        this.player.setDrag(100); // Adjust value to control resistance
        this.player.setMaxVelocity(200, 200); // Optional: Limit maximum speed
        this.player.setCollideWorldBounds(true); // Prevent player from going out of bounds

        this.cursors = this.input.keyboard.createCursorKeys(); // Initialize cursor keys for input
        

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    update() {
        // Movement logic using this.player
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160); // move left
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160); // move right
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0); // stop horizontal movement
            this.player.anims.play('turn');
        }
    
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-120); // move up
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(120); // move down
        }
    }
    

    collectTreasure(player, treasure) {
        // Logic for when the player collects a treasure
    }

    depositTreasures(player, collectionPoint) {
        // Logic for depositing treasures and possibly spawning new enemies
    }
}

const config = {
    type: Phaser.AUTO,
    width: 1150,
    height: 750,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 10 }, // Adjust as needed
            debug: false
        }
    },
    scene: [ DeepSeaDash ]
};

const game = new Phaser.Game(config);
