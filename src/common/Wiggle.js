import { BaseTypes, DynamicObject } from 'lance-gg';

export default class Wiggle extends DynamicObject {

    static get netScheme() {
        return Object.assign({
            direction: { type: BaseTypes.TYPES.FLOAT32 },
        }, super.netScheme);
    }

    constructor(gameEngine, options, props) {
        super(gameEngine, options, props);
        this.class = Wiggle;
    }

    syncTo(other) {
        super.syncTo(other);
        this.direction = other.direction;
    }

    toString() {
        return `Wiggle::${super.toString()} direction=${this.direction} length=${this.bodyLength}`;
    }
}
