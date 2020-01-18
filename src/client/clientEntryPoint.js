import querystring from 'query-string';
import { Lib } from 'lance-gg';
import KombatClientEngine from '../client/KombatClientEngine';
import KombatGameEngine from '../common/KombatGameEngine';
const qsOptions = querystring.parse(location.search);

// default options, overwritten by query-string options
// is sent to both game engine and client engine
const defaults = {
    traceLevel: Lib.Trace.TRACE_NONE,
    delayInputCount: 10,
    scheduler: 'render-schedule',
    syncOptions: {
        sync: 'extrapolate',
        localObjBending: 0.6,
        remoteObjBending: 0.8,
        bendingIncrements: 6
    }
};
let options = Object.assign(defaults, qsOptions);

let gameEngine = new KombatGameEngine(options);;
let clientEngine = null;

document.addEventListener('DOMContentLoaded', function(e) { 

	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent)) {
    	alert('mobile controllers not available');
	}
    else{
        
        let NI = document.getElementById('kombat-name');
        NI.addEventListener('click', e =>{
            NI.focus()
        });
		let PB = document.getElementById('kombat-play-button');
        PB.addEventListener('click', e => {
            let kc = document.getElementById('kc');
            if(kc){
                kc.remove();
            }
            let canvas = document.createElement('canvas');
            canvas.setAttribute('id', 'kc');
            canvas.width = 800;
            canvas.height = 600;
            document.body.appendChild(canvas);

           
            clientEngine = new KombatClientEngine(gameEngine, options);
            document.querySelector('#kombat-menu').style.display = "none";
            clientEngine.start();
        });
	}
});
