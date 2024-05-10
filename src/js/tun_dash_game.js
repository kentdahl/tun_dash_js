import {TunLobby} from "./tun/scenes/lobby"
import {TunnelScene} from "./tun/scenes/tunnel"
import {HudScene} from "./tun/scenes/hud"

export class TunDashGame extends Phaser.Game {
	// Initialize Phaser
	constructor(level = null, config = {}) {
		var scenes = null
		if (level) {
			var tunnel = new TunnelScene(level)
			scenes = [tunnel, new HudScene()]
		} else {
			scenes = [	new TunLobby(),
						new TunnelScene(),
						new HudScene()
				]
		}

		var config = {
			type: Phaser.AUTO,
			width:  320,
			height: 480,
			scene: scenes,
		    physics: {
			    default: 'arcade',
			    arcade: {
			        debug: false,
			        gravity: { y: 0 }
			    }
			},
		};
		super(config);
	}
}
