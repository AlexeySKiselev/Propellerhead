/**
 * Application logger
 */

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const formatFn = printf(info => {
    return `${info.timestamp} [${info.level.toUpperCase()}] propellerhead:${info.label}: ${info.message}`;
});


class Logger {
    constructor(label) {
        this._label = label;
        this._logger = this._initializeLogger();
    }

    static getInstance(label) {
        if(!this._instance) {
            this._instance = new Logger(label);
        }
        this._label = label;
        return this._instance;
    }

    info(message) {
        this._log('info', message);
    }

    warning(message) {
        this._log('warn', message);
    }

    error(message) {
        this._log('error', message);
    }

    debug(message) {
        this._log('debug', message);
    }

    _log(level, message) {
        this._logger.log({
            level,
            message
        });
    }

    _initializeLogger() {
        return createLogger({
            format: combine(
                label({ label: this._label }),
                timestamp(),
                formatFn
            ),
            transports: [
                new transports.File({ filename: __dirname + '/../logs/error.log', level: 'error' }),
                new transports.File({ filename: __dirname + '/../logs/logs.log' }),
                new transports.Console()
            ],
            exceptionHandlers: [
                new transports.File({ filename: __dirname + '/../logs/exceptions.log' })
            ],
            exitOnError: false
        });
    }
}

module.exports = label => Logger.getInstance(label);
