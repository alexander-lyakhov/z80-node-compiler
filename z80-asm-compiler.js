const fs = require('fs')
const printf = require('printf')
const codes  = require('./z80-asm-commands.js')

const context = fs.readFileSync('ldir.asm', 'utf8')
//const codes = fs.readFileSync('z80-asm-commands.json', 'utf8')

const isNumber = (val) => !isNaN(val)

const addrRegexp = /\baddr\b/
const offsetRegexp = /(\boffset\b)|(\bd\b)/ // searching for 'offset' or 'd'

//==============================================================
// Compose prettied string and fullfild path array
//==============================================================
function prettify(cmd, params, data, path) {

  if (!cmd && !params.length) {
    return ''
  }

  let tail = params.map(el => {

    if (isNumber(el)) {
      return el
    }

    //-----------------------------------------------------
    // replace expression '(addr)' with address value
    //-----------------------------------------------------
    if (addrRegexp.test(el)) {
      path.push('(addr)')
      return el.replace(addrRegexp, ` ${data} `)
    }

    //-----------------------------------------------------
    // for expressions like 'ld a, (23606)'
    //-----------------------------------------------------
    if (/\((\d+)\)/.test(el)) {
      path.push('(addr)')
      return `( ${data} )`
    }

    //-----------------------------------------------------
    // for expressions like 'ld (ix + offset), a'
    //-----------------------------------------------------
    if (/\(ix\+(\d+)\)/.test(el)) {
      path.push('(ix+n)')
      return `(ix + ${data})`
    }

    //-----------------------------------------------------
    // for expressions like 'ld (iy + offset), a'
    //-----------------------------------------------------
    if (/\(iy\+(\d+)\)/.test(el)) {
      path.push('(iy+n)')
      return `(iy + ${data})`
    }

    path.push(el)

    return el
  })
  .join(', ')

  /*
  if (params.length === 1 && data) {
    tail = tail + `, ${data}`
  }
  */

  return `${cmd} ${tail}`//.toUpperCase()
}

function split88(xx = 0) {
  const h = parseInt(xx / 256)
  const l = xx - h * 256
  return [l, h]
}

function getCmdCode(path, data) {

  if (!path[0]) return []

  const initPath = [...path]

  for (let node = codes; node;) {

    let key = path.shift()

    if (!node[key]) {
      throw new Error(`ERROR: --> ${key} <-- not found`)
    }

    if (Array.isArray(node[key])) {
      const length = node[key][1]

      if (!length) {
        throw new Error(`ERROR: --> ${JSON.stringify(initPath)} command length is not defined`)
      }

      return [
         ...node[key][0], // command codes
         ...split88(data) // low and high bites representation
      ]
      .splice(0, node[key][1] || 0)
    }

    if (typeof(node[key]) === 'object') {
      node = node[key]
    }
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
  const path = []
  const last = params[params.length - 1]
  let data = null

  //-----------------------------------------------------------------
  // Needed for expressions like this: 'ld a, (addr), 23606'
  // Cut last parameter if it is a number and remove it from params
  //-----------------------------------------------------------------
  /*
  if (isNumber(last)) {
    data = params.pop()
  }
  */

  //-----------------------------------------------------------------
  // Cut last parameter if it is a number
  // But don't remove it from params array
  //-----------------------------------------------------------------
  if (/\D*\s*(-?\d+)\D*/.test(line)) {
    data = line.replace(/\D*\s*(-?\d+)\D*/, '$1')
  }

  if (/addr/.test(line) && isNumber(last)) {
    params.pop()
  }

  //-----------------------------------------------------------------
  // Needed for expressions like 'ld (23606), a' or 'ld (ix + 5), a'
  //-----------------------------------------------------------------
  //if (/\D*\(\D*(\d+)\s*\)\D*/.test(line)) {
  //  data = line.replace(/\D*\(\D*(\d+)\s*\)\D*/, '$1')
  //}

  //console.log(cmd, params, data)
  //prettify(cmd, params, data, path),
  //console.log(getCmdCode([cmd, ...path]))
  //return

  const pretty = prettify(cmd, params, data, path)

  const str = getCmdCode([cmd, ...path], data).reduce((s, val) => s + printf("%4s ", val), '')

  console.log(
    printf(" %-24s | %-10s | %-10s | %-10s | %-20s | %s",
      pretty,
      data ? data:'',
      path.join(','),
      params.join(','),
      //getCmdCode([cmd, ...path]).join(', '),
      str,
      line,
    )
  )
})
