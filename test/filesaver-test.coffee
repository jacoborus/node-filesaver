
expect = require('chai').expect
Filesaver = require '../src/filesaver'
fs = require 'fs'

deleteFolderRecursive = (path) ->
	if fs.existsSync path
		fs.readdirSync(path).forEach (file,index) ->
			curPath = path + "/" + file
			if fs.statSync(curPath).isDirectory()
				deleteFolderRecursive curPath
			else
				fs.unlinkSync curPath
		fs.rmdirSync path


folders = {books : './uploads/books',	images : './uploads/img'}

filesaver = new Filesaver folders


describe 'Filesaver constructor', ->

	it 'return an object with 3 methods and a public property', ->
		expect( filesaver ).to.be.a 'object'
		expect( filesaver.folders ).to.be.a 'object'
		expect( filesaver.add ).to.be.a 'function'
		expect( filesaver.swap ).to.be.a 'function'
		expect( filesaver.replace ).to.be.a 'function'
	
	it 'Filesaver constructor create folders if necesary', ->
		expect( fs.existsSync( './uploads/books' )).to.equal true

describe 'filesaver#addFolder', ->

	filesaver.addFolder 'things', './uploads/things'

	it 'add a new folder to filesaver.folders', ->
		expect( filesaver.folders.things ).to.equal './uploads/things'
	it 'create folder if necessary', ->
		expect( fs.existsSync( './uploads/things' )).to.equal true



describe 'filesaver#replace', ->

	it 'saves a file at target argument', (done) ->
		filesaver.replace 'books', './LICENSE', 'license', ->
			expect( fs.existsSync('./uploads/books/license') ).to.equal true
			done()
	
	it 'if target is ommited: saves file with same name as origin file', (done) ->
		filesaver.replace 'books', './README.md', ->
			expect( fs.existsSync('./uploads/books/README.md') ).to.equal true
			done()
			deleteFolderRecursive './uploads'


describe 'filesaver#swap', ->

	it 'remove the target file', (done) ->
		filesaver.swap 'books', './README.md', 'license', ->
			expect( fs.existsSync( './uploads/books/license' )).to.equal false
			done()

describe 'filesaver#add', ->
