import { ClientEngine, KeyboardControls } from 'lance-gg';
import KombatRenderer from '../client/KombatRenderer';
import Kombat from '../common/Kombat';

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
        this.is_started = false;
        //LISTENERS
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));

        let GAME_CANVAS = document.getElementById('kc');
        GAME_CANVAS.width = 800;
        GAME_CANVAS.height = 600;
        GAME_CANVAS.addEventListener('mouseenter', (e) => this.updateAngle(e));
        GAME_CANVAS.addEventListener('mousemove', (e) => this.updateAngle(e));
        GAME_CANVAS.addEventListener('mousedown', (e) => this.handleMouse(e));
        GAME_CANVAS.addEventListener('mouseup', (e) => this.handleMouse(e));
        GAME_CANVAS.addEventListener('contextmenu', (e) => e.preventDefault());
        let NI = document.getElementById('kombat-name')
        let PB = document.getElementById('kombat-play-button');
        NI.addEventListener('click', e =>{
            NI.focus()
        });
        PB.addEventListener('click', e => {
            this.sendInput('play', { 
                repeat: false,
                playerId: this.gameEngine.playerId,
                name: document.querySelector('#kombat-name').value 
            });
            document.querySelector('#kombat-menu').style.display = "none";

        });
        this.gameEngine.on('client__preStep', () => this.preStep());
        this.gameEngine.on('objectDestroyed', (obj) => {
            if (obj.playerId === gameEngine.playerId && obj.type === "Kombat") {
                document.querySelector('#kombat-menu').style.display = "block";
            }
        });
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
            else if(e.key === "r"){
               this.sendInput('reload', { repeat: false });
            }
            else if(e.key === "f"){
               this.sendInput('pickup', { repeat: false });
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
