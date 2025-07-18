import { FastifyInstance } from "fastify";

class CacheService{
    private app:FastifyInstance
    private prefix:string 
    private defaultTTL: number;
    constructor(pp: FastifyInstance, prefix: string = 'cache:', defaultTTL: number = 3600){
        this.app = pp;
        this.prefix = prefix;
        this.defaultTTL = defaultTTL;
    }
     /**
   * Obtém valor do cache
   */
    async get<T>(key:string):Promise<T | null>
    {
        const fullKey = this.prefix + key;
        const value = await this.app.redis.get(fullKey);
        if(value){
            return JSON.parse(value) as T;
        }
        return null;    
    }
      /**
   * Define valor no cache
   */
  async set<T>(key:string, value:T, ttl:number = this.defaultTTL):Promise<void>{
    const fullKey = this.prefix + key;
    const stringValue = JSON.stringify(value);
    await this.app.redis.set(fullKey, stringValue, 'EX', ttl);
  }
    /**
   * Remove valor do cache
   */
  async del(key:string):Promise<number>{
    return this.app.redis.del(this.prefix + key);
  }
   /**
   * Limpa todos os valores com este prefixo
   */
  async clear():Promise<number>{
    const keys = await this.app.redis.keys(this.prefix + '*');
    if(keys.length === 0) return 0;
    const result = await this.app.redis.del(keys);
    return result;
  }
    /**
   * Cache com função de carregamento
   * Obtém do cache ou executa a função e armazena o resultado
   */
  async remember<T>(key: string, ttl: number, fn: () => Promise<T>):Promise<T>{
    const cachedValue = await this.get<T>(key);
    if(cachedValue !== null){
        return cachedValue;
    }
    const value = await fn();
    await this.set(key, value, ttl);
    return value;
  }
  async getUserFromCache(email: string): Promise<any> {
    const user = await this.get(`user:${email}`);
    if (!user) {
      throw new Error(`User with email ${email} not found in cache`);
    }
    return user;
  }
}
export default CacheService