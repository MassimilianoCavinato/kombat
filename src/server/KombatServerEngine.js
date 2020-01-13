import { ServerEngine, TwoVector } from 'lance-gg';
import Kombat from '../common/Kombat';
import Bullet from '../common/Bullet';
import Wall from '../common/Wall';

export default class KombatServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.gameEngine.on('shoot', this.shoot.bind(this));
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
        kombat.max_health = 10;
        kombat.health = 10;
        kombat.last_shot = 0;
        this.gameEngine.addObjectToWorld(kombat);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        let kombat = this.gameEngine.world.queryObject({ playerId: playerId,  instanceType: Kombat });
        if (kombat) this.gameEngine.removeObjectFromWorld(kombat.id);
    }

    shoot(kombat) {
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

    destroyObjectById(id) {
        if (this.gameEngine.world.objects[id]) {
            this.gameEngine.removeObjectFromWorld(id);
        }
    }

}
