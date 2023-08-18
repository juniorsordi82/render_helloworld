const fs = require('fs');
const cp = require('child_process');

const rootPath = '.';
const fileName = 'package.json'
const filePath = `${rootPath}/${fileName}`

let revision =  cp.execSync(`git -C "${rootPath}" rev-list --all --count`)
    .toString().trim();

var thisCommit = parseInt(revision) + 1;
const encoding = 'utf-8';
var text = fs.readFileSync(filePath, encoding);
var now = new Date();
var newVersion = `${now.getFullYear()} r${thisCommit}`;
const regEx = new RegExp(`(?<="version":( *)")([^"]+)`, 'm');
var newtext = text.replace(regEx, newVersion);
fs.writeFileSync(filePath, newtext, encoding);
///
let commitMsg = process.argv.splice(2);
//console.log(`git commit -m "${commitMsg}"`);
cp.execSync(`git add . && git commit -m "${commitMsg}" && git push`);