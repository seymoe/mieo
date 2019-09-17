const execSync = require('child_process').execSync
const chalk = require('chalk')
const figlet = require('figlet')
const pkg = require('./package.json')

class Cli {
  // 检查版本，如果过低则提示更新
  checkCliUpdate() {
    try {
      // const name = pkg.name
      // const version = pkg.version
      // const ltsVersion = execSync(`npm view ${name} version`) + ''
      // if (version === version) {
      //   this._log(`⚠️ The cli version is to old, we recommend execute\n${chalk.red(`npm i -g ${name}@latest`)}\nto upgrade cli： ${version} -> ${ltsVersion}`)
      // }
    } catch (err) {
      this._log('Check Upgrading failed.')
    }
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