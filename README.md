# 💡 TrivAI: Bring fun back to AI

## [Play now!](https://cf_ai_triviamachine.sithpri.workers.dev)

<a href="https://deploy.workers.cloudflare.com/?url=https://github.com/sithsiri/cf_ai_triviamachine"><img src="https://deploy.workers.cloudflare.com/button" alt="Deploy to Cloudflare"/></a>

An AI-powered chat agent that builds fun and interesting trivia for you, built for Cloudflare's Agent platform, powered by and based on [`agents`](https://www.npmjs.com/package/agents).

## Features

- ⚡️ Immediate, interactive trivia games and results
- 💬 Interactive chat interface with AI
- 🔄 State management and chat history
- 🎨 Modern, responsive UI
- 🧠 Intelligent responses powered by GPT-5-nano
x
## Prerequisites

- Cloudflare account
- OpenAI API key. You can't have mine >:(

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Set up your environment:

Create a `.dev.vars` file:

```env
OPENAI_API_KEY=your_openai_api_key
```

3. Run locally:

```bash
npm start
```

4. Deploy:

```bash
npm run deploy
```

## Project Structure

```
├── src/
│   ├── app.tsx        # Chat UI implementation
│   ├── server.ts      # Chat agent logic
│   ├── tools.ts       # Tool definitions
│   ├── utils.ts       # Helper functions
│   └── styles.css     # UI styling
```

## Example Use Cases

1. **Play**
   - Maybe I am just a nerd
   - Which of your friends are actually smarter than you?

2. **Study**
   - Easily get an overview of general topics
   - Add your course content to get customized questions
   - Discuss your strengths and narrow down your weaknesses

3. **Teach**
   - Build educational content for in-class, memorable, and interactive experiences

Get started [now!](https://cf_ai_triviamachine.sithpri.workers.dev) (Availability subject to token limits. Feel free to deploy your own because I literally couldn't care less :D)

## Learn More

- [`agents`](https://github.com/cloudflare/agents/blob/main/packages/agents/README.md)
- [Cloudflare Agents Documentation](https://developers.cloudflare.com/agents/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)

## License

MIT
