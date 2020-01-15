import { Renderer, TwoVector } from 'lance-gg';
import Kombat from '../common/Kombat';
import Bullet from '../common/Bullet';
import Granade from '../common/Granade';
import Wall from '../common/Wall';
import Blood from '../common/Blood';
import Explosion2 from '../common/Explosion2';

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
        canvas.setAttribute('id', 'kc');
        canvas.width = C_WIDTH;
        canvas.height = C_HEIGHT;
        document.body.appendChild(canvas);
        clientEngine.zoom = 10;
        ctx = canvas.getContext('2d');
        ctx.lineWidth = 3 / clientEngine.zoom;
        this.offset = new TwoVector(0, 0);
    }

    setOffset(playerKombat){
        let c = document.getElementById('kc');
        this.offset.x = (C_WIDTH/2)/this.clientEngine.zoom - playerKombat.position.x - (playerKombat.width / 2);
        this.offset.y = (C_HEIGHT/2)/this.clientEngine.zoom - playerKombat.position.y - (playerKombat.height / 2);
    }

    draw(t, dt) {
        super.draw(t, dt);
        this.resetRender();
        let playerKombat = this.gameEngine.world.queryObject({ playerId: this.gameEngine.playerId,  instanceType: Kombat });
        if(playerKombat){
            this.setOffset(playerKombat);
            //draw blood stains first // layer 0
            game.world.queryObjects({instanceType: Blood}).forEach(obj => {
                this.drawBlood(obj);
            });
            game.world.forEachObject((id, obj) => {
                if (obj instanceof Kombat) this.drawKombat(obj);
                else if (obj instanceof Bullet) this.drawBullet(obj);
                else if (obj instanceof Granade) this.drawGranade(obj);
                else if (obj instanceof Wall) this.drawWall(obj);
                else if (obj instanceof Explosion2) this.drawExplosion(obj);
            });
            this.drawHUD(playerKombat);
        }

        ctx.restore();
    }

    resetRender(){
        ctx.clearRect(0, 0, C_WIDTH, C_HEIGHT);
        ctx.save();
        ctx.translate(0, 0);
        ctx.scale(this.clientEngine.zoom, this.clientEngine.zoom);  // Zoom in and flip y axis
    }

    drawHUD(obj){
        //Bullets
        ctx.fillStyle = "orange";
        for(let i=0; i < obj.ammo_loaded; i++){
            ctx.fillRect(
                (125 + i*6)/ this.clientEngine.zoom, 
                543/ this.clientEngine.zoom, 
                2 / this.clientEngine.zoom, 
                2 / this.clientEngine.zoom
            );
            ctx.fillRect(
                (124 + i*6)/ this.clientEngine.zoom, 
                545/ this.clientEngine.zoom, 
                4 / this.clientEngine.zoom, 
                20 / this.clientEngine.zoom
            );
        }
        //Throw Power
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(255, 255, 255, .9)";
        ctx.fillRect(
            20/ this.clientEngine.zoom, 
            544/ this.clientEngine.zoom, 
            obj.throw_power  * 100 / this.clientEngine.zoom, 
            18 / this.clientEngine.zoom
        );
        ctx.beginPath();
        ctx.rect(
            20/ this.clientEngine.zoom, 
            545/ this.clientEngine.zoom, 
            100 / this.clientEngine.zoom, 
            18/ this.clientEngine.zoom
        );
        ctx.closePath();
        ctx.stroke();
        //Life
        ctx.strokeStyle = "white";
        ctx.fillStyle = "rgba(255, 0, 0, .5)";
        ctx.fillRect(20/ this.clientEngine.zoom, 570/ this.clientEngine.zoom, obj.health * ( 760 / obj.max_health)/ this.clientEngine.zoom, 18/ this.clientEngine.zoom);
        ctx.beginPath();
        ctx.rect(20/ this.clientEngine.zoom, 570/ this.clientEngine.zoom, 760 / this.clientEngine.zoom, 16/ this.clientEngine.zoom);
        ctx.closePath();
        ctx.stroke();
    }

    getCenter(obj){

        return new TwoVector(
            obj.position.x + this.offset.x + obj.width/2,
            obj.position.y + this.offset.y + obj.height/2
        )
    }

    getCircumscribedRadiusLength(edge){
        return (edge * Math.SQRT2) / 2;
    }

    drawKombat(obj) {
     
        let center = this.getCenter(obj);
        let radius = this.getCircumscribedRadiusLength(obj.width);
        ctx.fillStyle = "transparent";
        ctx.strokeStyle = obj.playerId === this.gameEngine.playerId ? "dodgerblue" : "crimson";
        //base circle
        this.drawCircle(center.x, center.y, radius);
        //kombat name
        ctx.fillStyle = "white";
        ctx.font = '1px Arial';
        ctx.fillText(obj.name, center.x - (obj.name.length/4), center.y - 2);
        //directional line
        ctx.moveTo(center.x,center.y);
        ctx.lineTo(center.x + radius * Math.cos(obj.direction), center.y + radius * Math.sin(obj.direction));
        ctx.stroke();
        //ammo reloading circle
        if(obj.ammo_loaded === -1){
            this.drawCircle(center.x, center.y, radius+.4);
        }
      
    }

    drawBullet(obj){
        ctx.fillStyle = "orange";
        ctx.strokeStyle = "white";
        let center = this.getCenter(obj);
        let radius = this.getCircumscribedRadiusLength(obj.width);
        ctx.beginPath();
        ctx.arc(center.x, center.y, .5, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    drawGranade(obj){
        ctx.fillStyle = "olive";
        ctx.strokeStyle = "green";
        let center = this.getCenter(obj);
        ctx.beginPath();
        ctx.arc(center.x, center.y, .8, 0, 2*Math.PI);
        ctx.fill();
        ctx.stroke();
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
            ctx.arc(center.x+1+sp[0], center.y+1+sp[1], sp[2], 0, 2*Math.PI);
            ctx.fill();
            ctx.closePath();
        });
    }

    drawExplosion(obj) {
        ctx.fillStyle = "rgba(200,100,0,.4)"
        let center = new TwoVector(
            obj.position.x + this.offset.x,
            obj.position.y + this.offset.y
        );
        ctx.beginPath();
        ctx.arc(center.x, center.y, obj.radius, 0, 2*Math.PI);
        ctx.closePath();
        ctx.fill();
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
