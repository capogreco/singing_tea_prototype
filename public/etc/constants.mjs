export const sr = 16744.03616 // sample rate

export const two_pi = 2 * Math.PI

const amp_vals_1 = [ 0.4, 0.4, 0.8, 0.8, 0.8, 0.8, 0.8 ]
const amp_vals_2 = [ 0.8, 0.8, 0.4, 0.2, 0.1, 0.1, 0.0 ]
const amp_vals_3 = [ 0.15, 0.15, 0.15, 0.15, 0.15, 0.1, 0.1 ]

const index_vals_1 = [ 0.1, 0.1, 0.1, 0.1, 0, 0, 0 ]
const index_vals_2 = [ 0.5, 0.1, 0.1, 0.1, 0, 0, 0 ]
const index_vals_3 = [ 1.6, 1.6, 1.6, 1.6, 1.6, 1.5, 1.0 ]

export const freq_vals_1 = [ 175, 262, 392, 523, 784, 1046, 1568 ]
const freq_vals_2 = [ 350, 524, 784, 950, 1568, 2092, 3136 ]
const freq_vals_3 = [ 2800, 2700, 2500, 2450, 2400, 2350, 4500 ]

let harm_1 = new Array (7)
let harm_2 = new Array (7)
let harm_3 = new Array (7)

for (let i = 0; i < 7; i++ ) {
    harm_1[i] = 1
    harm_2[i] = freq_vals_2[i] / freq_vals_1[i]
    harm_3[i] = freq_vals_3[i] / freq_vals_1[i]
}

export const freq_table = [ freq_vals_1, freq_vals_2, freq_vals_3 ]
export const amp_table = [ amp_vals_1, amp_vals_2, amp_vals_3 ]
export const index_table = [ index_vals_1, index_vals_2, index_vals_3 ]
export const harm_table = [ harm_1, harm_2, harm_3 ]
export const table =[ harm_table, index_table, amp_table ]