'use strict'

const { Command } = require('@adonisjs/ace')
const path = require('path')

/**
 * Make a new nunjucks view
 *
 * @class MakeNunjucks
 * @constructor
 */
class MakeNunjucks extends Command {
	/**
	 * @return {String} The command signature
	 */
	static get signature () {
		return `
			make:nunjucks
			{ name: Name of the view }
			{ -l, --layout=@value: Define a layout to extend }
			`
	}

	/**
	 * @return {String} The command description
	 */
	static get description () {
		return 'Make a nunjucks view file'
	}

	/**
	 * Handle method executed by ace
	 *
	 * @param  {String} args.name       Name of the view file
	 * @param  {String} options.layout  Define a layout to extend
	 * @return {void}
	 */
	async handle ({ name }, { layout }) {
		try {
			await this.ensureInProjectRoot()
			return await this.generateBlueprint(name, layout)
		} catch ({ message }) {
			this.error(message)
		}
	}

	/**
	 * Ensures the command is executed within the
	 * project root
	 *
	 * @throws {Error} If not in app root
	 * @return {void}
	 */
	async ensureInProjectRoot () {
		const acePath = path.join(process.cwd(), 'ace')
		const exists = await this.pathExists(acePath)

		if (!exists) {
			throw new Error(`Make sure you are inside an Adonisjs app to run the make nunjucks command`)
		}
	}

	/**
	 * Generate nunjucks file
	 *
	 * @param  {String}  name     template filename
	 * @param  {String}  [layout] layout to extend in nunjucks file
	 * @return {String}           Created file path
	 */
	async generateBlueprint (name, layout) {
		const templateFile = path.join(__dirname, './nunjucks.mustache')

		const filePath = path.join(process.cwd(), 'resources/views', name.toLowerCase().replace(/view/ig, '').replace(/\./g, '/')) + '.html'
		const data = {
			layout: layout && typeof (layout) === 'string' ? layout.replace('.html', '') : null
		}

		const templateContents = await this.readFile(templateFile, 'utf-8')
		await this.generateFile(filePath, templateContents, data)

		const createdFile = filePath.replace(process.cwd(), '').replace(path.sep, '')
		console.info(`${this.icon('success')} ${this.chalk.green('create')}  ${createdFile}`)

		return createdFile
	}
}

module.exports = MakeNunjucks
