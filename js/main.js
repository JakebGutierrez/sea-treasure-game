class DeepSeaDash extends Phaser.Scene {
    constructor() {
        super({ key: 'DeepSeaDash' });

        this.zones = {
            top: { minY: 0, maxY: 250, value: 10 },
            middle: { minY: 250, maxY: 500, value: 20 },
            bottom: { minY: 500, maxY: 750, value: 30 }
        };

        this.collectedTreasures = 0;
    }

    preload() {
        this.load.image('sea', 'assets/Underwater_Afternoon_1.jpg');

        this.load.spritesheet('dude', 
        'assets/SpearFishing Assets Pack/Sprites/Diver-32x32/Diver 3.png',
        { frameWidth: 32, frameHeight: 32 }
        );

        for (let i = 1; i <= 9; i++) {
            this.load.image(`treasure${i}`, `assets/treasures/${i}.png`);
        }
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

        this.treasures = {
            top: this.physics.add.group(),
            middle: this.physics.add.group(),
            bottom: this.physics.add.group()
        };

    
        this.spawnTreasures();

        Object.keys(this.treasures).forEach(zoneKey => {
            this.physics.add.collider(this.player, this.treasures[zoneKey], this.collectTreasure, null, this);
        });

        this.score = 0; // Initialize score
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#8FBC8F' // Dark Sea Green color
        });
        

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 5 }),
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
            frames: this.anims.generateFrameNumbers('dude', { start: 14, end: 19 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('dude', { start: 21, end: 26 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('dude', { start: 7, end: 12 }),
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
            this.player.anims.play('up');
        } else if (this.cursors.down.isDown) {
            this.player.setVelocityY(120); // move down
            this.player.anims.play('down');
        }
    }
    

    collectTreasure(player, treasure) {
        const points = treasure.getData('value');
        treasure.destroy(); // Remove the treasure from the game
        this.collectedTreasures++; // Increment the count of collected treasures

        this.score += points; // Add points to the score
        this.scoreText.setText('Score: ' + this.score); // Update the score display

        if (this.collectedTreasures >= 9) {
            this.collectedTreasures = 0; // Reset the count
            this.spawnTreasures(); // Respawn the treasures
        }
    
        // Update player's score or perform other actions
    }

    depositTreasures(player, collectionPoint) {
        // Logic for depositing treasures and possibly spawning new enemies
    }

    spawnTreasures() {
        const margin = 32; // Half of the treasure's width/height after scaling
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;

    Object.keys(this.zones).forEach(zoneKey => {
        const zone = this.zones[zoneKey];
        for (let i = 0; i < 3; i++) {
            const x = Phaser.Math.Between(margin, gameWidth - margin);
            const y = Phaser.Math.Between(zone.minY + margin, zone.maxY - margin);
                const treasureIndex = Phaser.Math.Between(1, 9); // Assuming 9 treasure sprites
                const treasure = this.physics.add.sprite(x, y, `treasure${treasureIndex}`).setScale(2);
                treasure.setData('value', zone.value);
                this.treasures[zoneKey].add(treasure);
                treasure.setData('value', zone.value);
    
                // Tween for bobbing animation
                this.tweens.add({
                    targets: treasure,
                    y: y - 10, // Move up by 10 pixels
                    duration: 800, // Duration of one bob
                    yoyo: true, // Go back to the original position
                    repeat: -1 // Repeat indefinitely
                });
            }
        });
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
