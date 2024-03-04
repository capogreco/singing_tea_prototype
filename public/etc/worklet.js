import * as bab_const   from '/etc/constants.mjs'
import * as bab_funct   from '/etc/functions.mjs'
import * as bab_class   from '/etc/classes.mjs'
// import * as perlin      from '/perlin.js'

const { pow, random, sin } = Math

function deparameterise (index) {
    return this[(1 !== this.length) * index]
}

class TestProcessor extends AudioWorkletProcessor {

    static get parameterDescriptors () {
        return [
            { name: 'time',          defaultValue: 0     },
            { name: 'freq',          defaultValue: 175   },
            { name: 'amp',           defaultValue: 1     },
            { name: 'vibrato_rate',  defaultValue: 4     },
            { name: 'vibrato_width', defaultValue: 0.1   },
            { name: 'detune_rate',   defaultValue: 6     },
            { name: 'detune_width',  defaultValue: 12    },
            { name: 'disunity',      defaultValue: 0     },
            { name: 'sample_rate',   defaultValue: 48000 },
        ]
    }

    constructor () {
        super ()
        this.alive              = true
        this.time               = 0
        this.disunity_offset    = random ()
        this.phasor             = new bab_class.Phasor ()
        this.vibrato_phasor     = new bab_class.Phasor ()
    }

    process (inputs, outputs, parameters) {
        const out = outputs[0][0]

        const sample_rate = parameters.sample_rate[0]

        this.phasor.assign ({sample_rate})
        this.vibrato_phasor.assign ({sample_rate})

        for (let frame = 0; frame < out.length; ++frame) { // for loop calculating each frame in the block
            const freq          = deparameterise.call (parameters.freq,          frame)
            const amp           = deparameterise.call (parameters.amp,           frame)

            const vibrato_width = deparameterise.call (parameters.vibrato_width, frame)
            const vibrato_rate  = deparameterise.call (parameters.vibrato_rate,  frame)

            const detune_width  = deparameterise.call (parameters.detune_width,  frame)
            const detune_rate   = deparameterise.call (parameters.detune_rate,   frame)

            const disunity      = deparameterise.call (parameters.disunity,      frame)

            const noise_offset = disunity * this.disunity_offset
            let noise_sig = bab_funct.noise1 (parameters.time[frame] * (2 ** detune_rate) + noise_offset)
            noise_sig *= 2
            noise_sig -= 1 // [ -1, 1 ]
            noise_sig *= detune_width
            // noise_sig *= 0.0008333333333333334 // = 0.01 / 12
            // noise_sig = noise_sig ** (1 - detune_width)

            this.vibrato_phasor.frequency = vibrato_rate
            this.vibrato_phasor.increment ()
            const vibrato_offset = disunity * this.disunity_offset
            let vibrato_sig = bab_funct.sine ((this.vibrato_phasor.phase + vibrato_offset) * bab_const.two_pi)
            vibrato_sig *= vibrato_width
            // vibrato_sig *= 0.0008333333333333334 // = 0.01 / 12
            // vibrato_sig = vibrato_sig ** (1 - vibrato_width)
            // vibrato_sig = vibrato_sig * vibrato_width * 12


            // this.phasor.frequency = freq * (vibrato_sig + 1) * (noise_sig + 1)
            this.phasor.frequency = freq * (2 ** vibrato_sig) * (2 ** noise_sig)
            this.phasor.increment ()

            const location = bab_funct.table_locate (freq)
            // const amp_array = [ 0.5, 1.5, 2.0 ]

            const formant_count = 3

            out[frame] = 0

            out[frame] +=
                amp ** 0.5 *
                bab_funct.formant (
                    this.phasor.phase,
                    bab_funct.table_evaluate (location, 0, 0),
                    bab_funct.table_evaluate (location, 0, 1),
                    bab_funct.table_evaluate (location, 0, 2)
                )

            out[frame] +=
                amp ** 1.5 *
                bab_funct.formant (
                    this.phasor.phase,
                    bab_funct.table_evaluate (location, 1, 0),
                    bab_funct.table_evaluate (location, 1, 1),
                    bab_funct.table_evaluate (location, 1, 2)
                )

            out[frame] +=
                amp ** 2 *
                bab_funct.formant (
                    this.phasor.phase,
                    bab_funct.table_evaluate (location, 2, 0),
                    bab_funct.table_evaluate (location, 2, 1),
                    bab_funct.table_evaluate (location, 2, 2)
                )

            out[frame] /= formant_count
        }

    return this.alive
    }

}

registerProcessor ('test', TestProcessor)
