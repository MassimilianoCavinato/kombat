import { BaseTypes, DynamicObject } from 'lance-gg';

export default class DeadZone extends  DynamicObject {

    static get netScheme() {
        return Object.assign({
            radius: { type: BaseTypes.TYPES.FLOAT32 },
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = DeadZone;
        this.type = "DeadZone";
        this.isStatic = true;
        this.width = 0;
        this.height = 0;
    };

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        return false;
    }

}