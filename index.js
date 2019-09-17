const commander = require('commander')
const path = require('path')
const chalk = require('chalk')
const homeDir = require('osenv').home()
const templateDir = path.resolve(homeDir, '.mieo')
const mkdirp = require('mkdirp')
const pkg = require('./package.json')
const Cli = require('./cli')
const initScript = require('./scripts/init')

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
    this.checkCliUpdate()
    // 初始化
    this.initProgram()
  }

  initProgram() {
    // info
    this.program
      .version(pkg.version)
    // init
    this.program
      .command('init')
      .description('Init a project by choosing template.')
      .action(initScript)

    this.program.parse(process.argv)
  }

  checkTemplateDir() {

  }
}

module.exports = new Mieo()