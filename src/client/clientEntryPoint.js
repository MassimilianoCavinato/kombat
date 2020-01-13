import querystring from 'query-string';
import { Lib } from 'lance-gg';
import KombatClientEngine from '../client/KombatClientEngine';
import KombatGameEngine from '../common/KombatGameEngine';
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 15,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: 'interpolate',
        localObjBending: .75,
        remoteObjBending: .75,
        bendingIncrements: 2
    }
};
let options = Object.assign(defaults, qsOptions);


// create a client engine and a game engine
const gameEngine = new KombatGameEngine(options);
const clientEngine = new KombatClientEngine(gameEngine, options);

document.addEventListener('DOMContentLoaded', function(e) { clientEngine.start(); });
