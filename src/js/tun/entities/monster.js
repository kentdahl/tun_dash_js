import {HealthPool} from "./tools/health_pool"

export class Monster extends Phaser.Physics.Arcade.Sprite {
	constructor(scene) {
		super(scene) // , config.x, config.y, "player-forward", 0);
		scene.add.existing(this);
		scene.physics.add.existing(this);
		this.gid = null
	}


	monster_initialize (name = null, config = null) {
		this.health_pool = new HealthPool(50)

		if (name) {
			this.setName(name)
		}
		if (config) {
			this.mygid = config.gid
		}

		this.scene.anims.create({
			key: 'monster-forward-dashing',
			//frames: [ { key: 'spritesheet', frame: 0 } ],
			frames: this.scene.anims.generateFrameNumbers('spritesheet', { start: 40, end: 57 }),
			frameRate: 1,
			repeat: -1
		});

		this.anims.play('monster-forward-dashing', true)

		var myname = this.name
		var mygid = this.mygid
		this.anim_key = 'monster-' + myname

		if (myname && mygid) {

			this.scene.anims.create({
				key: this.anim_key,
				frames: this.scene.anims.generateFrameNumbers('spritesheet', { start: mygid, end: mygid }),
				frameRate: 4,
				repeat: -1
			});

			this.anims.play(this.anim_key, true)
		}

		this.health = 25
		this.mana   = 10

		this.setBounce(0.05, 0.08);
		this.body.onWorldBounds = true;		
		this.body.setDamping(true)
		this.body.setDrag(500, 250) // 0.4, 0.4)
		this.body.setFriction(25, 5)
		this.body.setMaxVelocity(160, 360)

		this.body.setMass(5)
	}


	hitByMissile (missile) {
		if(this.health_pool.drain(5)) {
			// Hit, but not dead.
			this.scene.tweens.add({
				targets: this, // on the monster 
				duration: 200, // for 200ms 
				scaleX: 1.2, // that scale vertically by 20% 
				scaleY: 0.8, // and scale horizontally by 20% 
				yoyo: true, // at the end, go back to original scale 
			});
		} else {
			// Drained
			this.startToDie()
		}
	}


	startToDie () {
		this.body.setAngularVelocity(-500)
		this.body.collide = false
		this.body.setMass(0.1)
		this.body.setVelocity(this.body.position.x - 500, -800)
		this.setAlpha(0.4)
		this.setScale(0.8)
		this.scene.time.delayedCall(1_500, this.finallyDie, [], this)
		this.scene.tweens.add({
		  targets: this, // on the monster 
		  duration: 1_500, // for 200ms 
		  scaleX: 1.4, // that scale vertically by 20% 
		  scaleY: 1.4, // and scale horizontally by 20% 
		  yoyo: true, // at the end, go back to original scale 
		});

	}

	finallyDie () {
		this.setActive(false);
		this.setVisible(false);
	}

	disabled_preUpdate (t, dt) {
		//let velX, velY = this.body.velocity
		//this.body.setVelocity(velX / 2, velY / 2)

	}


}
