const execSync = require('child_process').execSync
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const figlet = require('figlet')
const pkg = require('./package.json')
const config = require('./config.json')

class Cli {
  constructor() {
    this.cliConfig = config
  }
  // 检查版本，如果过低则提示更新
  checkCliUpdate() {
    try {
      const name = pkg.name
      const version = `"${pkg.version}"`
      const ltsVersion = execSync(`npm view ${name} version --json`) + ''
      if (version !== ltsVersion.trim()) {
        this._log(`⚠️ The cli version is to old, we recommend execute ${chalk.red(`npm i -g ${name}@latest`)} to upgrade cli： ${version} -> ${ltsVersion}`)
        process.exit(0)
      }
    } catch (err) {
      this._log('Check Upgrading failed.')
      process.exit(0)
    }
  }

  // 获取模版列表
  getTemplateList() {
    return this.cliConfig.list || []
  }

  // 命令行输出
  _log() {
    console.log.apply(null, arguments)
  }

  // 打印欢迎语
  welcome() {
    this._log(
      chalk.white(`${figlet.textSync(`MIEO`)}\n 🐱 Welcome to be here.`)
    )
  }
}

module.exports = Cli