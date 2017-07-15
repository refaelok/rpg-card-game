import React, { Component } from 'react';
import { harmonyConnect } from '../src/base/features/harmony-redux-react-connect';
import MonoBehaviourObserver from './framework/engine/MonoBehaviour/MonoBehaviorObserver';
import gameObject from './framework/GameObject';

import Player from './objects/player';
import Sky from './objects/Sky';
import Ground from './objects/Ground';
import Stars from './objects/Stars';
import Score from './objects/Score';

class Game extends Component {

    constructor (props) {
        super();

        gameObject.addComponent('sky', new Sky());
        gameObject.addComponent('ground', new Ground());
        gameObject.addComponent('player', new Player());
        gameObject.addComponent('stars', new Stars());
        gameObject.addComponent('score', new Score());

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
        window.game = new window.Phaser.Game(800, 600, window.Phaser.AUTO, 'game', { preload: this.preload.bind(this), create: this.create.bind(this), update: this.update.bind(this) });
    }

    quitGame() {
        window.game.destroy();
        window.game = null;
    }

    restart() {
        this.quitGame();
        this.start();
    }

    preload() {
        MonoBehaviourObserver.preloadAll();
    }

    create() {
        MonoBehaviourObserver.createAll();

        //  We're going to be using physics, so enable the Arcade Physics system
        window.game.physics.startSystem(window.Phaser.Physics.ARCADE);
    }

    update() {
        MonoBehaviourObserver.updateAll();
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

