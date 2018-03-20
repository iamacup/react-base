
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
const { spawn } = require('child_process');
const readline = require('readline');

let mergePackages = require("@userfrosting/merge-package-dependencies");
let template = require('./package.json');



// move the base package
console.log('moving the base package');

console.log( execSync("rm -rf workdir && mkdir workdir && cp -r ./node_modules/react-base/ workdir").toString() );



// do the merge of the package.json
console.log('Starting merge process');

let pkgPaths = [
    "./node_modules/react-base/"
];

console.log( execSync("rm -rf workdir/package.json").toString() );
let result = mergePackages.yarn(template, pkgPaths, "./workdir/");



// install the dependencies
console.log('running yarn install');

console.log( execSync("pushd ./workdir && yarn install").toString() );



// move our source code to the working directory
console.log('Starting sync');

console.log( execSync("rm -rf workdir/src/content").toString() );
// we execute this syncronously
//exec("yarn sync-files --watch src/content workdir/src/content");

console.log( execSync("cp -r src/content workdir/src/content").toString() );

console.log('done!');