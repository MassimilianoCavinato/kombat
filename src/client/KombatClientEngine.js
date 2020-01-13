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
        this.mouseIsDown = false;
        // restart game
        document.querySelector('#try-again').addEventListener('click', () => {
            window.location.reload();
        });
        // show try-again button
        gameEngine.on('objectDestroyed', (obj) => {
            if (obj.playerId === gameEngine.playerId && obj.type === "Kombat") {
                document.querySelector('#try-again').style.display = "block";
            }
        });

        this.mouseX = null;
        this.mouseY = null;
        document.addEventListener('mouseenter', this.updateMouseXY.bind(this), false);
        document.addEventListener('mousemove', this.updateMouseXY.bind(this), false);
        document.addEventListener('mousedown', () => this.mouseIsDown = true );
        document.addEventListener('mouseup', () => this.mouseIsDown = false);
        this.gameEngine.on('client__preStep', this.preStep.bind(this));
    }

    updateMouseXY(e) {
        e.preventDefault();
        this.mouseX = e.pageX - 400;
        this.mouseY = e.pageY - 300;
    }
    
    preStep() {
        let debugContainer = document.getElementById('debug');
        let player = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });
        if(player === null){
            debugContainer.innerHTML = ``;
        }
        else{
            if (this.mouseY){
                let angle = Math.atan2(this.mouseY, this.mouseX);
                this.sendInput(angle, { movement: true });
                if(this.mouseIsDown === true){
                    this.sendInput("shoot", { repeat: true });
                }

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
                X: ${this.mouseX}
                <br/> 
                Y: ${this.mouseY}
                <br/> 
                ----------------------------
                <br/>
                Angle: ${angle}
                <br/>
                ----------------------------
                 <br/>
                IsShooting: ${this.isShooting}
                <br/>
                ----------------------------
            `
            }
           
        }
    }
}
