
let evtEmitterCurrent = null;

export class Eventually extends Phaser.Events.EventEmitter {
	constructor() {
		super();
	}

	 static getCurrent() {
		if (evtEmitterCurrent == null) {
			evtEmitterCurrent = new Eventually();
		}
		return evtEmitterCurrent;
	}
}
