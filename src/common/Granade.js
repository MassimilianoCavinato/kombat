import { BaseTypes, DynamicObject } from 'lance-gg';

export default class Granade extends DynamicObject {

    static get netScheme() {
        return Object.assign({
                direction: { type: BaseTypes.TYPES.FLOAT32 },
                ownerId: {  type: BaseTypes.TYPES.INT8 }
            }, 
            super.netScheme
        );
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Granade;
        this.type = "Granade";
        this.width = 1;
        this.height = 1;
    }

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        if(other.type === "Bullet"){
            return false;
        }
        else if(other.type === "Kombat"){
            if(this.playerId === other.playerId){
                return false;
            }
            else{
                return true;
            }
        }
        else{
            return true;
        }
    }
    
    toString() {
        return `Granade`;
    }
}
