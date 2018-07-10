const log4js = require('log4js');

log4js.configure({
    appenders: {
        out: {
            type: 'stdout', layout: {
                type: 'pattern',
                pattern: '%d %p %c %x{user} %m%n',
                tokens: {
                    user: function (logEvent) {
                        return "Newgen";
                    }
                }
            }
        },
        file: {
            type: 'file',
            filename: 'logs/serviceLog.txt',
            maxLogSize: 1 * 1024 * 1024, // = 1Mb
            numBackups: 10, // keep five backup files
            compress: true, // compress the backups
            encoding: 'utf-8',
            mode: 0o0640,
            // flags: 'w+',
            pattern: '%d %p %c %x{user} %m%n',
            tokens: {
                user: function (logEvent) {
                    return "Newgen";
                }
            }
        }
    },
    categories: { default: { appenders: ['file', 'out'], level: 'info' } }
});

const logger = log4js.getLogger();
logger.info("Logger Initiated");
class ServiceLogManager {
    async Log(message) {
        logger.info(message);
    }

}

module.exports = new ServiceLogManager();



