import { DynamicObject } from 'lance-gg';

export default class Blood extends  DynamicObject {

    static get netScheme() {
        return Object.assign({

            // add serializable properties here
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Blood;
        this.type = "Blood";
        this.width = 0;
        this.height = 0;
        this.splatter = [
            [Math.random(), Math.random(), Math.random()],
            [Math.random(), -Math.random(), Math.random()],
            [-Math.random(), Math.random(), Math.random()],
            [-Math.random(), -Math.random(), Math.random()],
        ]
    };

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        return false;
    }

}