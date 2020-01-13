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
        let playerKombat = new Kombat(this.gameEngine, null, { position: new TwoVector(10, 10) });
        playerKombat.playerId = socket.playerId;
        playerKombat.max_health = 10;
        playerKombat.health = 10;
        this.gameEngine.addObjectToWorld(playerKombat);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        let playerKombat = this.gameEngine.world.queryObject({ playerId: playerId,  instanceType: Kombat });
        if (playerKombat) this.gameEngine.removeObjectFromWorld(playerKombat.id);
    }

    shoot(player) {
        
        let speed = 0.7;
        let liveTimer = 70; //gameloops
        let bullet = new Bullet(this.gameEngine, null, { 
            direction: player.direction,
            playerId: player.playerId,
            ownerId: player.id,
           
            position: new TwoVector(
                player.position.x + (player.width / 4),
                player.position.y + (player.height / 4)
            ),
            velocity: new TwoVector(
                Math.cos(player.direction) * speed ,
                Math.sin(player.direction) * speed
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
