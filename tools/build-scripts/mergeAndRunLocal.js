
var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
const { spawn } = require('child_process');
const readline = require('readline');

let mergePackages = require("@userfrosting/merge-package-dependencies");
let template = require('./package.json');



// move the base package
console.log('moving the base package');

console.log( execSync("rm -rf workdir && mkdir workdir && cp -r ./node_modules/react-base/. workdir").toString() );



// do the merge of the package.json
console.log('Starting merge process');

let pkgPaths = [
    "./node_modules/react-base/"
];

console.log( execSync("rm -rf workdir/package.json").toString() );
let result = mergePackages.yarn(template, pkgPaths, "./workdir/");



// install the dependencies
console.log('running yarn install');

console.log( execSync("cd ./workdir && yarn install").toString() );



// move our source code to the working directory
console.log('Starting sync');

console.log( execSync("rm -rf workdir/src/content").toString() );
console.log( execSync("rm -rf workdir/src/includes").toString() );

console.log( execSync("rm -rf workdir/.tmp").toString() );
console.log( execSync("mkdir -p workdir/.tmp").toString() );

console.log( execSync("cp -r src/includes workdir/src/includes 2>/dev/null || :").toString() );









const sync = spawn('yarn', ['node', 'mergeSourceToWorkdir.js']);

sync.stdout.on('data', (data) => {
  console.log(`${data}`);
});

sync.stderr.on('data', (data) => {
  console.log(`${data}`);
});

sync.on('close', (code) => {
  console.log(`sync process exited with code ${code}`);
});


const revSync = spawn('yarn', ['node', 'mergeWorkdirToSource.js']);

revSync.stdout.on('data', (data) => {
  console.log(`${data}`);
});

revSync.stderr.on('data', (data) => {
  console.log(`${data}`);
});

revSync.on('close', (code) => {
  console.log(`sync process exited with code ${code}`);
});



//we pause for a bit to make sure the sync is done
console.log('sleeping to wait for sync to be done!');
console.log( execSync("sleep 10").toString() );
console.log('woke up!');

//we used to use syncing but that does not work properly because we can't get feedback changes (linting) so we try symlinks instead
//var lnCommand = 'ln -s ' + process.cwd() + '/src/content' + ' ' + process.cwd() + '/workdir/src/content';
//console.log( execSync(lnCommand).toString() );



// run the build
console.log('Running build command');


const build = spawn('yarn', ['build:local'], {
  cwd: process.cwd()+'/workdir'
});

build.stdout.on('data', (data) => {
  console.log(`${data}`);
});

build.stderr.on('data', (data) => {
  console.log(`${data}`);
});

build.on('close', (code) => {
  console.log(`The build process exited with ${code}`);

  if(code === 0 || code === '0') {




      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // run the start command
      console.log('Running start command');

      const start = spawn('yarn', ['start:local'], {
        cwd: process.cwd()+'/workdir'
      });

      start.stdout.on('data', (data) => {
        console.log(`${data}`);
      });

      start.stderr.on('data', (data) => {
        console.log(`${data}`);
      });

      start.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
      });

      rl.on('line', (input) => {
        console.log(`Received: ${input} - passing to nodemon`);

        start.stdin.write(input);
      });



  }
});

