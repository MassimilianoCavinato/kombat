import { ClientEngine, KeyboardControls } from 'lance-gg';
import KombatRenderer from '../client/KombatRenderer';

export default class KombatClientEngine extends ClientEngine {

    constructor(gameEngine, options) {

        super(gameEngine, options, KombatRenderer);

        this.angle = 0;
        this.up = false;
        this.down = false;
        this.left = false;
        this.down = false;
        this.mouseIsDown = false;
        this.controls = new KeyboardControls(this);
        //LISTENERS
        document.querySelector('#try-again').addEventListener('click', () => window.location.reload());
        document.addEventListener('mouseenter', this.updateAngle.bind(this), false);
        document.addEventListener('mousemove', this.updateAngle.bind(this), false);
        document.addEventListener('mousedown', (e) => this.handleMouse(e) );
        document.addEventListener('mouseup', (e) => this.handleMouse(e));
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.gameEngine.on('client__preStep', () => this.preStep());
        this.gameEngine.on('objectDestroyed', (obj) => {
            if (obj.playerId === gameEngine.playerId && obj.type === "Kombat") {
                document.querySelector('#try-again').style.display = "block";
            }
        });
        setTimeout( () => document.getElementById('kombat-instructions').style.display = 'none', 5000);
    }

    updateAngle(e) {
        e.preventDefault();
        this.angle = Math.atan2(e.pageY - window.innerHeight/2, e.pageX - window.innerWidth/2);
    }
    
    preStep() {
        
        let player = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId });
        
        if(player !== null){
            
            this.sendInput('step', { 
                up: this.up,
                left: this.left,
                down: this.down,
                right: this.right,
                angle: this.angle
            });

            if(this.mouseIsDown === true){
                this.sendInput("shoot", { repeat: true });
            }
        }
    }

    handleKeyDown(e){
        if(e.isTrusted === true){
            if(e.key === "w" || e.key === "ArrowUp"){
                this.up = true;
            }
            else if(e.key === "a" || e.key === "ArrowLeft"){
                this.left = true;
            }
            else if(e.key === "s" || e.key === "ArrowDown"){
                this.down = true;
            }
            else if(e.key === "d" || e.key === "ArrowRight"){
                this.right = true;
            }
        }
    }

    handleKeyUp(e){
        if(e.isTrusted === true){
            if(e.key === "w" || e.key === "ArrowUp"){
                this.up = false;
            }
            else if(e.key === "a" || e.key === "ArrowLeft"){
                this.left = false;
            }
            else if(e.key === "s" || e.key === "ArrowDown"){
                this.down = false;
            }
            else if(e.key === "d" || e.key === "ArrowRight"){
                this.right = false;
            }
        }
    }

    handleMouse(e){
        e.preventDefault();
        if(e.isTrusted === true){
            if(e.which === 1){
                this.mouseIsDown = e.type === "mousedown";
            }
            else if(e.which === 3){
                if(e.type === 'mousedown'){
                    this.sendInput('throw_power', { repeat: false });
                }
                if(e.type === 'mouseup'){
                    this.sendInput('granade', { repeat: false });
                }
            }
        }
    }

}
