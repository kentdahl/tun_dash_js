import {Eventually} from "../chaos/eventually"


export class HudScene extends Phaser.Scene {

	constructor() {
		super('hud')
	}


	create () {
		const DEFAULT_STYLE = {font: "32px Arial", fill: "#ff00ff" }

		var style = DEFAULT_STYLE
		var title = "Tunnel Dash"
		var titleText = this.add.text(64,8, title, style)
		titleText.setAlpha(0.3)


		// Motion buttons
		var debugRectAlpha = 0.3

		var leftRect = this.add.rectangle(0, 400, 120, 80).setOrigin(0);
		leftRect.setStrokeStyle(2, 0x1a65ac);
		leftRect.setAlpha(debugRectAlpha)
		leftRect.setInteractive().on('pointerdown', () => this.handleLeftButton())
		this.leftBtn = leftRect

		var rightRect = this.add.rectangle(200, 400, 120, 80).setOrigin(0);
		rightRect.setStrokeStyle(2, 0x1a65ac);
		rightRect.setAlpha(debugRectAlpha)
		rightRect.setInteractive().on('pointerdown', () => this.handleRightButton())
		this.rightBtn = rightRect

		var upRect = this.add.rectangle(100, 360, 120, 80).setOrigin(0) // Invisible. WAS: 0xFF00FF);
		upRect.setStrokeStyle(2, 0x1a65ac);
		upRect.setAlpha(debugRectAlpha)
		upRect.setInteractive().on('pointerdown', () => this.handleUpButton())
		this.upBtn = upRect

		var downRect = this.add.rectangle(120, 440, 80, 64).setOrigin(0)
		downRect.setStrokeStyle(2, 0x1a65ac);
		downRect.setAlpha(debugRectAlpha)
		downRect.setInteractive().on('pointerdown', () => this.handleDownButton())
		this.downBtn = downRect


		var mainArea = this.add.rectangle(40, 48, 240, 320).setOrigin(0)
		mainArea.setStrokeStyle(2, 0x1a65ac);
		mainArea.setAlpha(debugRectAlpha)
		mainArea.setInteractive().on('pointerdown', () => this.handleMainTapButton())
		this.mainAreaBtn = mainArea


		var manaBarBG = this.add.rectangle(8,16,12,200, 0x000000).setOrigin(0).setAlpha(0.2).setStrokeStyle(3, 0x0000FF)
		var manaBar = this.add.rectangle(8,16,12,200, 0x4422FF).setOrigin(0).setAlpha(0.8)
		this.manaBar = manaBar


		var healthBarBG = this.add.rectangle(300,16,12,200, 0x0).setOrigin(0).setAlpha(0.2).setStrokeStyle(3, 0xFF0000)
		var healthBar = this.add.rectangle(300,16,12,200, 0xFF2244).setOrigin(0).setAlpha(0.8)
		this.healthBar = healthBar



		var topLeftEscBtn = this.add.rectangle(8,8,32,32).setOrigin(0).setAlpha(0.8).setStrokeStyle(5, 0xFA44BE)
		topLeftEscBtn.setInteractive().on('pointerdown', () => this.handleTopLeftEscButton())
		this.topLeftEscBtn = topLeftEscBtn


		this.eventually = Eventually.getCurrent()
		this.eventually.on('TUN_PLAYER_STATUS_UPDATE', (player) => this.eventHandlePlayerStatUpdate(player) )

	}


	handleLeftButton () {
		this.eventually.emit('TUN_HUD_LEFT')
		this.leftBtn.setStrokeStyle(5, 0x1166aa)
		this.rightBtn.setStrokeStyle(1, 0xaa6611)
	}

	handleRightButton () {
		this.eventually.emit('TUN_HUD_RIGHT')
		this.rightBtn.setStrokeStyle(5, 0x1166aa)
		this.leftBtn.setStrokeStyle(1, 0xaa6611)
	}

	handleUpButton () {
		this.eventually.emit('TUN_HUD_FORWARD')
	}

	handleDownButton () {
		this.eventually.emit('TUN_HUD_BACKWARD')
	}

	handleMainTapButton () {
		this.eventually.emit('TUN_HUD_MAIN_TAP')
	}


	handleTopLeftEscButton () {
		// this.topLeftEscBtn.height *= 1.2
		this.scale.toggleFullscreen()
	}

	eventHandlePlayerStatUpdate(player) {
		let manaRat = player.mana_pool.getRatio()
		this.manaBar.height = manaRat * 200

		let healthRat = player.health_pool.getRatio()
		this.healthBar.height = healthRat * 200

	}

}
