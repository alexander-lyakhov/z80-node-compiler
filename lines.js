const fs = require('fs')
const printf = require('printf')

const context = fs.readFileSync('ldir.asm', 'utf8')
const lines = context.split('\r\n')

const rxp = /^(\w+) +(.*)$/

function normalize(cmd, args) {

	let extra = args[2];

	if (args.length > 2) {
		args.pop()
	}

	const prettyArgs = args.map(el => {
		if (/addr/.test(el)) {
			return el.replace(/addr/, extra)
		}

		if (/\bn/.test(el)) {
			return el.replace(/\bn/, extra)
		}

		return el
	})

	return `${cmd} ${prettyArgs.join(',')}`
}

lines.forEach(line => {
	//console.log(line)

	const [cmd, ...rest] = line.split(/\s/)
	const tail = rest.join('')
	let args = tail.split(',')

	if (args[0] === '') args.shift()

	console.log(printf('%10s: %s', 'mnemonic', line))
	console.log(printf("%10s: %s", 'command', cmd))
	console.log(printf("%10s: %s", 'arg1', args[0]))
	console.log(printf("%10s: %s", 'arg2', args[1]))

	console.log(printf("%10s: %s", 'pretty', normalize(cmd, args)))

	console.log('-----------')
})
