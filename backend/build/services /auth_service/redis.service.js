"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CacheService {
    app;
    prefix;
    defaultTTL;
    constructor(pp, prefix = 'cache:', defaultTTL = 3600) {
        this.app = pp;
        this.prefix = prefix;
        this.defaultTTL = defaultTTL;
    }
    /**
  * Obtém valor do cache
  */
    async get(key) {
        const fullKey = this.prefix + key;
        const value = await this.app.redis.get(fullKey);
        if (value) {
            return JSON.parse(value);
        }
        return null;
    }
    /**
 * Define valor no cache
 */
    async set(key, value, ttl = this.defaultTTL) {
        const fullKey = this.prefix + key;
        const stringValue = JSON.stringify(value);
        await this.app.redis.set(fullKey, stringValue, 'EX', ttl);
    }
    /**
   * Remove valor do cache
   */
    async del(key) {
        return this.app.redis.del(this.prefix + key);
    }
    /**
    * Limpa todos os valores com este prefixo
    */
    async clear() {
        const keys = await this.app.redis.keys(this.prefix + '*');
        if (keys.length === 0)
            return 0;
        const result = await this.app.redis.del(keys);
        return result;
    }
    /**
   * Cache com função de carregamento
   * Obtém do cache ou executa a função e armazena o resultado
   */
    async remember(key, ttl, fn) {
        const cachedValue = await this.get(key);
        if (cachedValue !== null) {
            return cachedValue;
        }
        const value = await fn();
        await this.set(key, value, ttl);
        return value;
    }
}
exports.default = CacheService;
