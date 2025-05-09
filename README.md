# 🤖 WhatsApp AI Assistant with Gemini 

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXh2Y3BqZzV4b2Z0dGx5ZzN0Z3RqZzBicnV6dWZ1eTJ6eHp0eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7qE1YN7aBOFPRw8E/giphy.gif" width="300" alt="AI Assistant Demo">
  <p>Your personal AI assistant right in WhatsApp!</p>
</div>

## 🌟 Why You'll Love This Bot

✨ **Smart Text Summaries** - Get key points from long articles in seconds  
✨ **Instant Translations** - Between 100+ languages with natural phrasing  
✨ **Never Gets Confused** - Remembers your conversation context  
✨ **Always Available** - Automatically reconnects if interrupted  
✨ **Private & Secure** - No message history stored

## 🛠️ Tech Stack

<div align="center">

| Component              | Technology Used |
|------------------------|----------------|
| **Core Framework**     | Node.js + TypeScript |
| **WhatsApp Connection**| whatsapp-web.js |
| **AI Engine**          | Google Gemini API |
| **Authentication**     | QR Code Terminal |
| **Error Handling**     | Custom Recovery System |

</div>

## 🚀 Getting Started in 3 Steps

### 1. Prerequisites
- Node.js v16 or newer
- A WhatsApp account (test number recommended)
- [Google Gemini API key](https://ai.google.dev/) (free tier available)

### 2. Installation
```bash

# Clone the repository
git clone https://github.com/ardr000005/WA-Gemini.git

# Install dependencies
npm install

# Set up your environment
cp .env.example .env
Then edit the .env file to add your Gemini API key:

env
GEMINI_API_KEY=your_actual_key_here

3. Running the Bot

bash
npx tsx src/main.ts

📱 Scan the QR code that appears using WhatsApp:
WhatsApp → Settings → Linked Devices → Link a Device

Your whatsapp will act as a bot

Send a message from another number

```

<div align="center" style="border-radius: 15px; border: 2px solid #6e48aa; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #e4f0ff 100%); margin: 25px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">

  <h2 style="color: #4a2c82;">💬 Chat with Your AI Assistant</h2>
  
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px; margin: 25px 0;">
    '''
    <!-- Summarization Card -->
    <div style="flex: 1; min-width: 250px; background: white; border-radius: 12px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h3 style="color: #6e48aa;">📝 Summarization Flow</h3>
      <div style="background: #f8f9fa; border-left: 4px solid #6e48aa; padding: 10px; margin: 10px 0; font-family: monospace;">
        <p>You: Hi</p>
        <p>Bot: [Sends menu]</p>
        <p>You: 1</p>
        <p>Bot: Paste text to summarize:</p>
        <p>You: [Long article]</p>
        <p>Bot: <em>Concise summary...</em></p>
      </div>
    </div>
    '''
    <!-- Translation Card -->
    <div style="flex: 1; min-width: 250px; background: white; border-radius: 12px; padding: 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <h3 style="color: #6e48aa;">🌍 Translation Flow</h3>
      <div style="background: #f8f9fa; border-left: 4px solid #6e48aa; padding: 10px; margin: 10px 0; font-family: monospace;">
        <p>You: Hello</p>
        <p>Bot: [Sends menu]</p>
        <p>You: 2</p>
        <p>Bot: Target language?</p>
        <p>You: French</p>
        <p>Bot: <em>Bonjour!</em></p>
      </div>
    </div>
    
  </div>

  <!-- Reliability Badges -->
  <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; margin-top: 20px;">
    <span style="background: #e8f5e9; color: #388e3c; padding: 5px 10px; border-radius: 20px; font-size: 0.8em;">🤖 Auto-Reconnect</span>
  </div>

</div>



```
📂 Project Structure
src/
├── ai/               # Gemini AI service
│   ├── gemini.service.ts
│   └── index.ts
├── sessions/         # Conversation logic
│   ├── session.service.ts
│   └── index.ts
├── whatsapp/         # WhatsApp client
│   ├── whatsapp.client.ts
│   └── index.ts
└── main.ts           # Entry point
└── types.ts     

```
🚨 Troubleshooting

Issue	Solution
QR code not scanning	Refresh phone internet, ensure camera works

"API quota exceeded"	Check Google Cloud quotas

Bot stops responding	Restart the bot - it maintains conversation state

Messages not delivering	Verify internet connection, check error logs

📜 License
MIT License - Free to use, modify, and distribute!
