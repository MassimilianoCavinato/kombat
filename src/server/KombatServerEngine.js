import { ServerEngine, TwoVector } from 'lance-gg';
import Kombat from '../common/Kombat';
import Bullet from '../common/Bullet';
import Granade from '../common/Granade';
import Wall from '../common/Wall';
import Explosion2 from '../common/Explosion2';
import Blood from '../common/Blood';

export default class KombatServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.gameEngine.on('shoot', this.shoot.bind(this));
        this.gameEngine.on('granade', this.granade.bind(this));
    }

    start() {
        super.start();

        let sideA = 50;
        let sideB = 3;

        let wallNorth = new Wall(this.gameEngine, null, { 
            position: new TwoVector(0,0), 
            width: sideA,
            height: sideB,
        });
        this.gameEngine.addObjectToWorld(wallNorth);

        let wallEast = new Wall(this.gameEngine, null, { 
            position: new TwoVector(sideA,0), 
            width: sideB,
            height: sideA,
        });
        this.gameEngine.addObjectToWorld(wallEast);

        let wallSouth = new Wall(this.gameEngine, null, { 
            position: new TwoVector(sideB,sideA), 
            width: sideA,
            height: sideB,
        });
        this.gameEngine.addObjectToWorld(wallSouth);


        let wallWest = new Wall(this.gameEngine, null, { 
            position: new TwoVector(0,sideB), 
            width: sideB,
            height: sideA,
        });
        this.gameEngine.addObjectToWorld(wallWest);


        let walls = [
            [8,8,3,9],
            [32,18,8,3],
            [25,25,2,2],
            [42,36,3,9],
            [12,32,8,3],
        ];


        walls.forEach(w => {
            let wall = new Wall(this.gameEngine, null, { 
                position: new TwoVector(w[0], w[1]), 
                width: w[2],
                height: w[3],
            });
            this.gameEngine.addObjectToWorld(wall);
        });
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let kombat = new Kombat(this.gameEngine, null, { 
            position: new TwoVector(10, 10),
        });
        kombat.playerId = socket.playerId;
        kombat.name = 'Kombat '+socket.playerId;
        kombat.max_health = 10;
        kombat.health = 10;
        kombat.ammo_capacity = 21;
        kombat.ammo_loaded =  21;
        kombat.last_shot = 0;
        kombat.throw_power = 0;
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
}
