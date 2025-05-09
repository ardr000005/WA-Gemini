import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { handleUserInteraction } from '../sessions/session.service';

let shouldResendOptions = false;

export function initializeWhatsAppClient() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    takeoverOnConflict: true,
    restartOnAuthFail: true
  });

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code above to login');
  });

  client.on('ready', () => {
    console.log('WhatsApp client is ready!');
    shouldResendOptions = false; 
  });

  client.on('message', async (msg: Message) => {
    try {
      if (msg.isStatus || msg.fromMe) return;

      let response: string;
      
      try {
        response = await handleUserInteraction(msg.from, msg.body);
      } catch (error) {
        console.error('Interaction handling error:', error);
        response = 'Choose an option:\n1. Summarize text\n2. Translate text\n\nReply with 1 or 2';
        shouldResendOptions = true;
      }

      try {
        await msg.reply(response);
        shouldResendOptions = false;
      } catch (replyError) {
        console.error('Reply failed, trying simple send:', replyError);
        try {
          await client.sendMessage(msg.from, response);
          shouldResendOptions = false;
        } catch (sendError) {
          console.error('Both reply and send failed:', sendError);
          shouldResendOptions = true;
        }
      }

    } catch (error) {
      console.error('Global message handling error:', error);
      shouldResendOptions = true;
    }
  });

  client.on('disconnected', async (reason) => {
    console.log('Disconnected:', reason);
    shouldResendOptions = true;
    setTimeout(() => {
      console.log('Attempting to reconnect...');
      client.initialize().catch(err => {
        console.error('Reconnection failed:', err);
      });
    }, 5000);
  });

  const initializeWithRetry = async (attempt = 1) => {
    try {
      await client.initialize();
    } catch (error) {
      console.error(`Initialization attempt ${attempt} failed:`, error);
      if (attempt < 3) {
        setTimeout(() => initializeWithRetry(attempt + 1), 5000);
      }
    }
  };

  initializeWithRetry();

  return client;
}

setInterval(() => {
  if (shouldResendOptions) {
    console.log('System detected unresponsive state - attempting recovery...');
    shouldResendOptions = false;
  }
}, 30000); 