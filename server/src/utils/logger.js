import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(levelColors);

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports (where to log to)
const transports = [
  // Always log errors to a dedicated file
  new winston.transports.File({
    filename: path.join('logs', 'error.log'),
    level: 'error',
  }),
  // Log all levels to another file
  new winston.transports.File({
    filename: path.join('logs', 'all.log'),
  }),
];

// If not in production, also log to the console with colors
if (process.env.NODE_ENV !== 'production') {
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        logFormat
      ),
    })
  );
}

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: logFormat,
  transports,
  exitOnError: false, // Do not exit on handled exceptions
});

// Create a stream object with a 'write' function that will be used by morgan
logger.stream = {
  write: (message) => {
    logger.http(message.trim());
  },
};

// Handle uncaught exceptions
winston.exceptions.handle(
  new winston.transports.File({ filename: path.join('logs', 'exceptions.log') })
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (ex) => {
  throw ex;
});

export default logger;