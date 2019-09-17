const inquirer = require('inquirer')
const execSync = require('child_process').execSync
const chalk = require('chalk')

module.exports = async function(ctx, projectName) {
  const tpls = ctx.getTemplateList(ctx.dir.tpl)
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
  ctx._log(`Starting fetch template from ${ chalk.cyan(tplObj.remote) }`)
  // 开始拉取模版
  execSync(`
    git clone ${ tplObj.remote } ${ projectName } --depth=1
    rm -rf ./${ projectName }/.git
  `)
  ctx._log()
  ctx._log(`📦  Installing ${chalk.cyan('packages')}`)
  ctx._log()
  execSync(`
    cd ${ projectName }
    npm i
  `)
  ctx._log()
  ctx._log(`Successfully installed packages`)
  ctx._log(`You can excute ${ chalk.green('cd ' + projectName) } and Happy Coding!`)
}
