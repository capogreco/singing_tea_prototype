
Array.prototype.random_element = function () {
   return this[Math.floor(Math.random() * this.length)]
}

const root_freq        = 261.6255653005986 // middle c
const root_vib_freq    = 4.0878994578218535
const root_detune_freq = 1.4182750313832862e-17

let test 

// const context = new AudioContext ()

function runTest () {
   // socket.on ('program', program_function)

   test = new AudioWorkletNode (context, 'test')
   const sample_rate = test.parameters.get ('sample_rate')
   sample_rate.value = context.sampleRate

   const time = test.parameters.get ('time')
   const seconds_in_a_week = 60*60*24*7
   time.linearRampToValueAtTime (seconds_in_a_week, seconds_in_a_week)

   // amp
   const amp = test.parameters.get ('amp')

   // freq
   const freq = test.parameters.get ('freq') // [ 175, 1568 )
   freq.value = root_vib_freq * (2 ** ([ 0, 3, 7, 10, 14, 20 ].random_element () / 12))

   // vibrato
   const vibrato_rate = test.parameters.get ('vibrato_rate')
   vibrato_rate.value = root_vib_freq

   const vibrato_width = test.parameters.get ('vibrato_width')
   vibrato_width.value =  0

   // detune
   const detune_rate = test.parameters.get ('detune_rate')
   detune_rate.value = root_vib_freq

   const detune_width = test.parameters.get ('detune_width')
   detune_width.value = 0

   // disunity
   const disunity = test.parameters.get ('disunity')
   disunity.value = 1 // [ -8, 3 ]

   test.connect (context.destination)

   // handlers
   const freq_start_num_handler = new Array_Handler ()
   const freq_start_den_handler = new Array_Handler ()
   const freq_end_num_handler = new Array_Handler ()
   const freq_end_den_handler = new Array_Handler ()

   const tilt_handler = new Array_Handler ()
   const local_interval_num_handler = new Array_Handler ()
   const local_interval_den_handler = new Array_Handler ()

   const vib_wid_start_handler = new Array_Handler ()
   const vib_rate_start_num_handler = new Array_Handler ()
   const vib_rate_start_den_handler = new Array_Handler ()
   const vib_wid_end_handler = new Array_Handler ()
   const vib_rate_end_num_handler = new Array_Handler ()
   const vib_rate_end_den_handler = new Array_Handler ()

   const detune_wid_start_handler = new Array_Handler ()
   const detune_rate_start_num_handler = new Array_Handler ()
   const detune_rate_start_den_handler = new Array_Handler ()
   const detune_wid_end_handler = new Array_Handler ()
   const detune_rate_end_num_handler = new Array_Handler ()
   const detune_rate_end_den_handler = new Array_Handler ()

   function program_function (data) {
       // console.log (data)

       // page 0: frequency
       freq_start_num_handler.array = unpack_array (data.page_array[0].row_array[0].value_range)
       freq_start_num_handler.behaviour = data.page_array[0].row_array[0].behave.state
       freq_start_num_handler.init ()

       freq_start_den_handler.array = unpack_array (data.page_array[0].row_array[1].value_range)
       freq_start_den_handler.behaviour = data.page_array[0].row_array[1].behave.state
       freq_start_den_handler.init ()

       freq_end_num_handler.array = unpack_array (data.page_array[0].row_array[2].value_range)
       freq_end_num_handler.behaviour = data.page_array[0].row_array[2].behave.state
       freq_end_num_handler.init ()

       freq_end_den_handler.array = unpack_array (data.page_array[0].row_array[3].value_range)
       freq_end_den_handler.behaviour = data.page_array[0].row_array[3].behave.state
       freq_end_den_handler.init ()

       // page 1: tempo
       global_interval = data.tempo_period / 1000

       tilt_handler.array = unpack_array (data.page_array[1].row_array[0].value_range)
       tilt_handler.behaviour = data.page_array[1].row_array[1].behave.state
       tilt_handler.init ()

       local_interval_num_handler.array = unpack_array (data.page_array[1].row_array[1].value_range)
       local_interval_num_handler.behaviour = data.page_array[1].row_array[1].behave.state
       local_interval_num_handler.init ()
       
       local_interval_den_handler.array = unpack_array (data.page_array[1].row_array[2].value_range)
       local_interval_den_handler.behaviour = data.page_array[1].row_array[2].behave.state
       local_interval_den_handler.init ()

       // page 2: vibrato
       vib_wid_start_handler.array = unpack_array (data.page_array[2].row_array[0].value_range)
       vib_wid_start_handler.behaviour = data.page_array[2].row_array[0].behave.state
       vib_wid_start_handler.init ()

       vib_rate_start_num_handler.array = unpack_array (data.page_array[2].row_array[1].value_range)
       vib_rate_start_num_handler.behaviour = data.page_array[2].row_array[1].behave.state
       vib_rate_start_num_handler.init ()

       vib_rate_start_den_handler.array = unpack_array (data.page_array[2].row_array[2].value_range)
       vib_rate_start_den_handler.behaviour = data.page_array[2].row_array[2].behave.state
       vib_rate_start_den_handler.init ()

       vib_wid_end_handler.array = unpack_array (data.page_array[2].row_array[3].value_range)
       vib_wid_end_handler.behaviour = data.page_array[2].row_array[3].behave.state
       vib_wid_end_handler.init ()

       vib_rate_end_num_handler.array = unpack_array (data.page_array[2].row_array[4].value_range)
       vib_rate_end_num_handler.behaviour = data.page_array[2].row_array[4].behave.state
       vib_rate_end_num_handler.init ()

       vib_rate_end_den_handler.array = unpack_array (data.page_array[2].row_array[5].value_range)
       vib_rate_end_den_handler.behaviour = data.page_array[2].row_array[5].behave.state
       vib_rate_end_den_handler.init ()

       // page 3: detune
       detune_wid_start_handler.array = unpack_array (data.page_array[3].row_array[0].value_range)
       detune_wid_start_handler.behaviour = data.page_array[3].row_array[0].behave.state
       detune_wid_start_handler.init ()

       detune_rate_start_num_handler.array = unpack_array (data.page_array[3].row_array[1].value_range)
       detune_rate_start_num_handler.behaviour = data.page_array[3].row_array[1].behave.state
       detune_rate_start_num_handler.init ()

       detune_rate_start_den_handler.array = unpack_array (data.page_array[3].row_array[2].value_range)
       detune_rate_start_den_handler.behaviour = data.page_array[3].row_array[2].behave.state
       detune_rate_start_den_handler.init ()

       detune_wid_end_handler.array = unpack_array (data.page_array[3].row_array[3].value_range)
       detune_wid_end_handler.behaviour = data.page_array[3].row_array[3].behave.state
       detune_wid_end_handler.init ()

       detune_rate_end_num_handler.array = unpack_array (data.page_array[3].row_array[4].value_range)
       detune_rate_end_num_handler.behaviour = data.page_array[3].row_array[4].behave.state
       detune_rate_end_num_handler.init ()

       detune_rate_end_den_handler.array = unpack_array (data.page_array[3].row_array[5].value_range)
       detune_rate_end_den_handler.behaviour = data.page_array[3].row_array[5].behave.state
       detune_rate_end_den_handler.init ()
   }

   function local_tempo_click () {
       if (local_interval <= 0) return
       envelopes ()
       setTimeout (local_tempo_click, local_interval * 1000)
   }

   function envelopes () {
       // tempo
       const t = context.currentTime
       const local_interval_mult = local_interval_den_handler.next () / local_interval_num_handler.next ()
       local_interval = global_interval * local_interval_mult

       const end_time = t + local_interval - 0.02

       // amp
       const tilt = (tilt_handler.next () - 1) / 11
       const atk = local_interval * tilt
       amp.linearRampToValueAtTime (1, t + atk + 0.005)
       amp.exponentialRampToValueAtTime (0.01, end_time)

       // freq
       freq.value = root_freq * freq_start_num_handler.next () / freq_start_den_handler.next ()
       const end_freq = freq.value * freq_end_num_handler.next () / freq_end_den_handler.next ()
       // console.log (`${freq.value} to ${end_freq}`)
       freq.exponentialRampToValueAtTime (end_freq, end_time)

       // vibrato
       let start_vibrato_width = (vib_wid_start_handler.next () - 1 ) / 11
       start_vibrato_width = 1 - start_vibrato_width
       start_vibrato_width = (0.01 / 12) ** start_vibrato_width
       vibrato_width.value = start_vibrato_width

       let end_vibrato_width = (vib_wid_end_handler.next () - 1 ) / 11
       end_vibrato_width = 1 - end_vibrato_width
       end_vibrato_width = (0.01 / 12) ** end_vibrato_width
       vibrato_width.exponentialRampToValueAtTime (end_vibrato_width, end_time)

       vibrato_rate.value = root_vib_freq * vib_rate_start_num_handler.next () / vib_rate_start_den_handler.next ()
       const end_vib_rate = vibrato_rate.value * vib_rate_end_num_handler.next () / vib_rate_end_den_handler.next ()
       vibrato_rate.exponentialRampToValueAtTime (end_vib_rate, end_time)

       // detune
       let start_detune_width = (detune_wid_start_handler.next () - 1 ) / 11
       start_detune_width = 1 - start_detune_width
       start_detune_width = (0.01 / 12) ** start_detune_width
       detune_width.value = start_detune_width

       let end_detune_width = (detune_wid_end_handler.next () - 1 ) / 11
       end_detune_width = 1 - end_detune_width
       end_detune_width = (0.01 / 12) ** end_detune_width
       detune_width.exponentialRampToValueAtTime (end_detune_width, end_time)

       detune_rate.value = root_vib_freq * detune_rate_start_num_handler.next () / detune_rate_start_den_handler.next ()
       const end_detune_rate = detune_rate.value * detune_rate_end_num_handler.next () / detune_rate_end_den_handler.next ()
       detune_rate.exponentialRampToValueAtTime (end_detune_rate, end_time)

   }

   let local_interval = 2
   let global_interval = 2
   local_tempo_click ()
}

class Array_Handler {
   constructor (array = [ 1 ]) {
       this.array = array
       this.current_index
       this.behaviour = 0
       this.shuffled_array = shuffle (array)
       this.trem_state = 0
       this.trem_direction = 0
   }

   init () {
       this.current_index = Math.floor (Math.random () * this.array.length)
       this.shuffled_array = shuffle (this.array)
   }

   unpack (range) {
       this.array = unpack_array (range)
   }

   next () {
       switch (this.behaviour) {
           case 0: // random
               this.current_index = Math.floor (Math.random () * this.array.length)
               return this.array[this.current_index]
               break
           case 1: // descending
               this.current_index += this.array.length
               this.current_index -= 1
               this.current_index %= this.array.length
               return this.array[this.current_index]
               break
           case 2: // static
               return this.array[this.current_index]
               break
           case 3: // descending trill
               this.trem_state ^= true
               let descending_trill_index = this.current_index - this.trem_state
               descending_trill_index += this.array.length
               descending_trill_index %= this.array.length
               return this.array[descending_trill_index]
               break
           case 4: // ascending
               this.current_index += 1
               this.current_index %= this.array.length
               return this.array[this.current_index]
               break
           case 5: // bi-directional trill
               this.trem_state ^= true
               if (this.trem_state == 0)
                   this.trem_direction ^= true
               let trem_value = Math.pow (-1, this.trem_direction)
               trem_value *= this.trem_state
               let bi_trill_index = this.current_index + trem_value
               bi_trill_index += this.array.length
               bi_trill_index %= this.array.length
               return this.array[bi_trill_index]
               break
           case 6: // ascending trill
               this.trem_state ^= true
               let ascending_trill_index = this.current_index + this.trem_state
               ascending_trill_index %= this.array.length
               return this.array[ascending_trill_index]
               break
           case 7: // shuffle
               this.current_index += 1
               this.current_index %= this.shuffled_array.length
               return this.shuffled_array[this.current_index]
               break

        }
   }

   shuffle () {
       this.shuffled_array = shuffle (this.shuffled_array)
   }
}

function shuffle (array) {
 let current_index = array.length, temporary_value, random_index

 // While there remain elements to shuffle...
 while (current_index--) {

   // Pick a remaining element...
   random_index = Math.floor (Math.random () * (current_index));

   // And swap it with the current element.
   temporary_value = array [current_index]
   array[current_index] = array[random_index]
   array[random_index] = temporary_value
 }

 return array;
}

function delay (passed_function, now, wait) {
   setTimeout (passed_function, now + wait)
}

function unpack_array (range) {
   const min = range[0]
   const max = range[1]

   if (min == max)
       return [ min ]

   const length = max - min + 1
   // console.log (length)
   const array = new Array (length).fill (0).map ((_, i) => min + i)
   return array
}

function choose_element (array) {
   return array[ Math.floor (Math.random () * array.length) ]
}


const synth_info = {}

let last_ping = false

const connection_test = () => {
   if (last_ping < Date.now () - 12000 || socket.readyState > 1) {
      location.reload ()
   }

   setTimeout (connection_test, 3000)
}

// const ws_address = `ws://localhost`
const ws_address = `wss://healthy-hedgehog-66.deno.dev`

console.log (`attempting websocket at ${ ws_address }`)

const socket = new WebSocket (ws_address)

socket.onopen = () => console.log (`websocket achieved!`)

// check for pings within last 12 seconds.  If not, reload
const check_connection = () => {}

socket.onmessage = m => {
   const { method, content } = JSON.parse (m.data)

   // console.log (`${ method } message recieved`)

   const handle_incoming = {

      id: () => {
         Object.assign (synth_info, content)
         console.log (`welcome, ${ synth_info.name }!`)
         last_ping = Date.now ()
         connection_test ()
      },

      ping: () => {
         last_ping = Date.now ()
         socket.send (JSON.stringify ({
            type    : `synth`,
            method  : `pong`,
            content : content,
         }))
      },

      upstate: () => {
         if (context.state == `running` && content.is_playing) {
            const pos = {
               x: content.x * innerWidth,
               y: content.y * innerHeight,
            }
            ctx.fillStyle = `turquoise`
            ctx.fillRect (pos.x - 50, pos.y - 50, 100, 100)
         }
      },

      note: () => {
         // if (context.state == `running`) {
         //    bg_col = `turquoise`
         //    setTimeout (() => bg_col = `deeppink`, msg.content[1] * 1000)

         //    const t = context.currentTime
         //    rev_gate.gain.cancelScheduledValues (t)
         //    rev_gate.gain.setValueAtTime (rev_gate.gain.value, t)
         //    const r = ((1 - msg.state.y) ** 12) * 0.4
         //    rev_gate.gain.linearRampToValueAtTime (r, t + msg.content[1])

         //    play_osc (...msg.content, context)
         // }
      }
   }
   // console.log (method)
   handle_incoming[method] ()
}


// function midi_to_cps (n) {
//    return 440 * (2 ** ((n - 69) / 12))
// }

// function rand_element (arr) {
//    return arr[rand_integer (arr.length)]
// }

// function rand_integer (max) {
//    return Math.floor (Math.random () * max)
// }

// function shuffle_array (a) {
//    for (let i = a.length - 1; i > 0; i--) {
//       let j = Math.floor (Math.random () * (i + 1));
//       [ a[i], a[j] ] = [ a[j], a[i] ]
//    }
// }

// socket.addEventListener ('open', msg => {
//    console.log (`websocket is ${ msg.type } at ${ msg.target.url } `)
// })

// ~ UI THINGS ~

let bg_col = `deeppink`

document.body.style.margin   = 0
document.body.style.overflow = `hidden`

document.body.style.backgroundColor = `black`
const text_div                = document.createElement (`div`)
text_div.innerText            = `tap to join the distributed arpeggiator instrument`
text_div.style.font           = `italic bolder 80px sans-serif`
text_div.style.color          = `white`
text_div.style.display        = `flex`
text_div.style.justifyContent = `center`
text_div.style.alignItems     = `center`
text_div.style.position       = `fixed`
text_div.style.width          = `${ window.innerWidth }px`
text_div.style.height         = `${ window.innerHeight }px`
text_div.style.left           = 0
text_div.style.top            = 0
document.body.appendChild (text_div)

document.body.onclick = async () => {
   if (document.body.style.backgroundColor == `black`) {

      // await context.resume ()
      await init_audio ()

      document.body.style.backgroundColor = bg_col
      text_div.remove ()

      const name_div = document.createElement (`div`)
      name_div.style.textAlign = `center`
      name_div.style.position  = `fixed`
      name_div.style.color     = `white`
      name_div.style.width     = `100%`
      name_div.style.font      = `14px monospace`
      name_div.style.left      = 0
      name_div.style.top       = 0
      name_div.innerText       = synth_info.name
      document.body.appendChild (name_div)

      const audio_enabled = context.state == `running`
      socket.send (JSON.stringify ({
         type    : `synth`,
         method  : `audio_enabled`, 
         content : { audio_enabled }
      }))   

      console.log (synth_info)
      requestAnimationFrame (draw_frame)
   }
}

// ~ WEB AUDIO THINGS ~

let context

const init_audio = async () => {
   context = new AudioContext ()
   await context.resume ()
   await context.audioWorklet.addModule (`etc/worklet.js`)
      .then (() => runTest ())

}

// const context = new AudioContext ()
// context.suspend ()



cnv.width = innerWidth
cnv.height = innerHeight
const ctx = cnv.getContext (`2d`)

function draw_frame () {
   ctx.fillStyle = bg_col
   ctx.fillRect (0, 0, cnv.width, cnv.height)   

   requestAnimationFrame (draw_frame)
}

function check_websocket () {
   if (socket.readyState > 1) location.reload ()
   setTimeout (check_websocket, 333)
}

// check_websocket ()
