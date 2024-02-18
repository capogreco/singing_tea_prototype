import * as bab_const 	from '/etc/constants.mjs'
import * as bab_funct 	from '/etc/functions.mjs'


export class Operator {
	constructor (/*...arguments*/) {
		this.assign (...arguments)
	}
	assign (/*...arguments*/) {
		Object.assign (this, ...arguments)
	}
	get sr () {
		return this.sample_rate
	}
}

export class Phasor extends Operator {
	constructor (/*...arguments*/) {
		super ({
			phase:0,
			frequency:220,
			sample_rate:44100
		}, ...arguments)
	}

	increment (freq) {
		this.phase += this.frequency / this.sample_rate
		this.phase %= 1
	}
}

export class LFO extends Operator {
	constructor (/*...arguments*/) {
		super ({
			phasor: new Phasor ({frequency:7}, ...arguments),
			phase: 0,
			amp: 1
		}, ...arguments)
	}

	increment (freq) {
		this.phasor.frequency = freq
		this.phasor.increment ()
		this.last_square = this.square
		this.square = Math.floor (this.phasor.phase * 2)
		if (this.square > this.last_square) {
			this.val = Math.random () * 2 - 1
		}
	}

}

export class Lorenz extends Operator {
	constructor (/*...arguments*/) {
		super ({
			x:   0.1 * (2 ** (Math.random () * 2 - 1)),
			y:   0.1 * (2 ** (Math.random () * 2 - 1)),
			z:   0.1 * (2 ** (Math.random () * 2 - 1)),
			a:  10.0 * (2 ** (Math.random () * 2 - 1)),
			b:  28.0 * (2 ** (Math.random () * 2 - 1)),
			c:   8.0 * (2 ** (Math.random () * 2 - 1)) / 3,
			dt:  1.0
		}, ...arguments)
	}

	increment () {
		const {x, y, z, a, b, c, dt, sr} = this, df = dt/sr
		this.x += a * (y - x) * df
		this.y += (x * (b - z) - y) * df
		this.z += (x * y - c * z) * df
	}
}

//	export class Perlin {
//		constructor () {
//			this.t = Math.random * 4096
//			this.dt = 0.001 / 48000
//			this.val = bab_funct.noise1 (this.t)
//		}
//	
//		increment () {
//			this.t += this.dt
//			this.val = bab_funct.noise1 (this.t)
//		}
//	}

//	export class Filter {
//		constructor () {
//			this.update_coefficients (250)
//		}
//	
//		update_coefficients (frequency) {
//			this.b1 = Math.exp (-frequency * bab_const.two_pi / bab_const.sr)
//			this.a0 = 1.0 - this.b1
//			this.z1 = 0
//		}
//	
//		process (input, freq) {
//	   	this.update_coefficients (freq)
//	   	this.z1 = input * this.a0 + this.z1 * this.b1
//		   return this.z1
//	   }
//	
//	}

