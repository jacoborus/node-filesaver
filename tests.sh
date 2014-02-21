#! /bin/bash
# script to compile client coffeescript files


echo 'Creating folders and files for testing...'
rm -rf ./testfiles
mkdir testfiles
cd testfiles
touch uno
touch dos
cd ..

echo 'Compiling coffee tests...'
node ./node_modules/coffee-script/bin/coffee -c ./test/*.coffee
echo 'Run tests'
node ./node_modules/mocha/bin/mocha
echo 'Removing files'
rm ./test/*.js
rm ./testfiles -rf
rm ./uploads -rf
