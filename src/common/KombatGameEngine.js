import { GameEngine, SimplePhysicsEngine, TwoVector } from 'lance-gg';
import Wiggle from './Wiggle';
import Kombat from './Kombat';
import Food from './Food';
import Box from './Box';
import Bullet from './Bullet';

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
        serializer.registerClass(Food);
        serializer.registerClass(Wiggle);
        serializer.registerClass(Box);
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
                this.emit('shoot', player);
            }
            else {
                player.direction = inputData.input;
            }
        }
    }

    handleCollision(e){
        if(e.o1 instanceof Kombat){
            if(e.o2 instanceof Bullet){
                this.destroyBullet(e.o2.id);
            }
        }
        else if(e.o1 instanceof Bullet){
            if(e.o2 instanceof Kombat){
                this.destroyBullet(e.o1.id);
            }
        }
    }

    destroyBullet(bulletId) {
        if (this.world.objects[bulletId]) {
            this.removeObjectFromWorld(bulletId);
        }
    }
}