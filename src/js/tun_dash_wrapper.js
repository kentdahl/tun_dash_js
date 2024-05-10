import {TunDashGame} from "./tun_dash_game"

class TunDashWrapper {
	constructor(elem, config = {}) {
		this.tunDashElem = elem
		this.level = elem.dataset.level
	}
	startGame() {
		this.tunDashGame = new TunDashGame(this.level)
	}
}

var tunDashElem = document.querySelector('#tun-dash-game');
if (tunDashElem) {
	var wrapper = new TunDashWrapper(tunDashElem)
	wrapper.startGame()
}
