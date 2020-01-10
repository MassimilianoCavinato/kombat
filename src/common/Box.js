import { DynamicObject } from 'lance-gg';

export default class Box extends  DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Box;
        this.type = "Box";
        this.width = 3;
        this.height = 3;
        this.isStatic = 1;
    };

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        return true;
    }

}
