import { BaseTypes, DynamicObject } from 'lance-gg';

export default class Bullet extends DynamicObject {

    static get netScheme() {
        return Object.assign({
                width: { type: BaseTypes.TYPES.FLOAT32 },
                height: { type: BaseTypes.TYPES.FLOAT32 },
                direction: { type: BaseTypes.TYPES.FLOAT32 },
                ownerId: {  type: BaseTypes.TYPES.INT8 }
            }, 
            super.netScheme
        );
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Bullet;
        this.type = "Bullet";
    }

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        if(other.type === "Kombat"){
            if(this.playerId === other.playerId){
                return false;
            }
            else{
                return true;
            }
        }
        // else if(other.type === "Wall"){
        //     return true;
        // }
        // else if(other.type === "Bullet"){
        //     return false;
        // }
        // else if(other.type === "Blood"){
        //     return false;
        // }
        // else if(other.type === "Granade"){
        //     return false;
        // }
        else{
            return false;
        }
    }
    
    toString() {
        return `Bullet`;
    }
}
