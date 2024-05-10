export class TunLobby extends Phaser.Scene {
	constructor() {
		super('lobby')
	}
	preload() {
		var baseDir = '.'
		this.load.image('red_end', baseDir + '/images/maze/red_end.png');

	}
	create() {
		const DEFAULT_STYLE = {font: "48px Arial", fill: "#ff00ff" }

		var style = DEFAULT_STYLE
		var message = "Magic Maze"
		var subtitle = "Tunnel Dash"
		this.add.text(10,10, message, style)

		this.add.text(20,64, subtitle, style)

		var frontImage = this.add.image(0,128, 'red_end').setOrigin(0)

		var startBtn = this.add.text(32,360, "!!! GO !!!", {
			font: "64px Garamond",
			fill: "#ff44dd",
			backgroundColor: "#4444dd",
		}).setOrigin(0)

		this.cameras.main.fadeIn(1000, 0, 0, 0)

		this.input.keyboard.once('keydown-SPACE', () => this.clickedStartBtn() )
		startBtn.setInteractive().on('pointerup', () => this.clickedStartBtn() )
		frontImage.setInteractive().on('pointerup', () => this.clickedStartBtn() )

	}


	clickedStartBtn() {
		this.cameras.main.fadeOut(1000, 0, 0, 0)
		this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
			this.scene.start('tunnel', {level: 1})
		})
	}
}
