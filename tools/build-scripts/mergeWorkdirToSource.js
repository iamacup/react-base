
// we care about
//   src/content - the place where people make changes
//   workdir/src/content - the place where the linter makes changes
// both being in sync

// this script listens for changes in workdir/src/content and copies them to a dummy directory /.content

// it then uses the callback provided by sync-directory to compare any changes files in /workdir/src/content to the same file in src/content
// if the files are different, it copies the file accross to src/content (as we assume the change was because the linter did something)

var exec = require('child_process').exec;
var crypto = require('crypto');
var fs = require('fs');

const fromDir = process.cwd() + '/workdir/src/content';
const toDir = process.cwd() + '/workdir/.tmp';

console.log('starting watch from ' + fromDir + ' to ' + toDir);

const watcher = require('sync-directory')(fromDir, toDir, {
    watch: true,
    cb({ type, path }) {

    	//SETUP SOME VARIABLES
    	const destinationPath = path.replace(process.cwd()+'/workdir/src/content/', '');

       	const changedFile = path;
       	const checkAgainstFile = process.cwd() + '/src/content/' + destinationPath;

        const cmd = "cp " + path + ' ' + checkAgainstFile;


		//CALCULATE THE MD5 OF THE FIRST THING        
		var md5sum = crypto.createHash('md5');

		var s = fs.ReadStream(changedFile);
		s.on('data', function(d) {
		  md5sum.update(d);
		});

		s.on('end', function() {
		    var d = md5sum.digest('hex');

		  	//CALCULATE THE MD5 OF THE SECOND THING
		  	var md5sum2 = crypto.createHash('md5');

			var s2 = fs.ReadStream(checkAgainstFile);
			s2.on('data', function(d2) {
			  md5sum2.update(d2);
			});

			s2.on('end', function() {
			    var d2 = md5sum2.digest('hex');
			  
			    //IF THEY ARE NOT THE SAME - DO A COPY OPERATION
			    if(d !== d2) {
			  	    //console.log('there was a change made in the destination that was not made in the source');
			  	    //console.log('executing', cmd);
			  	    exec(cmd);
			    }
			});
		});
    }
});




