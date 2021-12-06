const fs = require('fs')
const printf = require('printf')

const context = fs.readFileSync('ldir.asm', 'utf8')
const codes = fs.readFileSync('z80-asm-commands.json', 'utf8')
//console.log(codes)

const isNumber = (val) => !isNaN(val)

function prettify(path, param) {

  if (!path.length && !param) {
    return ''
  }

  const cmd = path.shift()

  const tail = path.map(el => {
    //-----------------------------------------------------
    // replace expression '(addr)' with address value
    //-----------------------------------------------------
    if (/addr/.test(el)) {
      return el.replace(/addr/, param)
    }

    //-----------------------------------------------------
    // replace expression like '(ix + n)' with offset value
    //-----------------------------------------------------
    if (/\bn/.test(el)) {
      return el.replace(/\bn/, param)
    }

    return el
  })

  return `${cmd} ${tail.join(', ')}`//.toUpperCase()
}

function getCmdCode(cmd) {
  while(cmd) {
    if (typeof(cmd) !== 'object') {
      return cmd
    }

    console.log(cmd)
    obj = Object.values(cmd)[0]
  }
}

const lines = context.split('\n')

lines.forEach(line => {
  //console.log(line)

  const [cmd, ...rest] = line.split(/\s/)
  const parts = [cmd, ...rest.join('').split(',')]

  const path = []
  const params = []

  while(parts[0]) {
    let el = parts.shift()

    if (el !== '') {
      isNumber(el)
        ? params.push(el) // params may contain always only 1 element
        : path.push(el)
    }

  }

  //console.log(path, params)

  //console.log(printf('%10s: %s', 'mnemonic', line))
  //console.log(printf("%10s: %s", 'command', cmd))
  //console.log(printf("%10s: %s", 'arg1', args[0]))
  //console.log(printf("%10s: %s", 'arg2', args[1]))

  //console.log(cmd, args)

  //console.log(printf(" %-24s |", `${cmd}, ${args.join(', ')}`))
  //console.log(printf(" %-24s |", prettify(cmd, params)))
  console.log(printf(" %-24s | %s", prettify(path, params[0]), params.join(', ')))

  //console.log('-----------')
})
