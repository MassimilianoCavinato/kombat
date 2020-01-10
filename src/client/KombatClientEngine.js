import { ClientEngine, KeyboardControls } from 'lance-gg';
import KombatRenderer from '../client/KombatRenderer';

export default class KombatClientEngine extends ClientEngine {

    constructor(gameEngine, options) {

        super(gameEngine, options, KombatRenderer);
        this.controls = new KeyboardControls(this);
        this.controls.bindKey('w', 'up', { repeat: true } );
        this.controls.bindKey('s', 'down', { repeat: true } );
        this.controls.bindKey('a', 'left', { repeat: true } );
        this.controls.bindKey('d', 'right', { repeat: true } );
        // restart game
        document.querySelector('#tryAgain').addEventListener('click', () => {
            window.location.reload();
        });
        // show try-again button
        gameEngine.on('objectDestroyed', (obj) => {
            if (obj.playerId === gameEngine.playerId && obj.type === "Kombat") {
                document.body.classList.add('lostGame');
                document.querySelector('#tryAgain').disabled = false;
            }
        });

        this.mouseX = null;
        this.mouseY = null;
        document.addEventListener('mousemove', this.updateMouseXY.bind(this), false);
        document.addEventListener('mouseenter', this.updateMouseXY.bind(this), false);
        document.addEventListener('mousedown', (e) => this.shoot(e));
        this.gameEngine.on('client__preStep', this.sendMouseAngle.bind(this));
    }

    updateMouseXY(e) {
        e.preventDefault();
        this.mouseX = e.pageX;
        this.mouseY = e.pageY;
    }

    sendMouseAngle() {
        let player = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });
        if (this.mouseY === null || player === null) return;
        let mouseX = (this.mouseX / this.zoom);
        let mouseY = (this.mouseY / this.zoom) ;
        let dx = mouseX;
        let dy = mouseY;
        let angle = Math.atan2(dx, dy);
        this.sendInput(angle, { movement: true });

        let debugContainer = document.getElementById('debug');
        debugContainer.innerHTML = `
            PlayerPos:
            <br/> 
            X: ${player.position.x}
            <br/> 
            Y: ${player.position.y}
            <br/>
            ----------------------------
            <br/>
            MousePos: 
            <br/> 
            X: ${dx}
            <br/> 
            Y: ${dy}
            <br/> 
            ----------------------------
            <br/>
            Direction: ${angle}
        `
    }

    shoot(){
        this.sendInput("shoot", { movement: true });
    }
}
