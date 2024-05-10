import {Player} from "../entities/player"
import {Monster} from "../entities/monster"

import {MeanieMonster} from "../entities/monsters/meanie"
import {SlimereMonster} from "../entities/monsters/slimer"
import {DevilMonster} from "../entities/monsters/devil"

export class TunnelScene extends Phaser.Scene {

	constructor() {
		super('tunnel')
	}

	init(props) {
		const { level = 0 } = props
		console.log(`Tunnel - init(${ level })`)
		this.givenLevel = level
		this.currentLevel = level
	}	

	preload() {
		console.log("Tunnel - preload()")
		var level = this.currentLevel
		console.log(` -> givenLevel: ${ level }`)
		this.tunnelTilemapName = 'tiled-' + this.getTunnelSceneNameForLevel(level)
		var tunnelFilename = this.getTunnelFilenameForLevel(level)
		console.log(` -> tunnelFilname: ${ tunnelFilename }`)
		var baseDir = this.getDataBaseDir()
		this.load.tilemapTiledJSON(this.tunnelTilemapName, tunnelFilename);
		//this.load.tilemapTiledJSON('tunnel', '../data/tunnels/tunnelXX.json');
		this.load.image('sprites', baseDir + '/images/sprites.png');
		this.load.spritesheet('spritesheet', baseDir + '/images/sprites.png', { frameWidth: 32, frameHeight: 32 });
	}

	create() {
		console.log("Tunnel - create()")
		const backgroundImage = this.add.image(0, 0,'sprites').setOrigin(0,0);
		//backgroundImage.setScale(1, 1);
		//backgroundImage.setY(128);


		const map = this.make.tilemap({ key: this.tunnelTilemapName });
		const tileset = map.addTilesetImage('sprites', 'sprites');
		this.tilemap = map

		this.floor = map.createLayer('Floor', tileset, 0, 0);

		// console.log(map.getObjectLayer('Entities').objects);

		this.objects  = map.createFromObjects('Objects');
		this.enemies  = this.populateEnemyEntities(map)
		this.physics.world.enable(this.enemies)

		this.floor.setCollisionByExclusion([-999, 39,40, 58,59,60,61,62,63,64,65, 66,67, 666], true);


		this.player = new Player({
			scene: this,
			x: 160,
			y: map.heightInPixels - 48, // 320,
		})

		this.physics.add.collider(this.player, this.floor);
		this.physics.add.collider(this.player, this.enemies);
		this.physics.add.collider(this.floor, this.enemies);
		this.physics.add.collider(this.enemies, this.enemies);
		this.physics.add.collider(this.player.magic_missiles, this.enemies, this.handleMissileHitMonster, null, this);
		this.physics.add.collider(this.player.magic_missiles, this.floor, this.handleMissileHitWall, null, this);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.scene.launch('hud')
		this.cameras.main.fadeIn(1000, 0, 0, 0)

		this.cameras.main.startFollow(this.player,true, 0, 0.9, 0, 200)

	}

	update () {
		this.player.handle_movement()
		this.player.handle_floor()
	}

	clickedStartBtn() {
		this.cameras.main.fadeOut(1000, 0, 0, 0)
	}

	handleMissileHitWall (missile, floor) {
		missile.recycleMissile()
	}

	handleMissileHitMonster (missile, monster) {
		missile.handleHitMonster(monster)
	}

	handleSteppedOnFloorTile (sprite, tile) {
	}

	populateEnemyEntities (map = null) {
		//return this.populateEnemyEntitiesSimple(map)
		return this.populateEnemyEntitiesComplex(map)
	}

	populateEnemyEntitiesSimple (map = null) {
		map = map || this.tilemap
		var enemies = this.physics.add.group()
		let layName = 'Entities'
		let scene   = this
		console.log("Summoning monsters ...")
		var entities = map.createFromObjects(layName, [{scene: scene, classType: Monster }])
		Phaser.Utils.Array.Each(entities, (enemy) => enemy.monster_initialize())
		enemies.addMultiple(entities)

		return enemies
	}

	populateEnemyEntitiesComplex (map = null) {
		map = map || this.tilemap
		var enemies = this.physics.add.group()
		let firstgid = 1;
		let monsterMap = {
			meanie: {gid: 40, klass: MeanieMonster,  },
			slimer: {gid: 41, klass: Monster,  },
			devil:  {gid: 42, klass: Monster,  },
			vore:   {gid: 43, klass: Monster,  },
			demon:  {gid: 44, klass: Monster,  },
			spider: {gid: 45, klass: Monster,  },
			grinder:  {gid: 46, klass: Monster,  },
			snotty:   {gid: 47, klass: Monster,  },
			deadhead: {gid: 48, klass: Monster,  },
			cultist:  {gid: 49, klass: Monster,  },
			snake:   {gid: 50, klass: Monster,  },
			octopus: {gid: 51, klass: Monster,  },
			ogre:    {gid: 52, klass: Monster,  },
			orc:     {gid: 53, klass: Monster,  },
			wraith:  {gid: 54, klass: Monster,  },
			skull:   {gid: 55, klass: Monster,  },
			knight:  {gid: 56, klass: Monster,  },
			mage:    {gid: 57, klass: Monster,  },
		}

		for (let [mName, mConfig] of Object.entries(monsterMap)) {
			let layName = 'Entities'
			let scene   = this
			// console.log("Summoning monsters of type: " + mName )
			var entities = map.createFromObjects(layName, [{gid: mConfig.gid + firstgid, scene: scene, classType: mConfig.klass }])
			Phaser.Utils.Array.Each(entities, (enemy) => enemy.monster_initialize(mName, mConfig))
			enemies.addMultiple(entities)
		}

		return enemies
	}

	handlePlayerTunnelExit () {
		this.cameras.main.fadeOut(1000, 0, 0, 0)
		this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
			this.callbackPlayerTunnelExitDone()
		})

	}

	callbackPlayerTunnelExitDone () {
		var nextTunnelName = this.getTunnelSceneNameForLevel(this.currentLevel + 1)
		console.log(nextTunnelName)
		// TODO: save score etc? or can we reuse it?
		this.player.player_uninitialize()
		if (this.isLastLevel()) {
			this.scene.sleep()
			this.scene.start('lobby')
		} else {
			this.scene.restart({level: this.currentLevel + 1})
		}
	}


	isLastLevel () {
		return this.currentLevel == 3 // # Num levels
	}

	getTunnelSceneNameForLevel (givenLevel = 1) {
		return 'tunnel' + (givenLevel).toString().padStart(2, '0')
	}

	getTunnelFilenameForLevel (givenLevel = 1) {
		let levelStr = this.getTunnelSceneNameForLevel(givenLevel)
		return this.getDataBaseDir() + '/data/tunnels/' + levelStr + '.json';
	}

	getDataBaseDir () {
		return '.';
	}


}
