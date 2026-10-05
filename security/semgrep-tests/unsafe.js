// Scanner test fixtures only. Never executed or packaged.
// ruleid: cloudshield-no-eval
eval(userInput);
// ruleid: cloudshield-no-eval
new Function(userInput);
// ruleid: cloudshield-no-shell-exec
exec(userInput);
// ruleid: cloudshield-no-shell-exec
execSync(userInput);
// ruleid: cloudshield-no-weak-hash
createHash('md5');
// ruleid: cloudshield-no-weak-hash
createHash('sha1');
// ok: cloudshield-no-weak-hash
createHash('sha256');
