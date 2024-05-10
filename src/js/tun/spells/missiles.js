import {LightningSpell} from "./lightning"

export class MagicMissiles extends Phaser.Physics.Arcade.Group
{
    constructor (scene)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 25,
            key: 'lightning',
            active: false,
            visible: false,
            classType: LightningSpell,
        });


		scene.anims.create({
			key: 'spell-lightning',
			frames:  scene.anims.generateFrameNumbers('spritesheet', { start: 10, end: 12 }),
			frameRate: 10,
			repeat: -1
		});

    }

    fireMissile (x, y)
    {
        let missile = this.getFirstDead(false);

        if (missile)
        {
            missile.fire(x, y);
        }
    }
}
