const fs = require("fs");
const path = require("path");
const DateService = require("../service/DateService");

const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

function log(fileName, message) {
    const timestamp = DateService.getLoggerTimestamp();
    const logMessage = `[${timestamp}] [${fileName}] ${message}\n`;

    const logFile = path.join(logDir, `${new Date().toISOString().slice(0, 10)}.log`);

    fs.appendFile(logFile, logMessage, (err) => {
        if (err) console.error("Error writing log:", err);
    });
}

global.log = log;
