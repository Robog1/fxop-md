## WhatsApp Bot

<div align="center" style="display: flex; justify-content: center; gap: 10px; flex-wrap: wrap;">
  <a href="https://fx-website-one.vercel.app/">
    <img src="https://img.shields.io/badge/FX WEBSITE-000?style=for-the-badge&logo=vercel&logoColor=white" alt="FX Website"/>
  </a>
  <a href="https://github.com/FXastro/fxop-md/fork">
    <img src="https://img.shields.io/badge/FORK REPO-000?style=for-the-badge&logo=github&logoColor=white" alt="Fork Repository"/>
  </a>
  <a href="https://www.heroku.com/deploy?template=https://github.com/FXastro/fxop-md">
    <img src="https://img.shields.io/badge/Deploy on Heroku-430098?style=for-the-badge&logo=heroku&logoColor=white" alt="Deploy on Heroku"/>
  </a>
  <a href="https://app.koyeb.com/services/deploy?type=docker&image=docker.io/fxastro/fxop-md&name=fxop-md-demo">
    <img src="https://img.shields.io/badge/Deploy on Koyeb-0096D6?style=for-the-badge&logo=koyeb&logoColor=white" alt="Deploy on Koyeb"/>
  </a>
  <a href="https://render.com/deploy?repo=https://github.com/FXastro/fxop-md">
    <img src="https://img.shields.io/badge/Deploy on Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Deploy on Render"/>
  </a>
  <a href="https://railway.app/new/template?template=https://github.com/FXastro/fxop-md">
    <img src="https://img.shields.io/badge/Deploy on Railway-0B0B0B?style=for-the-badge&logo=railway&logoColor=white" alt="Deploy on Railway"/>
  </a>
  <a href="https://github.com/FXastro/fxop-md?tab=readme-ov-file#termux-installation">
    <img src="https://img.shields.io/badge/Termux Setup-00A980?style=for-the-badge&logo=android&logoColor=white" alt="Termux Installation"/>
  </a>
  <a href="https://github.com/FXastro/fxop-md/releases/">
    <img src="https://img.shields.io/badge/Panel-292E49?style=for-the-badge&logo=github&logoColor=white" alt="Panel Installation"/>
  </a>
  <a href="https://github.com/codespaces/new?repo=843557699&ref=master">
    <img src="https://img.shields.io/badge/Codespaces-181717?style=for-the-badge&logo=github&logoColor=white" alt="Deploy on Codespaces"/>
  </a>
  <a href="https://replit.com/~">
    <img src="https://img.shields.io/badge/Deploy on Replit-0E152A?style=for-the-badge&logo=replit&logoColor=white" alt="Deploy on Replit"/>
  </a>
</div>

**Overview**: A simple WhatsApp bot built with the Baileys library, easy to deploy on various platforms.

## Local Deployment

### Steps to Run the Bot Locally

1. **Generate a Session ID**: Create your `SESSION_ID` [here](https://fx-session.vercel.app/).
  
2. **Configure Environment Variables**: Create a `.env` file with the following:

   ```env
   SESSION_ID="your_generated_session_id"
   BOT_INFO="YourName;YourBotName;https://linktoyourimage.com/image.jpg"
   SUDO="your_whatsapp_number"
   HANDLER="." # Command prefix
   WELCOME_MSG="Welcome to the group!"
   GOODBYE_MSG="Goodbye, we will miss you!"
   ANTILINK="false" # Anti-link detection
   AUTO_BIO="true" # Update bot bio automatically
   AUTO_REACT="false" # Auto-reaction to messages
   AUTO_READ="false" # Auto-read messages
   AUTO_STATUS_READ="false" # Auto-read status updates
   STICKER_PACK="Astro;FXBOTTO" # Author for stickers
   LOGS="false" # Enable bot logging
   DELETED_LOG="false" # Log deleted messages
   DELETED_LOG_CHAT="false" # Log deleted chats
   TZ="Your/Timezone" # Specify timezone
   WORK_TYPE="private" # 'private' or 'public'
   RMBG_API_KEY="your_removebg_api_key" # Background removal API key
   ```

3. **Launch the Bot**: Use Node.js, Docker, or your preferred method.

---

### Support

For assistance, join our [WhatsApp support channel](https://whatsapp.com/channel/0029VambPbJ2f3ERs37HvM2J).