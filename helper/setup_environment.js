var cp = require('cp');
var path = require('path');

cp(path.join(__dirname, '..', '.env.local'), path.join(__dirname, '..', '.env'), function (err) {
    // done. it tried fs.rename first, and then falls back to
    // piping the source file to the dest file and then unlinking
    // the source file.
});