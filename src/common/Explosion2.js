import { BaseTypes, DynamicObject } from 'lance-gg';

export default class Explosion2 extends  DynamicObject {

    static get netScheme() {
        return Object.assign({
            radius: { type: BaseTypes.TYPES.FLOAT32 },
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Explosion2;
        this.type = "Explosion2";
        this.isStatic = true;
        this.width = 0;
        this.height = 0;
        // this.splatter = [
        //     [Math.random()*5, Math.random()*5, 3+Math.random()*3],
        //     [Math.random()*5, -Math.random()*5, 3+Math.random()*3],
        //     [-Math.random()*5, Math.random()*5, 3+Math.random()*3],
        //     [-Math.random()*5, -Math.random()*5, 3+Math.random()*3],

        //     [Math.random()*5+2, Math.random()*5+2,, 3+Math.random()*3],
        //     [Math.random()*5+2,, -Math.random()*5-2, 3+Math.random()*3],
        //     [-Math.random()*5-2, Math.random()*5+2,, 3+Math.random()*3],
        //     [-Math.random()*5-2, -Math.random()*5-2, 3+Math.random()*3],

        //     [Math.random()*5+4, Math.random()*5+4, 3+Math.random()*3],
        //     [Math.random()*5+4, -Math.random()*5-4, 3+Math.random()*3],
        //     [-Math.random()*5-4, Math.random()*5+4, 3+Math.random()*3],
        //     [-Math.random()*5-4, -Math.random()*5+4, 3+Math.random()*3],
        // ]
    };

    syncTo(other) {
        super.syncTo(other);
    }

    collidesWith(other){
        return false;
    }

}