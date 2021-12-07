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

  let tail = params.map(el => {
    //-----------------------------------------------------
    // replace expression '(addr)' with address value
    //-----------------------------------------------------
    if (addrRegexp.test(el)) {
      return el.replace(addrRegexp, ` ${data} `)
    }

    //-----------------------------------------------------
    // for expressions like 'ld a, (23606)'
    //-----------------------------------------------------
    if (/\((\d+)\)/.test(el)) {
      return `( ${data} )`
    }

    //-----------------------------------------------------
    // for expressions like 'ld (ix + offset), a'
    //-----------------------------------------------------
    if (/\(ix\+(\d+)\)/.test(el)) {
      return `(ix + ${data})`
    }

    //-----------------------------------------------------
    // for expressions like 'ld (iy + offset), a'
    //-----------------------------------------------------
    if (/\(iy\+(\d+)\)/.test(el)) {
      return `(iy + ${data})`
    }

    return el
  })
  .join(', ')

  if (params.length === 1 && data) {
    tail = tail + `, ${data}`
  }

  return `${cmd} ${tail}`//.toUpperCase()
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

  if (line.trim()[0] === '#') {
    return
  }

  const [cmd, ...rest] = line.split(/\s/)
  const params = rest.join('').split(',')
  const last = params[params.length - 1]
  let data = null

  //-----------------------------------------------------------------
  // Needed for expressions like this: 'ld a, (addr), 23606'
  // Cut last parameter if it is a number and remove it from params
  //-----------------------------------------------------------------
  if (isNumber(last)) {
    data = params.pop()
  }

  //-----------------------------------------------------------------
  // Cut last parameter if it is a number
  // But don't remove it from params array
  //-----------------------------------------------------------------
  //if (/\D*,\s*(-?\d+)\D*/.test(line)) {
  //  data = line.replace(/\D*,\s*(-?\d+)\D*/, '$1')
  //}

  //if (/addr/.test(line) && isNumber(last)) {
  //  params.pop()
  //}

  //-----------------------------------------------------------------
  // Needed for expressions like 'ld (23606), a' or 'ld (ix + 5), a'
  //-----------------------------------------------------------------
  if (/\D*\(\D*(\d+)\s*\)\D*/.test(line)) {
    data = line.replace(/\D*\(\D*(\d+)\s*\)\D*/, '$1')
  }

  //console.log(cmd, params, data)
  //return

  console.log(
    printf(" %-24s | %-10s | %s",
      prettify(cmd, params, data),
      data ? data:'',
      line
    )
  )
})
