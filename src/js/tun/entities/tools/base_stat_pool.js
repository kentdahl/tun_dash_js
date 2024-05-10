export class BaseStatPool  {

	constructor(maxVal = 100, currVal = null) {
		this.resetPool(maxVal, currVal)
	}

	resetPool(maxVal = 100, currVal = null) {
		this.maxVal = maxVal
		this.val = currVal || maxVal
	}

	getCurrent () {
		return this.val
	}

	getValue () {
		return this.val
	}

	getRatio() {
		return this.val / this.maxVal
	}

	drain (val) {
		if(this.val >= val) {
			this.val -= val
			return true
		}
		return false
	}

	fill (val) {
		this.val += val
		if (this.val > this.maxVal) {this.val = this.maxVal}
		return this.val
	}

	isEmpty () {
		return this.val <= 0
	}
}
