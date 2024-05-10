export class LightningSpell extends Phaser.Physics.Arcade.Sprite
{
	constructor (scene, x, y)
	{
		super(scene, x, y, 'lightning');
	}

	fire (x, y)
	{
		this.body.reset(x, y);

		this.setActive(true);
		this.setVisible(true);

		this.setVelocityY(-480);

		this.body.allowRotation = true
		this.body.setAngularVelocity(25)
		this.body.setMass(0.5)

		this.startY = y;
		this.endY   = y - 480 * 5
		this.anims.play('spell-lightning')
	}

	preUpdate (time, delta)
	{
		super.preUpdate(time, delta);

		if (this.y <= this.endY)
		{
			this.recycleMissile()
		}

		if (this.body.velocity.y > -100) {
			// What did we hit?
			this.recycleMissile()
		}
	}

	handleHitMonster (monster) {
		monster.hitByMissile(this)
		this.recycleMissile()
	}

	recycleMissile () {
		this.setActive(false);
		this.setVisible(false);
	}
}
