'use strict'

const chai = require('chai')
const path = require('path')
const expect = chai.expect

const View = require('../src/View')
const { Helpers, Config } = require('@adonisjs/sink')

describe('View Class', () => {
  it('View has nunjucks rendering engine', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.engine.name).to.equal('Nunjucks')
  })

  it('Add a global value', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.globals.myValue).to.equal(undefined)

    view.global('myValue', 'a-string')

    expect(view.globals.myValue).to.equal('a-string')
  })

  it('Return a new template', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.new()).to.be.an('object')
    expect(view.new().engine).to.equal(view.engine)
  })

  it('Options set in config are sent to nunjucks', () => {
    const config = new Config()

    config.set('nunjucks.pretty', true)
    config.set('nunjucks.cache', 1)
    config.set('nunjucks.doctype', 'strict')
    config.set('nunjucks.filters', {myFilter: text => text.toUpperCase()})
    config.set('nunjucks.self', 'yes')
    config.set('nunjucks.debug', true)

    const view = new View(new Helpers(path.join(__dirname, './')), config)

    expect(view.options.pretty).to.equal(true)
    expect(view.options.cache).to.equal(true)
    expect(view.options.doctype).to.equal('strict')
    expect(view.options.filters.myFilter).to.be.a('function')
    expect(view.options.self).to.equal(true)
    expect(view.options.debug).to.equal(true)
  })

  it('Share method adds to locals and returns template instance', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())
    const template = view.share({myKey: 'some-string'})

    expect(template.locals).to.be.an('object')
    expect(template.locals.myKey).to.equal('some-string')
  })

  it('Render a string of nunjucks', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.renderString('a(title="my-link") link')).to.equal('<a title="my-link">link</a>')
  })

  it('Render a nunjucks template', () => {
    const view = new View(new Helpers(path.join(__dirname, './')), new Config())

    expect(view.render('basic')).to.equal('<a title="my-link">link</a>')
  })
})
