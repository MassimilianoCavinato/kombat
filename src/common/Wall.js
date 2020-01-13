import { DynamicObject } from 'lance-gg';

export default class Wall extends  DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Wall;
        this.type = "Wall";
        this.isStatic = 1;
    };

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        return true;
    }

}