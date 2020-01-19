import { DynamicObject } from 'lance-gg';

export default class Heal2 extends  DynamicObject {

    static get netScheme() {
        return Object.assign({
            // add serializable properties here
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Heal2;
        this.type = "Heal2";
        this.width = 0;
        this.height = 0;
        this.isStatic = 1;
    };

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        return false;
    }

}