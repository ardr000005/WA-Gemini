import { initializeWhatsAppClient } from './whatsapp/whatsapp.client';

async function main() {
  try {
    const client = initializeWhatsAppClient();
    
    process.on('SIGINT', async () => {
      console.log('Shutting down...');
      await client.destroy();
      process.exit();
    });
  } catch (error) {
    console.error('Application failed to start:', error);
    process.exit(1);
  }
}

main();