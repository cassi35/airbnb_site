import { v2 as cloudinary } from 'cloudinary';
import log from 'consola';
import ck from 'chalk';
cloudinary.config({
    cloud_name:process.env.CLOUNDINARY_NAME,
    api_key:process.env.CLOUNDINARY_API_KEY,
    api_secret:process.env.CLOUNDINARY_API_SECRET
})
export async function cloundinaryConnection():Promise<void>{
    try {
        log.info(`Tentando conectar ao Cloudinary: ${process.env.CLOUNDINARY_NAME}...`);
        const result = await cloudinary.api.ping()
        switch(result.status){
            case 'ok':
                log.success(`${ck.green("Cloudinary conectado com sucesso!")}`);
                break;
            case 'error':
                log.error(`${ck.red("Erro ao conectar ao Cloudinary:")}`, result.message);
                process.exit(1);
                break;
            default:
                log.warn(`${ck.yellow("Status desconhecido do Cloudinary:")}`, result.status);
                break;
        }
    } catch (error) {
        log.error(`${ck.red("Erro ao conectar ao Cloudinary:")}`, error);
        process.exit(1);
    }
}
export default cloudinary;