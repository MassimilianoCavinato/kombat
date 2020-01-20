import { GameEngine, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import Kombat from './Kombat';
import Wall from './Wall';
import Bullet from './Bullet';
import Granade from './Granade';
import Blood from './Blood';
import Explosion2 from './Explosion2';
import DeadZone from './DeadZone';
import Heal2 from './Heal2';

export default class KombatGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                autoResolve: true,
            }
        });
        this.on('preStep', (stepInfo) => this.preStep(stepInfo));
        this.on('postStep', (stepInfo) => this.postStep(stepInfo));
        this.on('collisionStart', (e) => this.handleCollision(e));

        // game variables
        // Object.assign(this, {
        //     foodRadius: 0.1, 
        //     headRadius: 0.25, 
        //     bodyRadius: 0.1,
        //     eyeDist: 0.08, 
        //     eyeRadius: 0.03, 
        //     eyeAngle: 0.5,
        //     spaceWidth: 16, 
        //     spaceHeight: 9,
        //     moveDist: 0.06,
        //     foodCount: 16, 
        //     eatDistance: 0.3, 
        //     startBodyLength: 10, 
        //     aiCount: 3, 
        //     directionStop: 100,
        //     collideDistance: 1
        // });
    }

    registerClasses(serializer) {
        serializer.registerClass(Kombat);
        serializer.registerClass(Bullet);
        serializer.registerClass(Granade);
        serializer.registerClass(Wall);
        serializer.registerClass(Blood);
        serializer.registerClass(Explosion2);
        serializer.registerClass(DeadZone);
        serializer.registerClass(Heal2);
    }

    start() {
        super.start();
    }

    randPos() {
        let x = (Math.random() - 0.5) * this.spaceWidth;
        let y = (Math.random() - 0.5) * this.spaceHeight;
        return new TwoVector(x, y);
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);
        let player = this.world.queryObject({ playerId });
        
        if (player) {
            let step = inputData.step;
            if (inputData.input === 'shoot'){
                if(step  >= player.timer_shot + 10){
                    player.timer_shot = step;
                    this.emit('shoot', player);
                }
            }
            else if (inputData.input === 'throw_power'){
                if(player.granade_loaded > 0){
                    player.throwing_granade = 1;
                    player.throw_power = .03;
                }
            }
            else if (inputData.input === 'granade'){
                player.throwing_granade = 0;
                this.emit('granade', player);
            }
            else if (inputData.input === "reload"){
                if(player.ammo_loaded < player.ammo_capacity && player.ammo_loaded >= 0){
                    player.ammo_loaded = 0;
                    this.emit('shoot', player);
                }
            }
            else if (inputData.input === "pickup"){
                this.emit('pickup', player);
            }
            else if(inputData.input === 'step') {

                let speed;
                let x = 0;
                let y = 0;

                if( player.throwing_granade === 1 ){
                    speed = 0.16;
                }
                else if( step  <= player.timer_shot + 15 ){
                    speed = 0.21;
                }
                else{
                    speed = 0.24;
                }

                if(inputData.options.right){
                    x++;
                }
                if(inputData.options.left){
                    x--;
                }
                if(inputData.options.up){
                    y--;
                }
                if(inputData.options.down){
                    y++;
                }
                if(x == 0 && y === 0){
                    player.velocity.x = 0;
                    player.velocity.y = 0;
                }
                else{
                    let move_angle = Math.atan2(y, x);
                    player.velocity.x = speed * Math.cos(move_angle);
                    player.velocity.y = speed * Math.sin(move_angle);
                }
                
                player.direction =  inputData.options.angle;
            }
        }
        else{
            if (inputData.input === 'play'){
                this.emit('play', { playerId: inputData.options.playerId, name: inputData.options.name });
            }
        }
    }

    handleCollision(e){
        if(e.o1 instanceof Kombat){
            if(e.o2 instanceof Bullet){
                this.emit('bullethit', e.o1);
                this.destroyObjectById(e.o2.id);
            }
            else if(e.o2 instanceof Granade){
                this.checkBouce(e.o2, e.o1);
            }
        }
        else if(e.o1 instanceof Bullet){
            this.destroyObjectById(e.o1.id);
            if(e.o2 instanceof Kombat){
                this.emit('bullethit', e.o2);
            }
        }
        else if(e.o1 instanceof Wall){
            if(e.o2 instanceof Bullet){
                this.destroyObjectById(e.o2.id);
            }
            else if(e.o2 instanceof Granade){
                this.checkBounce(e.o2, e.o1);
            }
        }
        else if(e.o1 instanceof Granade){
            if(e.o2 instanceof Wall){
                this.checkBounce(e.o1, e.o2);
            }
            else if(e.o2 instanceof Kombat){
                this.checkBounce(e.o1, e.o2);
            }
        }
    }

    destroyObjectById(id){
        if (this.world.objects[id]) {
            this.removeObjectFromWorld(id);
        }   
    }


    checkBounce(a,b){

        let collision_side;
    
        if(a.position.x + a.width <= b.position.x ){ 
            //hitting from left;
            a.velocity.x = -Math.abs(a.prevVelocity.x);
    
        }
        else if(a.position.x >= b.position.x + b.width){
            //hitting from right
            a.velocity.x = Math.abs(a.prevVelocity.x);

        }
        else if(a.position.y < b.position.y){
            //hitting from top
            a.velocity.y = -Math.abs(a.prevVelocity.y);

        }
        else if(a.position.y > b.position.y){
            //hitting from bottom
            a.velocity.y = Math.abs(a.prevVelocity.y);
        }
    }

    preStep(stepInfo){
        let kombats = this.world.queryObjects({ instanceType : Kombat });
        kombats.forEach(kombat => {
            if(kombat.throw_power > 0){
                kombat.throw_power += .015
                if(kombat.throw_power  > 1){
                    kombat.throw_power = 1;
                }
            }
        });
    }

    postStep(stepInfo){
        let deadZone = this.world.queryObject({ instanceType : DeadZone });
        if(deadZone){
            deadZone.radius -= .03;

        }

    }
}