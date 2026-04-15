import 'dotenv/config'; 
import { createServer } from 'node:http';
import { createApplication } from './app/index';

async function main() {
    try {
        const server = createServer(createApplication());
        const PORT: number = (process.env.PORT ?? 5000) as number;

        server.listen(PORT, () => {
            console.log(`Http server is running on PORT ${PORT}`)
        })
    } catch (error) {
        console.error(`Error starting http server`);
        throw error;
    }
}

main();