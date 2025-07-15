import Stripe from 'stripe';
import log from 'consola';
import ck from 'chalk';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
export async function stripeConnection():Promise<void> {
    try {
        log.info(`Tentando conectar ao Stripe...`);
        
        const account = await stripe.accounts.retrieve();
        if (account.id) {
            log.info(`Conta Stripe encontrada: ${ck.green(account.id)}`);
            
            log.success(`${ck.green("Stripe conectado com sucesso!")}`);
        } else {
            log.error(`${ck.red("Erro ao conectar ao Stripe:")}`, "Conta não encontrada");
            process.exit(1);
        }
    } catch (error) {
        log.error(`${ck.red("Erro ao conectar ao Stripe:")}`, error);
        process.exit(1);
    }
}
export default stripe;