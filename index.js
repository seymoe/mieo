const currentNodeVersion = process.versions.node
const semver = currentNodeVersion.split('.')
const major = semver[0]

const commander = require('commander')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const homeDir = require('osenv').home()
const templateDir = path.resolve(homeDir, '.mieo')
const mkdirp = require('mkdirp')
const pkg = require('./package.json')
const Cli = require('./cli')
const initScript = require('./scripts/init')

// 检测 Node 版本，主版本最低要求为 8
if (major < 8) {
  console.error(
    'You are running Node ' +
    currentNodeVersion +
    '.\n' +
    'Mieo requires Node 8 or higher. \n' +
    'Please update your version of Node.'
  )
  process.exit(1)
}

class Mieo extends Cli {
  constructor() {
    super()
    // 解析命令行参数
    this.program = new commander.Command()
    // 文件夹相关
    this.dir = {
      home: homeDir,
      tpl: templateDir
    }
    // 检查更新
    // this.checkCliUpdate()
    // 创建存储模版的文件夹
    this.checkTemplateDir()
    // 初始化
    this.initProgram()
  }

  initProgram() {
    // info
    this.program
      .version(pkg.version)
    // init
    this.program
      .command('init <dir>')
      .description('Init a project by choosing template.')
      .action((dir) => initScript(this, dir))

    this.program.parse(process.argv)
  }

  checkTemplateDir() {
    // 创建文件夹
    mkdirp(this.dir.tpl)
    const pkgFile = path.resolve(this.dir.tpl, 'template.json')
    if (!fs.existsSync(pkgFile)) {
      fs.writeFileSync(pkgFile, JSON.stringify({
        list: [
          {
            name: 'vue-admin-template',
            remote: 'https://github.com/PanJiaChen/vue-admin-template'
          },
          {
            name: 'vue-typescript-admin-template',
            remote: 'https://github.com/Armour/vue-typescript-admin-template'
          }
        ]
      }))
    }
  }
}

module.exports = new Mieo()