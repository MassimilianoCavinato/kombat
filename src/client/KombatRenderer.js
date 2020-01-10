import { Renderer, TwoVector } from 'lance-gg';
import Kombat from '../common/Kombat';
import Bullet from '../common/Bullet';
import Box from '../common/Box';

let ctx = null;
let canvas = null;
let game = null;
let c = 0;
const C_WIDTH = 800;
const C_HEIGHT = 600;

export default class KombatRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;
        canvas = document.createElement('canvas');
        
        canvas.width = C_WIDTH;
        canvas.height = C_HEIGHT;
        document.body.insertBefore(canvas, document.getElementById('logo'));
        game.w = canvas.width;
        game.h = canvas.height;
        clientEngine.zoom = 15;
        
        // if (game.w / game.spaceWidth < clientEngine.zoom) clientEngine.zoom = game.w / game.spaceWidth;
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 2 / clientEngine.zoom;
        ctx.strokeStyle = 'white';
        ctx.fildlStyle= "red";
        this.viewPort = new TwoVector(0, 0);
    }

    draw(t, dt) {
        super.draw(t, dt);
        ctx.clearRect(0, 0, game.w, game.h);
        ctx.save();
        ctx.fillRect(0, 0, 800, 600 );
        ctx.translate(0, 0);
        ctx.scale(this.clientEngine.zoom, this.clientEngine.zoom);  // Zoom in and flip y axis
        this.drawBounds();
        let playerKombat = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId,  instanceType: Kombat });
        if(playerKombat){
            this.offsetX = (C_WIDTH/2)/this.clientEngine.zoom - playerKombat.position.x - (playerKombat.width / 2);
            this.offsetY = (C_HEIGHT/2)/this.clientEngine.zoom - playerKombat.position.y - (playerKombat.height / 2);
        }
        game.world.forEachObject((id, obj) => {
            if (obj instanceof Kombat) this.drawKombat(obj);
            else if (obj instanceof Bullet) this.drawBullet(obj);
            else if (obj instanceof Box) this.drawBox(obj.position.x, obj.position.y, obj.width, obj.height);
        });
        // ctx.translate(game.w/2 - 2, game.h/2 - 2);
        
        ctx.restore();
    }

    drawKombat(obj) {
        this.drawCircumscribedCircle(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width);
        this.drawBox(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width, obj.height);
    }
    drawBullet(obj){
        this.drawCircumscribedCircle(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width);
        this.drawBox(obj.position.x + this.offsetX, obj.position.y + this.offsetY, obj.width, obj.height);
    }
    drawCircle(x, y, r) {
        ctx.beginPath();
        ctx.arc(x+r, y+r, r, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    drawCircumscribedCircle(x, y, l){
        ctx.beginPath();
        ctx.arc(x+(l/2), y+(l/2), (l * Math.SQRT2) /2, 0, 2*Math.PI);
        ctx.stroke();
        ctx.closePath();
    }
    drawBox(x, y, w, h){
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.stroke();
        ctx.closePath();
    }
    drawBounds() {
        ctx.strokeRect(0 + this.offsetX, 0 + this.offsetY,30,12);
    }
}
