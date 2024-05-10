import {Monster} from "../monster"

export class DevilMonster extends Monster {
	constructor(scene) {
		super(scene)
	}

	monster_initialize (name = null, config = null) {
		super.monster_initialize(name, config)
		this.health_pool.resetPool(50)
	}
}
