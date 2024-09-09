const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: {
        service: 'user-service'
    },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
        }),
        new transports.File({ filename: 'combined.log', level: 'info' }),
        new transports.File({ filename: 'error.log', level: 'error' }),
    ],
});
if (process.env.NODE_ENV === 'production') {
    logger.add(new transports.File({ filename: 'logs/app.log' }));
}

module.exports = logger;
