import React, { Component } from 'react';
import { harmonyConnect } from '../src/base/features/harmony-redux-react-connect';
import MonoBehaviourObserver from './framework/engine/MonoBehaviorObserver';
import Player from './framework/player';

class Game extends Component {

    constructor (props) {
        super();

        // Properties
        this.game = null;
        this.platforms = null;
        this.player = null;
        this.cursors = null;
        this.starts = null;
        this.score = 0;
        this.scoreText = '';

    }

    render () {
        return (
            <div style={{'textAlign': 'center'}}>
                <button onClick={this.start.bind(this)} className="btn btn-success" style={{float: 'left'}}>Start</button>
                <button onClick={this.restart.bind(this)} className="btn btn-primary" >Restart</button>
                <button onClick={this.quitGame.bind(this)} className="btn btn-danger" style={{float: 'right'}}>stop</button>

                <br/><br/>

                <div id="game"></div>
            </div>
        );
    }

    componentWillUnmount() {
        this.quitGame();
    }

    start() {
        if(!this.game)
            this.game = new window.Phaser.Game(800, 600, window.Phaser.AUTO, 'game', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
    }

    quitGame() {
        this.game.destroy();
        this.game = null;
    }

    restart() {
        this.quitGame();
        this.start();
    }

    preload() {
        MonoBehaviourObserver.preloadAll();

        this.game.load.image('sky', 'game/assets/sky.png');
        this.game.load.image('ground', 'game/assets/platform.png');
        this.game.load.image('star', 'game/assets/star.png');
        this.game.load.spritesheet('dude', 'game/assets/dude.png', 32, 48);
    }

    create() {
        MonoBehaviourObserver.createAll();

        this.createWorld();
        this.createPlayer();
        this.createStars();

        this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    }

    update() {
        MonoBehaviourObserver.updateAll();


        this.playerControl();
    }

    playerControl() {
        //  Collide the player and the stars with the platforms
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        this.game.physics.arcade.collide(this.stars, this.platforms);
        let hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms);

        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;

            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;

            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();

            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown && this.player.body.touching.down && hitPlatform)
        {
            this.player.body.velocity.y = -330;
        }
    }

    createPlayer() {

        this.cursors = this.game.input.keyboard.createCursorKeys();

        // The player and its settings
        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'dude');

        //  We need to enable physics on the player
        this.game.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;

        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    }

    createWorld() {
        //  We're going to be using physics, so enable the Arcade Physics system
        this.game.physics.startSystem(window.Phaser.Physics.ARCADE);

        //  A simple background for our game
        this.game.add.sprite(0, 0, 'sky');

        //  The platforms group contains the ground and the 2 ledges we can jump on
        this.platforms = this.game.add.group();

        //  We will enable physics for any object that is created in this group
        this.platforms.enableBody = true;

        // Here we create the ground.
        let ground = this.platforms.create(0, this.game.world.height - 64, 'ground');

        //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
        ground.scale.setTo(2, 2);

        //  This stops it from falling away when you jump on it
        ground.body.immovable = true;

        //  Now let's create two ledges
        let ledge = this.platforms.create(400, 400, 'ground');

        ledge.body.immovable = true;

        ledge = this.platforms.create(-150, 250, 'ground');

        ledge.body.immovable = true;
    }

    createStars() {
        this.stars = this.game.add.group();

        this.stars.enableBody = true;

        //  Here we'll create 12 of them evenly spaced apart
        for (let i = 0; i < 12; i++)
        {
            //  Create a star inside of the 'stars' group
            let star = this.stars.create(i * 70, 0, 'star');

            //  Let gravity do its thing
            star.body.gravity.y = 100;

            //  This just gives each star a slightly random bounce value
            star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    }

    collectStar(player, star) {

        // Removes the star from the screen
        star.kill();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
    }

}

export default harmonyConnect(Game,
    (state) => {
        return {

        }
    },
    {

    }
);

