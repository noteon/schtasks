'use strict'

const sudo = require('sudo-prompt')
const util = require('util')
const parseXml = require('xml2js').parseString

const mapping = {
  schedule: '/SC',
  modifier: '/MO',
  days: '/D',
  months: '/M',
  idletime: '/I',
  taskname: '/TN',
  taskrun: '/TR',
  starttime: '/ST',
  interval: '/RI',
  endtime: '/ET',
  duration: '/DU',
  startdate: '/SD',
  enddate: '/ED',
  level: '/RL',
  enable: '/ENABLE',
  disable: '/DISABLE'
}

function mapFields (cmd) {
  return Object.keys(cmd).reduce((mapped, key) => {
    let opt = mapping[key]

    if (opt) {
      let val = cmd[key]

      if (val instanceof Array)
        val = val.join(',')

      mapped.push(val ? `${opt} ${val}` : opt)
    }

    return mapped
  }, [])
}

function exec () {
  const sudo_exec = util.promisify(sudo.exec)

  return sudo_exec(...arguments)
}

exports.create = function (task, cmd) {
  cmd['taskname'] = `"${task}"`

  let fields = mapFields(cmd)

  fields.unshift(...[
    'schtasks',
    '/Create' 
  ])

  fields.push(...[
    '/RU SYSTEM',
    '/F'  
  ])

  return exec(fields.join(' '), { name: task })
}

exports.get = async function (task) {
  let fields = mapFields({ taskname: `"${task}"` })

  fields.unshift(...[
    'schtasks',
    '/Query'  
  ])

  fields.push('/XML')

  const xml = await exec(fields.join(' '), { name: task })

  const parser = util.promisify(parseXml)

  return parser(xml, {
    trim: true,
    normalize: true,
    explicitRoot: false,
    explicitArray: false,
    ignoreAttrs: true,
    preserveChildrenOrder: true
  })
}

exports.destroy = function (task) {
  let fields = mapFields({ taskname: `"${task}"` })

  fields.unshift(...[
    'schtasks',
    '/Delete' 
  ])

  fields.push('/F')

  return exec(fields.join(' '), { name: task })
}

exports.run = function (task) {
  let fields = mapFields({ taskname: `"${task}"` })

  fields.unshift(...[
    'schtasks',
    '/Run'  
  ])

  return exec(fields.join(' '), { name: task })
}

exports.stop = function (task) {
  let fields = mapFields({ taskname: `"${task}"` })

  fields.unshift(...[
    'schtasks',
    '/End'  
  ])

  return exec(fields.join(' '), { name: task })
}

exports.update = function (task, cmd) {
  cmd['taskname'] = `"${task}"`

  let fields = mapFields(cmd)

  fields.unshift(...[
    'schtasks',
    '/Change' 
  ])

  fields.push('/RU SYSTEM')

  return exec(fields.join(' '), { name: task })
}