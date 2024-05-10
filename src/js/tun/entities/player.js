import {Eventually} from "../chaos/eventually"
import {MagicMissiles} from "../spells/missiles"
import {ManaPool} from "./tools/mana_pool"
import {HealthPool} from "./tools/health_pool"


export class Player extends Phaser.Physics.Arcade.Sprite {
	constructor(config) {
		super(config.scene, config.x, config.y, "player-forward", 0);
		config.scene.add.existing(this);
		config.scene.physics.add.existing(this);
		this.currentScene = config.scene

		this.player_initialize()

		config.scene.anims.create({
			key: 'player-left',
			frames: config.scene.anims.generateFrameNumbers('spritesheet', { start: 3, end: 3 }),
			frameRate: 10,
			repeat: -1
		});

		config.scene.anims.create({
			key: 'player-forward',
			frames: [ { key: 'spritesheet', frame: 0 } ],
			// frames: config.scene.anims.generateFrameNumbers('spritesheet', { start: 0, end: 3 }),
			frameRate: 4,
			repeat: -1
		});

		config.scene.anims.create({
			key: 'player-forward-dashing',
			// frames: [ { key: 'spritesheet', frame: 0 } ],
			frames: config.scene.anims.generateFrameNumbers('spritesheet', { start: 0, end: 3 }),
			frameRate: 4,
			repeat: -1
		});

		config.scene.anims.create({
			key: 'player-right',
			frames: config.scene.anims.generateFrameNumbers('spritesheet', { start: 1, end: 1 }),
			frameRate: 10,
			repeat: -1
		});

		config.scene.anims.create({
			key: 'player-downward',
			frames: config.scene.anims.generateFrameNumbers('spritesheet', { start: 2, end: 2 }),
			frameRate: 10,
			repeat: -1
		});

		this.anims.play('player-forward-dashing', true)

		this.eventually = Eventually.getCurrent()
		this.eventually.on('TUN_HUD_LEFT',  () => this.handleLeftButton() )
		this.eventually.on('TUN_HUD_RIGHT', () => this.handleRightButton() )
		this.eventually.on('TUN_HUD_FORWARD',  () => this.handleForwardButton() )
		this.eventually.on('TUN_HUD_BACKWARD', () => this.handleBackwardButton() )
		this.eventually.on('TUN_HUD_MAIN_TAP', () => this.handleFireButton() )

		// # WASD
		let keys = config.scene.input.keyboard
		keys.on('keydown-A', () => this.handleLeftButton() )
		keys.on('keydown-D', () => this.handleRightButton() )
		keys.on('keydown-W', () => this.handleForwardButton() )
		keys.on('keydown-S', () => this.handleBackwardButton() )
		keys.on('keydown-SPACE', () => this.handleFireButton() )
		keys.on('keydown-RETURN', () => this.handleSpellButton() )

		this.body.onCollide = true
		this.currentScene.physics.world.on('collide', (event, objA, objB) => this.handleCollideEvent(event, objA, objB))
		//this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {

		//this.on('collide', () => this.handleCollideEvent(), this)


	}

	player_initialize () {
		this.health_pool = new HealthPool(200)
		this.mana_pool   = new ManaPool(350)

		//this.setScale(2);
		this.setBounce(0, 0.3)
		this.body.worldBounce = new Phaser.Math.Vector2(0.9, 0.9)

		this.body.onWorldBounds = true;		
		// this.body.setVelocity(0, -0.1)
		this.body.setDrag(25, 5)
		this.body.setFriction(25, 5)
		this.body.setMaxVelocity(500, 500)
		// this.body.setCircle(28) // BAD?
		//this.body.setAcceleration(0, -100)
		//console.log("Player bounds: ")
		//console.log(this.body.customBoundsRectangle)

		this.startingPos = this.body.position.clone()
		this.lastPortalPos = this.startingPos.clone()

		this.magic_missiles = new MagicMissiles(this.currentScene)
	}

	player_uninitialize () {
		var eventList = [
			'TUN_HUD_LEFT',
			'TUN_HUD_RIGHT',
			'TUN_HUD_FORWARD',
			'TUN_HUD_BACKWARD',
			'TUN_HUD_MAIN_TAP',
		];
		Phaser.Utils.Array.Each(eventList, (evt) => this.eventually.removeListener(evt, null, this))
	}

	player_get_ready() {
		// this.physics.add.sprite(50, 300, 'sprites');
		//this.player.setBounce(0.8);
		//this.player.setCollideWorldBounds(true);
		//this.physics.add.collider(this.player, this.floor);
	}

	handle_movement () {
		let cursors = this.scene.cursors
		if (cursors.left.isDown) {
			this.handleLeftButton()
		}
		else if (cursors.right.isDown) {
			this.handleRightButton()
		}
		if (cursors.up.isDown) {
			this.handleForwardButton()
		}
		if (cursors.down.isDown) {
			this.handleBackwardButton()
		}
	}

	handle_floor () {
		var firstgid = 1 // spritesheet and gid offset
		var tile = this.scene.floor.getTileAtWorldXY(this.body.position.x, this.body.position.y, true)
		if (!tile || !tile.index) {
			return
		}
		if (tile.index == 63 + firstgid) {
			this.handleHitPortalTile(tile)
		}
		if (tile.index == 39 + firstgid) {
			// Hit exit tile
			this.handleHitExitTile(tile)
			
		}
	}

	handleLeftButton () {
		this.setVelocityX(-160);
		//this.body.setAccelerationX(-320);
		this.anims.play('player-left', true);
	}

	handleRightButton () {
		this.setVelocityX(160);
		//this.body.setAccelerationX(320);
		this.anims.play('player-right', true);
	}

	handleForwardButton () {
		this.setVelocityY(-320);
		this.setVelocityX(this.body.velocity.x * 0.8);
		//this.body.setAccelerationY(-640);
		//this.body.setAccelerationX(this.body.acceleration.x / 8);

		this.anims.play('player-forward-dashing', true);
		//this.setAcceleration(0, 100000)
	}

	handleBackwardButton () {
		this.setVelocityY(160);
		this.anims.play('player-downward', true);
		//this.setAcceleration(0, 100000)
	}

	handleFireButton () {
		this.handleForwardButton()
		if (this.mana_pool.drain(2)) {
			this.magic_missiles.fireMissile(this.body.position.x + 16, this.body.position.y + 16)
			this.eventually.emit('TUN_PLAYER_STATUS_UPDATE', this)
		}
	}

	handleSpellButton () {
	}


	handleCollideEvent (event, objA, objB) {
		// # if player vs monster tile, reduce health.
		this.handleBackwardButton()

	}


	handleHitPortalTile (tile) {
		var currPos = this.body.position.clone()
		var nPos = this.lastPortalPos
		if (!currPos.fuzzyEquals(nPos, 64)) {
			this.lastPortalPos = currPos
			this.body.position.x = nPos.x
			this.body.position.y = nPos.y
		}
	}

	handleHitExitTile (tile) {

		this.body.setAngularVelocity(2500)
		this.body.onCollide = false
		this.body.setMass(5.1)
		this.body.setVelocity(0, 800)
		this.setAlpha(0.4)
		this.setScale(0.8)
		this.anims.play('player-downward', true)
		this.scene.time.delayedCall(1_000, this.finallyExit, [], this)
		this.scene.tweens.add({
		  targets: this,
		  duration: 1_500,
		  scaleX: 5.0,
		  scaleY: 5.0,
		  yoyo: true,
		});
	}

	finallyExit () {
		this.scene.handlePlayerTunnelExit()
	}

	disabled_preUpdate (t, dt) {
		let velX, velY = this.body.velocity
		if(velY > -10) {
			//this.body.setAcceleration(0, -100)
		} else {
			//this.body.setAcceleration(0, 0)
		}
	}

}
