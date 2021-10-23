const printf = require('printf')

/*
const args = process.argv.slice(2)
console.log('arguments', args)
*/

//const str = 'ld  a, b'
//const str = 'ld a, (hl)'
//const str = 'xor a'
const str = 'ldir'
const re = /(\w+) +(\w+)?(, ?(\(?\w+\)?).*)?/
//const reArg1 = /.+ (\w+) .*/
const rxp = /^(\w+) +(\w+)$/

/*
let cmd = str.replace(re, '$1')
let arg1 = str.replace(re, '$2')
let arg2 = str.replace(re, '$4')
*/


const [cmd, ...rest] = str.split(/\s/)
const tail = rest.join('')

let args = tail.split(',')

if (args[0] === '') args.shift()

console.log(args, args.length)

console.log(printf("%10s: %s", 'command', cmd))
console.log(printf("%10s: %s", 'tail', tail))
console.log(printf("%10s: %s", 'arg1', args[0]))
console.log(printf("%10s: %s", 'arg2', args[1]))
console.log(printf('%10s: %s', 'mnemonic', str))