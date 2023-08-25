var shell = require("shelljs");
var fs = require("fs");
var path = require("path");

const contractsDir = path.resolve("./build/contracts/");
const abiDir = '../react-app/abi/';
const bytecodeDir = '../react-app/bytecode/';
const addressesDir = '../react-app/addresses/';

shell.mkdir('-p', abiDir);
shell.mkdir('-p', bytecodeDir);
shell.mkdir('-p', addressesDir);

shell.ls(path.join(contractsDir, '*.json')).forEach(function (file) {
    var baseName = path.basename(file);
    let fileOutput = fs.readFileSync(file).toString();
    fileOutput = JSON.parse(fileOutput);
    let abiPath = abiDir + baseName;
    let bytecodePath = bytecodeDir + baseName;
    let addressesPath = addressesDir + baseName;
    fs.writeFileSync(abiPath, JSON.stringify(fileOutput.abi))
    fs.writeFileSync(bytecodePath, JSON.stringify(fileOutput.bytecode))
    fs.writeFileSync(addressesPath, JSON.stringify(fileOutput.networks))
});