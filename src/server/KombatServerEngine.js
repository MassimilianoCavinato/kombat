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
        let walls = [
            [0,0],
            [2, 19],
            [12,4],
            [3,9],
            [16, 16],
            [22, 13],
            [8,26],
        ];

        walls.forEach(w => {
            let wall = new Wall(this.gameEngine, null, { position: new TwoVector(w[0], w[1]) });
            this.gameEngine.addObjectToWorld(wall);
        });
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let kombat = new Kombat(this.gameEngine, null, { position: new TwoVector(10, 10) });
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
        let speed = 0.7;
        let liveTimer = 70; //gameloops
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
