'use strict'

const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect
chai.use(require('sinon-chai'))
const path = require('path')

const MakeNunjucks = require('../src/Commands/Nunjucks')

let makeNunjucks
let generateFileStub
let consoleStub
let existsStub

describe('Make Nunjucks view command', () => {
  beforeEach(() => {
    makeNunjucks = new MakeNunjucks()

    existsStub = sinon.stub(makeNunjucks, 'pathExists').returns(true)
    generateFileStub = sinon.stub(makeNunjucks, 'generateFile').resolves(true)

    consoleStub = sinon.stub(console, 'info')
  })

  afterEach(() => {
    generateFileStub.restore()
    consoleStub.restore()
  })

  it('Has a signature and description', () => {
    expect(MakeNunjucks.signature).to.be.a('string')
    expect(MakeNunjucks.description).to.be.a('string')
  })

  it('Generate test.html in resources/views', async () => {
    const handle = await makeNunjucks.handle({name: 'test'}, {})

    expect(handle).to.equal('resources/views/test.html')
    expect(generateFileStub).to.be.calledWith(path.join(__dirname, '../resources/views/test.html'))
    expect(consoleStub).to.be.calledWith('✔ create  resources/views/test.html')
  })

  it('Generate test.html in resources/views with a layout', async () => {
    const handle = await makeNunjucks.handle({name: 'extender'}, {layout: 'layout.html'})

    expect(handle).to.equal('resources/views/extender.html')
    expect(generateFileStub).to.be.calledWith(path.join(__dirname, '../resources/views/extender.html'))
    expect(consoleStub).to.be.calledWith('✔ create  resources/views/extender.html')
  })

  it('Handles error ', async () => {
    existsStub.restore()
    existsStub = sinon.stub(makeNunjucks, 'pathExists').returns(false)

    const errorStub = sinon.stub(makeNunjucks, 'error')

    const handle = await makeNunjucks.handle({name: 'extender'}, {layout: 'layout.html'})

    expect(handle).to.equal(undefined)
    expect(errorStub).to.be.calledWith('Make sure you are inside an Adonisjs app to run the make nunjucks command')

    errorStub.restore()
  })
})
