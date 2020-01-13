import { Renderer, TwoVector } from 'lance-gg';
import Kombat from '../common/Kombat';
import Bullet from '../common/Bullet';
import Wall from '../common/Wall';
import Blood from '../common/Blood';

let ctx = null;
let canvas = null;
let game = null;
const C_WIDTH = 800;
const C_HEIGHT = 600;

export default class KombatRenderer extends Renderer {

    constructor(gameEngine, clientEngine) {
        super(gameEngine, clientEngine);
        game = gameEngine;
        canvas = document.createElement('canvas');
        canvas.width = C_WIDTH;
        canvas.height = C_HEIGHT;
        document.body.appendChild(canvas);
        game.w = canvas.width;
        game.h = canvas.height;
        clientEngine.zoom = 10;
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 2 / clientEngine.zoom;
        this.offsetX = 0;
        this.offsetY = 0;
    }

    draw(t, dt) {
        super.draw(t, dt);
        this.resetRender();
        let playerKombat = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId,  instanceType: Kombat });
        if(playerKombat){
            this.offsetX = (C_WIDTH/2)/this.clientEngine.zoom - playerKombat.position.x - (playerKombat.width / 2);
            this.offsetY = (C_HEIGHT/2)/this.clientEngine.zoom - playerKombat.position.y - (playerKombat.height / 2);
            //draw blood stains first // layer 0
            game.world.queryObjects({instanceType: Blood}).forEach(obj => {
                this.drawBlood(obj);
            });
            game.world.forEachObject((id, obj) => {
                if (obj instanceof Kombat) this.drawKombat(obj);
                else if (obj instanceof Bullet) this.drawBullet(obj);
                else if (obj instanceof Wall) this.drawWall(obj);
            });
            this.drawUI(playerKombat);
        }
        ctx.restore();
    }

    resetRender(){
        ctx.clearRect(0, 0, game.w, game.h);
        ctx.save();
        ctx.translate(0, 0);
        ctx.scale(this.clientEngine.zoom, this.clientEngine.zoom);  // Zoom in and flip y axis
    }

    drawUI(obj){
        //Health Bar
        ctx.fillStyle = "red";
        ctx.fillRect(10/ this.clientEngine.zoom, 570/ this.clientEngine.zoom, obj.health * ( 780 / obj.max_health)/ this.clientEngine.zoom, 10/ this.clientEngine.zoom);
        ctx.beginPath();
        ctx.strokeStyle = "white";
        ctx.rect(10/ this.clientEngine.zoom, 570/ this.clientEngine.zoom, 780 / this.clientEngine.zoom, 10/ this.clientEngine.zoom);
        ctx.stroke();
        ctx.closePath();
    }

    getCenter(obj){
        return new TwoVector(
            obj.position.x + this.offsetX + obj.width/2,
            obj.position.y + this.offsetY + obj.height/2
        )
    }

    getCircumscribedRadiusLength(edge){
        return (edge * Math.SQRT2) / 2;
    }

    drawKombat(obj) {
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = obj.playerId === this.gameEngine.playerId ? "dodgerblue" : "crimson";
        let center = this.getCenter(obj);
        let radius = this.getCircumscribedRadiusLength(obj.width);
        this.drawCircle(center.x, center.y, radius);
        ctx.moveTo(center.x,center.y);
        ctx.lineTo(center.x + radius * Math.cos(obj.direction), center.y + radius * Math.sin(obj.direction));
        ctx.stroke();
    }

    drawBullet(obj){
        ctx.fillStyle = "yellow";
        let center = this.getCenter(obj);
        let radius = this.getCircumscribedRadiusLength(obj.width);
        ctx.beginPath();
        ctx.arc(center.x, center.y, radius, 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    drawWall(obj){
        ctx.strokeStyle =  "white";
        let center = this.getCenter(obj);
        this.drawBox(center.x, center.y, obj.width, obj.height);
    }

    drawBlood(obj){
        ctx.fillStyle = 'rgba(255,0,0,.5)';
        let center = this.getCenter(obj);
        obj.splatter.forEach(sp => {
            ctx.beginPath();
            ctx.arc(center.x+sp[0], center.y+sp[1], sp[2], 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        });
    }

    drawCircle(x, y, r, ) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, 2*Math.PI);
        ctx.closePath();
        ctx.stroke();
    }

    drawBox(x, y, w, h){
        ctx.beginPath();
        ctx.rect(x - (w/2), y - (h/2), w, h);
        ctx.closePath();
        ctx.stroke();
    }
}
