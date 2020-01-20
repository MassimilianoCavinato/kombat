import querystring from 'query-string';
import { Lib } from 'lance-gg';
import KombatClientEngine from '../client/KombatClientEngine';
import KombatGameEngine from '../common/KombatGameEngine';
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 3,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: 'extrapolate',
        localObjBending: 0.8,
        remoteObjBending: 0.6,
        bendingIncrements: 5
    }
};
let options = Object.assign(defaults, qsOptions);

document.addEventListener('DOMContentLoaded', function(e) { 

    let gameEngine = new KombatGameEngine(options);
    let clientEngine = new KombatClientEngine(gameEngine, options);
	
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    	alert('mobile controllers not available');
	}
    else{
        clientEngine.start();
	}
});
