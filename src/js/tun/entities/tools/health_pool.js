import {BaseStatPool} from "./base_stat_pool"

export class HealthPool extends BaseStatPool {

	constructor(maxHealth = 100) {
		super(maxHealth)
	}
}
