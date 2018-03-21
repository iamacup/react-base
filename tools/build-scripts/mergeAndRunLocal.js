const execSync = require('child_process').execSync;
const exec = require('child_process').exec;
const { spawn } = require('child_process');
const readline = require('readline');

const mergePackages = require('@userfrosting/merge-package-dependencies');
const template = require('./package.json');

// move the base package
console.log('moving the base package');

console.log(
  execSync(
    'rm -rf workdir && mkdir workdir && cp -r ./node_modules/react-base/. workdir'
  ).toString()
);

// do the merge of the package.json
console.log('Starting merge process');

const pkgPaths = ['./node_modules/react-base/'];

console.log(execSync('rm -rf workdir/package.json').toString());
const result = mergePackages.yarn(template, pkgPaths, './workdir/');

// install the dependencies
console.log('running yarn install');

console.log(execSync('cd ./workdir && yarn install').toString());

// move our source code to the working directory
console.log('Starting sync');

console.log(execSync('rm -rf workdir/src/content').toString());
console.log(execSync('rm -rf workdir/src/includes').toString());

console.log(
  execSync(
    'cp -r src/includes workdir/src/includes 2>/dev/null || :'
  ).toString()
);

// we execute this syncronously
// exec("yarn sync-files --watch src/content workdir/src/content");

const sync = spawn('yarn', [
  'sync-files',
  '--watch',
  'src/content',
  'workdir/src/content'
]);

sync.stdout.on('data', data => {
  console.log(`${data}`);
});

sync.stderr.on('data', data => {
  console.log(`${data}`);
});

sync.on('close', code => {
  console.log(`sync process exited with code ${code}`);
});

// we pause for a bit to make sure the sync is done
console.log('sleeping!');
console.log(execSync('sleep 15').toString());
console.log('woke up!');

// run the build
console.log('Running build command');

const build = spawn('yarn', ['build:local'], {
  cwd: process.cwd() + '/workdir'
});

build.stdout.on('data', data => {
  console.log(`${data}`);
});

build.stderr.on('data', data => {
  console.log(`${data}`);
});

build.on('close', code => {
  console.log(`The build process exited with ${code}`);

  if (code === 0 || code === '0') {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // run the start command
    console.log('Running start command');

    const start = spawn('yarn', ['start:local'], {
      cwd: process.cwd() + '/workdir'
    });

    start.stdout.on('data', data => {
      console.log(`${data}`);
    });

    start.stderr.on('data', data => {
      console.log(`${data}`);
    });

    start.on('close', code => {
      console.log(`child process exited with code ${code}`);
    });

    rl.on('line', input => {
      console.log(`Received: ${input} - passing to nodemon`);

      start.stdin.write(input);
    });
  }
});
