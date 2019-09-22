// 用户选择的交互命令
const inquirer = require('inquirer')
// 同步执行命令
const execSync = require('child_process').execSync
const chalk = require('chalk')
const fs = require('fs')

module.exports = async function(ctx, projectName) {
  try {
    const tpls = ctx.getTemplateList()
    const { tpl } = await inquirer.prompt([
      {
        type: 'list',
        name: 'tpl',
        message: 'Please choose a template',
        choices: tpls
      }
    ])
    const tplObj = tpls.find((t) => t.name === tpl)
  
    ctx._log(`You choosed template ${ chalk.green(`${ tpl }`) }`)
    ctx._log()
  
    const localTplPath = `${ ctx.dir.tpl }/${ tpl }`
  
    if (fs.existsSync(localTplPath)) {
      // 本地存在，检查版本，如果有更新，更新模版
      const ltsVersion = execSync(`npm view ${tpl} version --json`) + ''
      const localVersion = `"${require(`${ localTplPath }/package.json`).version}"`
      if (localVersion !== ltsVersion.trim()) {
        ctx._log(`This template need update to latest`)
        // 进行更新
        execSync(`
          git clone ${ tplObj.remote } ${ projectName } --depth=1
          rm -rf ./${ projectName }/.git
          rm -rf ${ localTplPath }
          cp -rf ./${ projectName } ${ localTplPath }
        `)
      } else {
        ctx._log(`Copy from the catch`)
        execSync(`
          cp -rf ${ localTplPath } ./${ projectName }
        `)
      }
    } else {
      // 本地不存在，开始拉取模版，并同步更新本地缓存的模版
      ctx._log(`Starting fetch template from ${ chalk.cyan(tplObj.remote) }`)
      execSync(`
        git clone ${ tplObj.remote } ${ projectName } --depth=1
        rm -rf ./${ projectName }/.git
        cp -rf ./${ projectName } ${ localTplPath }
      `)
    }
  
    // 开始安装依赖
    ctx._log()
    ctx._log(`📦  Installing ${chalk.cyan('packages')}`)
    ctx._log()

    execSync(`
        cd ${ projectName }
        npm i
      `)
    ctx._log()
    ctx._log(`Successfully installed packages`)
    ctx._log(`We suggest that you begin by typing: \n\n\t${ chalk.green('cd ') + projectName}`)
    ctx._log()
    ctx._log('Happy Coding!')
  } catch (err) {
    process.exit(0)
  }
}
