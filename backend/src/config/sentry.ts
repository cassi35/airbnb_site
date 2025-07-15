import * as Sentry from '@sentry/node'
//
import log from 'consola'
export function initSentry():Promise<void>{
    try {
        Sentry.init({
        dsn: process.env.SENTRY_DSN || '', // Use o DSN do Sentry do arquivo .env
        tracesSampleRate: 1.0, // Ajuste conforme necessário
        environment: process.env.NODE_ENV || 'development', // Defina o ambiente,
    })
        log.info('Sentry initialized successfully');
        return Promise.resolve();
    } catch (error) {
        log.error('Erro ao inicializar o Sentry:', error);
        throw error; // Re-throw the error to ensure the application doesn't start if Sentry
    }
  
}