const { exec } = require('child_process');
const fs = require('fs');

console.log('Starting build diagnostics...');
fs.writeFileSync('build_debug_start.txt', 'Script started');

exec('npm run build', (error, stdout, stderr) => {
    const log = `
    EXIT CODE: ${error ? error.code : 0}
    ERROR: ${error ? error.message : 'None'}
    STDOUT:
    ${stdout}
    STDERR:
    ${stderr}
    `;

    fs.writeFileSync('build_debug.log', log);
    console.log('Build finished. Log written to build_debug.log');
});
