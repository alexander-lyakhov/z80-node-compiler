const fs = require('fs')
const printf = require('printf')

const context = fs.readFileSync('ldir.asm', 'utf8')
const codes = fs.readFileSync('z80-asm-commands.json', 'utf8')
//console.log(codes)

function normalize(cmd, args) {

  let extra;

  if (args.length > 2) {
    extra = args.pop()
  }

  const prettyArgs = args.map(el => {
    //-----------------------------------------------------
    // replace expression '(addr)' with address value
    //-----------------------------------------------------
    if (/addr/.test(el)) {
      return el.replace(/addr/, extra)
    }

    //-----------------------------------------------------
    // replace expression like '(ix + n)' with offset value
    //-----------------------------------------------------
    if (/\bn/.test(el)) {
      return el.replace(/\bn/, extra)
    }

    return el
  })

  return `${cmd} ${prettyArgs.join(', ')}`//.toUpperCase()
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
  const tail = rest.join('')
  let args = tail.split(',')

  //-----------------------------------------------------------------------------------------------------
  // Got args array with only one element [''] if line contains empty string or command has no parameters
  // In this case args array needs to be cleared
  //-----------------------------------------------------------------------------------------------------
  if (args[0] === '') {
    args = []
  }

  //console.log(printf('%10s: %s', 'mnemonic', line))
  //console.log(printf("%10s: %s", 'command', cmd))
  //console.log(printf("%10s: %s", 'arg1', args[0]))
  //console.log(printf("%10s: %s", 'arg2', args[1]))

  //console.log(cmd, args)

  console.log(printf(" %-24s |", `${cmd}, ${args.join(', ')}`))
  console.log(printf(" %-24s |", normalize(cmd, args)))

  //console.log('-----------')
})
