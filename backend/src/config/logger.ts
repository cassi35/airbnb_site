import winston from 'winston'
const logger = winston.createLogger({
    level:'info',
    format:winston.format.combine(
        winston.format.timestamp(), // Adiciona timestamp
        winston.format.errors({ stack: true }), // Formata erros com stack trace 
        winston.format.json() // Formata a saída como JSON 
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Adiciona cores ao console
                winston.format.simple() // Formata a saída simples
            )
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true,
            zippedArchive: true
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            tailable: true,
            zippedArchive: true
        })
    ]
})
export default logger;