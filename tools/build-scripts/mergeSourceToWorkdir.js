
const fromDir = process.cwd() + '/src/content';
const toDir = process.cwd() + '/workdir/src/content';

console.log('starting watch from ' + fromDir + ' to ' + toDir);

const watcher = require('sync-directory')(fromDir, toDir, {
    watch: true,
    cb({ type, path }) {
        //console.log(type);
       //console.log(path);
    }
});