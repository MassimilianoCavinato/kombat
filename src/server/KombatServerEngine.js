import { ServerEngine, TwoVector } from 'lance-gg';
import Kombat from '../common/Kombat';
import Bullet from '../common/Bullet';
import Box from '../common/Box';

export default class KombatServerEngine extends ServerEngine {

    constructor(io, gameEngine, inputOptions) {
        super(io, gameEngine, inputOptions);
        this.gameEngine.on('shoot', this.shoot.bind(this));
    }

    start() {
        super.start();
        // let testBox = new Box(this.gameEngine, null, { position: new TwoVector(0, 0) });
        // this.gameEngine.addObjectToWorld(testBox);
    }

    onPlayerConnected(socket) {
        super.onPlayerConnected(socket);
        let playerKombat = new Kombat(this.gameEngine, null, { position: new TwoVector(10, 10) });
        playerKombat.direction = 0;
        playerKombat.playerId = socket.playerId;
        this.gameEngine.addObjectToWorld(playerKombat);
    }

    onPlayerDisconnected(socketId, playerId) {
        super.onPlayerDisconnected(socketId, playerId);
        let playerKombat = this.gameEngine.world.queryObject({ playerId: playerId,  instanceType: Kombat });
        if (playerKombat) this.gameEngine.removeObjectFromWorld(playerKombat.id);
    }

    shoot(player) {
        
        let speed = 0.01;
  
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
        this.gameEngine.timer.add(60, this.destroyBullet, this, [bullet.id]);
    }

    destroyBullet(bulletId) {
        if (this.gameEngine.world.objects[bulletId]) {
            this.gameEngine.removeObjectFromWorld(bulletId);
        }
    }

}
