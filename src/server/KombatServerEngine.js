import { ServerEngine, TwoVector } from 'lance-gg';
import Kombat from '../common/Kombat';
import Bullet from '../common/Bullet';
import Granade from '../common/Granade';
import Wall from '../common/Wall';
import Explosion2 from '../common/Explosion2';
import Blood from '../common/Blood';
import DeadZone from '../common/DeadZone';
import { map } from './map1';

const RANDOM_SPAWNS = [
    new TwoVector(10, 10),
    new TwoVector(40, 10),
    new TwoVector(10, 40),
    new TwoVector(40, 40)
];

export default class KombatServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.gameEngine.on('shoot', this.shoot.bind(this));
        this.gameEngine.on('granade', this.granade.bind(this));
        this.gameEngine.on('postStep', (stepInfo) => this.postStep(stepInfo));
        this.deadzoneTimer = 0;
    }

    start() {
        super.start();
        this.add_Map(map);
        this.add_DeadZone();
        
    }

    add_Map(map){
        map.forEach(w => {
            console.log(w.x, w.y, w.width, w.height);
            let wall = new Wall(this.gameEngine, null, { 
                position: new TwoVector(w.x, w.y), 
                width: w.width,
                height: w.height,
            });

            this.gameEngine.addObjectToWorld(wall);
        });
    }

    add_DeadZone(){
        let deadZone = new DeadZone(this.gameEngine, null, { 
            position: new TwoVector(30, 30)
        });
        deadZone.radius = 100;
        this.gameEngine.addObjectToWorld(deadZone);
    }
    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let position = RANDOM_SPAWNS[Math.floor(Math.random()*RANDOM_SPAWNS.length)].clone();
        let kombat = new Kombat(this.gameEngine, null, { 
            position: position,
        });


        kombat.playerId = socket.playerId;
        kombat.name = 'Kombat '+socket.playerId;
        kombat.max_health = 100;
        kombat.health = 100;
        kombat.ammo_capacity = 21;
        kombat.ammo_loaded =  21;
        kombat.granade_capacity = 6;
        kombat.granade_loaded =  50;
        kombat.throw_power = 0;
        kombat.throwing_granade = false;
        kombat.timer_shot = 0;
        kombat.timer_deadzone = 0;
        this.gameEngine.addObjectToWorld(kombat);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        let kombat = this.gameEngine.world.queryObject({ playerId: playerId,  instanceType: Kombat });
        if (kombat) this.gameEngine.removeObjectFromWorld(kombat.id);
    }

    shoot(kombat) {
        if(kombat.ammo_loaded > 0){
            kombat.ammo_loaded--;
            let speed = 0.4;
            let liveTimer = 100; //gameloops
            let bullet = new Bullet(this.gameEngine, null, { 
                direction: kombat.direction,
                playerId: kombat.playerId,
                ownerId: kombat.id,
                position: new TwoVector(
                    kombat.position.x + (kombat.width / 4),
                    kombat.position.y + (kombat.height / 4)
                ),
                velocity: new TwoVector(
                    Math.cos(kombat.direction) * speed ,
                    Math.sin(kombat.direction) * speed
                )
            });
            this.gameEngine.addObjectToWorld(bullet);
            this.gameEngine.timer.add(liveTimer, this.destroyObjectById, this, [bullet.id]);
        }
        else if(kombat.ammo_loaded === 0 ){
            kombat.ammo_loaded--;
            this.gameEngine.timer.add(240, this.reloadAmmo, this, [kombat.id]);
        }
    }

    granade(kombat) {
        if(kombat.granade_loaded > 0){
            kombat.granade_loaded--;
            let speed = .4 * kombat.throw_power;
            let granade = new Granade(this.gameEngine, null, { 
                direction: kombat.direction,
                position: new TwoVector(
                    kombat.position.x + (kombat.width / 4),
                    kombat.position.y + (kombat.height / 4)
                ),
                velocity: new TwoVector(
                    Math.cos(kombat.direction) * speed ,
                    Math.sin(kombat.direction) * speed
                )
            });
            kombat.throw_power = 0;
        
            granade.playerId = kombat.playerId;
            this.gameEngine.addObjectToWorld(granade);
            this.gameEngine.timer.add(100, this.explode, this, [granade.id]);
        }
    }

    destroyObjectById(id) {
        if (this.gameEngine.world.objects[id]) {
            this.gameEngine.removeObjectFromWorld(id);
        }
    }

    reloadAmmo(kombatId){
        let kombat = this.gameEngine.world.queryObject({ id: kombatId, instanceType: Kombat });
        if(kombat){
            kombat.ammo_loaded = kombat.ammo_capacity;
        }
    }

    explode(granadeId) {
        let granade = this.gameEngine.world.queryObject({ id: granadeId, instanceType: Granade });
        if(granade){
            let position = granade.position.clone();
            let explosion = new Explosion2(this.gameEngine, null, { 
                position: position
            });
            this.destroyObjectById(granadeId);
            explosion.radius = 10;
            this.gameEngine.addObjectToWorld(explosion);
            this.gameEngine.timer.add(150, this.destroyObjectById, this, [explosion.id]);
            
            let kombats = this.gameEngine.world.queryObjects({ instanceType: Kombat });
            kombats.forEach(k=> {
                let d = Math.sqrt(
                    Math.pow( k.position.x+k.width/2 - position.x , 2) +  Math.pow( k.position.y+k.height/2 - position.y,2)
                );
                if(d <= explosion.radius){
                    k.health -= 3;
                    if(d <= explosion.radius/2){
                       k.health -= 3; 
                    }
                    if(d <= explosion.radius/4){
                        k.health -= 3; 
                    }
                    let blood = new Blood(this.gameEngine, null, { position: k.position.clone() });
                    if(k.health <= 0){
                        this.destroyObjectById(k.id);
                    }
                    this.gameEngine.addObjectToWorld(blood);
                    this.gameEngine.timer.add(600, this.destroyObjectById, this, [blood.id]);
                }
            });
        }
    }

    postStep(stepInfo){

        let deadZone = this.gameEngine.world.queryObject({ instanceType : DeadZone });
        if(deadZone){
            if(deadZone.radius <= 0){
                deadZone.radius = 100;
            }
            else{
                if(stepInfo.step - this.deadzoneTimer > 60 ){
                    this.deadzoneTimer = stepInfo.step;
                    let kombats = this.gameEngine.world.queryObjects({ instanceType : Kombat });
                    kombats.forEach(k => {
                        let distance = Math.sqrt(
                            Math.pow( k.position.x + k.width/2 - deadZone.x , 2) +  Math.pow( k.position.y + k.height/2 - deadZone.position.y,2)
                        );
                        if(distance >= deadZone.radius){
                            k.health--;
                            let blood = new Blood(this.gameEngine, null, { position: k.position.clone() });
                            if(k.health <= 0){
                                this.destroyObjectById(k.id);
                            }
                            this.gameEngine.addObjectToWorld(blood);
                            this.gameEngine.timer.add(600, this.destroyObjectById, this, [blood.id]);
                        }
                    })
                }
                deadZone.radius -= .02;
            }
        }
    }
}
