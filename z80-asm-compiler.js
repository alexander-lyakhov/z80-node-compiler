const fs = require('fs')
const printf = require('printf')

const context = fs.readFileSync('ldir.asm', 'utf8')
const codes = fs.readFileSync('z80-asm-commands.json', 'utf8')

const isNumber = (val) => !isNaN(val)

const addrRegexp = /\baddr\b/
const offsetRegexp = /(\boffset\b)|(\bd\b)/ // searching for 'offset' or 'd'

function prettify(cmd, params, data) {

  if (!cmd && !params.length) {
    return ''
  }

  const tail = params.map(el => {
    //-----------------------------------------------------
    // replace expression '(addr)' with address value
    //-----------------------------------------------------
    if (addrRegexp.test(el)) {
      return el.replace(addrRegexp, data)
    }

    //-----------------------------------------------------
    // replace expression like '(ix + d)' with offset value
    //-----------------------------------------------------
    if (offsetRegexp.test(el)) {
      return el.replace(offsetRegexp, data)
    }

    return el
  })

  return `${cmd} ${tail.join(', ')}`//.toUpperCase()
}

function getCmdCode(path) {
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
  const params = rest.join('').split(',').reverse()
  let data = null

  if (isNumber(params[0])) {
    data = params.reverse().pop()
  }

  //console.log(cmd, params, data)

  console.log(
    printf(" %-24s | %-10s | %s",
      prettify(cmd, params, data),
      data ? data:'',
      line
    )
  )
})
