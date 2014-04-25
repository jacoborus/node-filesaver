#! /bin/bash
# script to compile client coffeescript files


echo 'Creating folders and files for testing...'
rm -rf ./testfiles
mkdir testfiles
cd testfiles
touch uno
touch dos
cd ..

echo 'Run tests'
node ./node_modules/mocha/bin/mocha
echo 'Removing files'

rm ./testfiles -rf
rm ./uploads -rf
