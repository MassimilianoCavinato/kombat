import { BaseTypes,  DynamicObject } from 'lance-gg';

export default class Kombat extends  DynamicObject {

    static get netScheme() {
        return Object.assign({
            direction: { type: BaseTypes.TYPES.FLOAT32 },
            max_health: { type: BaseTypes.TYPES.UINT8 }, 
            health: { type: BaseTypes.TYPES.UINT8 },
            ammo_capacity: { type: BaseTypes.TYPES.UINT8 },
            ammo_loaded: { type: BaseTypes.TYPES.INT8 },
            last_shot: { type: BaseTypes.TYPES.UINT8 }, 
            throw_power: { type: BaseTypes.TYPES.FLOAT32 },
        }, 
        super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Kombat;
        this.type = "Kombat";
        this.width = 2;
        this.height = 2;
   }

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        if(other.type === "Kombat"){
            return true;
        }
        else if(other.type === "Bullet"){
            if(this.playerId === other.playerId ){
                return false;
            }
            else{
                return true;
            }
        }
        else if(other.type === "Granade"){
            if(this.playerId === other.playerId){
                return false;
            }
            else{
                return true;
            }
        }
        else if(other.type === "Blood"){
            return false;
        }
        else{
            return true;
        }
    }

    toString() {
        return `Kombat`;
    }
}
