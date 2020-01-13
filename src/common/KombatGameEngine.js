import { GameEngine, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import Kombat from './Kombat';
import Wall from './Wall';
import Bullet from './Bullet';
import Blood from './Blood';

export default class KombatGameEngine extends GameEngine {

    constructor(options) {
        super(options);
        this.physicsEngine = new SimplePhysicsEngine({
            gameEngine: this,
            collisions: {
                autoResolve: true,
            }
        });
        
        this.on('preStep', this.moveAll.bind(this));
        this.on('postStep', (e) => {
            // console.log('poststep', e);
        });
        this.on('collisionStart', (e) => this.handleCollision(e));
           
        // game variables
        Object.assign(this, {
            foodRadius: 0.1, 
            headRadius: 0.25, 
            bodyRadius: 0.1,
            eyeDist: 0.08, 
            eyeRadius: 0.03, 
            eyeAngle: 0.5,
            spaceWidth: 16, 
            spaceHeight: 9,
            moveDist: 0.06,
            foodCount: 16, 
            eatDistance: 0.3, 
            startBodyLength: 10, 
            aiCount: 3, 
            directionStop: 100,
            collideDistance: 1
        });
    }

    registerClasses(serializer) {
        serializer.registerClass(Kombat);
        serializer.registerClass(Bullet);
        serializer.registerClass(Wall);
        serializer.registerClass(Blood);
    }

    start() {
        super.start();
    }

    randPos() {
        let x = (Math.random() - 0.5) * this.spaceWidth;
        let y = (Math.random() - 0.5) * this.spaceHeight;
        return new TwoVector(x, y);
    }

    moveAll(stepInfo) {
        return;
    }

    processInput(inputData, playerId) {
        super.processInput(inputData, playerId);
        let player = this.world.queryObject({ playerId });
        let speed = 0.25;
        if (player) {
            if (inputData.input === 'up') {
                player.position.y-=speed;
            }
            else if (inputData.input === 'down') {
                player.position.y+=speed;
            }
            else if (inputData.input === 'right') {
                player.position.x+=speed;
            }
            else if (inputData.input === 'left') {
                player.position.x-=speed;
            }
            else if (inputData.input === 'shoot'){
                let step = inputData.step;
                if(step  >= player.last_shot + 15){
                    player.last_shot = step;
                    this.emit('shoot', player);
                }
                
            }
            else {
                player.direction = inputData.input;
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
        this.timer.add(120, this.destroyObjectById, this, [blood.id]);
        if(kombat.health === 0){
            this.destroyObjectById(kombat.id);
        }
    }

    destroyObjectById(id){
        if (this.world.objects[id]) {
            this.removeObjectFromWorld(id);
        }   
    }
}