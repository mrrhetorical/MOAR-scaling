"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveToFile = void 0;
const saveToFile = (data, filePath) => {
    var fs = require("fs");
    let dir = __dirname;
    let dirArray = dir.split("\\");
    const directory = `${dirArray[dirArray.length - 4]}/${dirArray[dirArray.length - 3]}/${dirArray[dirArray.length - 2]}/`;
    fs.writeFile(directory + filePath, JSON.stringify(data, null, 4), function (err) {
        if (err)
            throw err;
    });
};
exports.saveToFile = saveToFile;
//# sourceMappingURL=utils.js.map