import { GameEngine, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import Kombat from './Kombat';
import Wall from './Wall';
import Bullet from './Bullet';
import Granade from './Granade';
import Blood from './Blood';
import Explosion2 from './Explosion2';

export default class KombatGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                autoResolve: true,
            }
        });
     
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
                if(step  >= player.last_shot + 15){
                    player.last_shot = step;
                    this.emit('shoot', player);
                }
            }
            else if (inputData.input === 'throw_power'){
                player.throwing_granade = 1;
                player.throw_power = .03;
            }
            else if (inputData.input === 'granade'){

                player.throwing_granade = 0;
                this.emit('granade', player);
            }
            else if(inputData.input === 'step') {

                let speed;
                let x = 0;
                let y = 0;

                if( player.throwing_granade === 1 ){
                    speed = 0.16;
                }
                else if( step  <= player.last_shot + 15 ){
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
    }

    handleCollision(e){
        if(e.o1 instanceof Kombat){
            if(e.o2 instanceof Bullet){
                this.handleBulletHit(e.o1, e.o2)
            }
        }
        else if(e.o1 instanceof Bullet){
            if(e.o2 instanceof Kombat){
                this.handleBulletHit(e.o2, e.o1)
            }
            else if( e.o2 instanceof Wall){
                this.destroyObjectById(e.o1.id);
            }
        }
        else if(e.o1 instanceof Wall){
            if(e.o2 instanceof Bullet){
                this.destroyObjectById(e.o2.id);
            }
        }
    }

    handleBulletHit(kombat, bullet){
        this.destroyObjectById(bullet.id);
        kombat.health--;
        let blood = new Blood(this, null, { position: kombat.position.clone() });
        this.addObjectToWorld(blood);
        this.timer.add(600, this.destroyObjectById, this, [blood.id]);
        if(kombat.health <= 0){
            this.destroyObjectById(kombat.id);
        }
    }

    destroyObjectById(id){
        if (this.world.objects[id]) {
            this.removeObjectFromWorld(id);
        }   
    }

    postStep(stepInfo){
        let kombats = this.world.queryObjects({ instanceType : Kombat });
        kombats.forEach(kombat => {
            if(kombat.throw_power > 0){
                kombat.throw_power += .015
                if(kombat.throw_power  > 1){
                    kombat.throw_power = 1
                }
            }
        });
    }
}