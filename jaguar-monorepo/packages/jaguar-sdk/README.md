<a href="https://jaguar-sdk.dev">
  <img alt="Jaguar SDK - World's First Open Source AGI Platform" src="app/(chat)/opengraph-image.png">
  <h1 align="center">🐆 Jaguar SDK</h1>
</a>

<p align="center">
    <strong>World's First Open Source AGI Platform</strong><br/>
    Manifest your dreams with AI agents that build the new earth
</p>

<p align="center">
  <a href="#-vision"><strong>Vision</strong></a> ·
  <a href="#-features"><strong>Features</strong></a> ·
  <a href="#-quick-start"><strong>Quick Start</strong></a> ·
  <a href="#-architecture"><strong>Architecture</strong></a> ·
  <a href="#-community"><strong>Join the Movement</strong></a>
</p>

<div align="center">

[![Open Source](https://img.shields.io/badge/Open%20Source-New%20Earth-gold?style=for-the-badge)](https://github.com/serenelion/jaguar-sdk)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![Powered by AI SDK](https://img.shields.io/badge/Powered%20by-AI%20SDK-blue?style=for-the-badge)](https://sdk.vercel.ai)
[![Spatial Network](https://img.shields.io/badge/Spatial-Network-green?style=for-the-badge)](https://thespatialnetwork.net)

</div>

---

## 🌍 Vision

**Jaguar SDK is more than software—it's a movement.**

We're building the world's first open source AGI platform that empowers conscious creators to manifest their dreams through intelligent AI agents. Our mission is to democratize artificial general intelligence and align profit with purpose, creating technology that serves both humanity and the planet.

### The New Earth Paradigm

- **🌱 Regenerative by Design**: Technology that heals rather than harms
- **🤝 Community-Driven**: Open source, collaborative, and accessible to all
- **💡 Dream Manifestation**: Turn your wildest ideas into reality with AI agents
- **🌐 Decentralized Intelligence**: Distribute place based AGI capabilities through The Spatial Network
- **💰 Conscious Commerce**: Monetize your agents while creating positive impact

---

## ✨ Features

### 🤖 **Agent Creation & Management**

Build custom AI agents with specific capabilities, personalities, and purposes. From simple automation to complex reasoning, create agents that work for you.

### 👥 **Team Collaboration**

Organize agents into intelligent teams that collaborate on complex tasks. Watch as your AI workforce coordinates to achieve ambitious goals.

### ⚡ **Workflow Automation**

Seamlessly integrate with n8n workflows for powerful automation. Connect your agents to any API, service, or system.

### 🏪 **Agent Marketplace**

Deploy, discover, and monetize AI agents on the Spatial Network. Build a sustainable business around your intelligent creations.

### 🌿 **Nature-Aligned Development**

Special tools and templates for regenerative projects, environmental monitoring, and sustainable technology development.

### 📚 **Knowledge Management**

Intelligent document processing, search, and knowledge synthesis powered by your personal Jaguar assistant.

### 🎨 **Beautiful, Modular Interface**

- **Landing Experience**: Describe your dream and watch it come to life
- **Dashboard Shell**: Persistent sidebar with all modules
- **Chat Interface**: Full-featured AI conversation with streaming responses
- **Agent Builder**: Visual tools for creating and configuring agents
- **Team Management**: Organize and orchestrate agent collaborations

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- Supabase account (database)
- Jaguar API key (OpenWebUI instance)

### 1. Clone & Install

```bash
git clone https://github.com/serenelion/jaguar-sdk.git
cd jaguar-sdk
pnpm install
```

### 2. Environment Setup

Copy `.env.example` to `.env` and configure:

```env
# Database (Required)
POSTGRES_URL=postgresql://postgres:password@db.your-ref.supabase.co:5432/postgres

# Jaguar AI Models (Required)
JAGUAR_BASE_URL=https://ai.thespatialnetwork.net
JAGUAR_API_KEY=sk-your-jaguar-api-key-here

# Optional Enhancements
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_your-token
REDIS_URL=redis://your-redis-url
```

### 3. Database Setup

```bash
pnpm run db:migrate
```

### 4. Launch

```bash
pnpm dev
```

Visit [localhost:3000](http://localhost:3000) and start manifesting your dreams! 🎉

> 📖 **Need detailed setup help?** Check out our comprehensive [SETUP.md](SETUP.md) guide.

---

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, TailwindCSS
- **AI Layer**: AI SDK with xAI, OpenAI, Anthropic support
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with GitHub & Magic Link
- **Storage**: Vercel Blob for file management
- **Caching**: Redis for performance optimization
- **Automation**: n8n workflow integration
- **Network**: Spatial Network connectivity

### Core Modules

```
jaguar-sdk/
├── app/
│   ├── (landing)/          # Dream input & onboarding
│   └── dashboard/          # Modular platform
│       ├── chat/           # AI conversation interface
│       ├── agents/         # Agent creation & management
│       ├── teams/          # Team collaboration tools
│       ├── marketplace/    # Agent discovery & monetization
│       ├── nature/         # Regenerative project tools
│       └── knowledge/      # Document & knowledge management
├── components/
│   ├── jaguar-sidebar.tsx  # Persistent navigation
│   └── ui/                 # Design system components
└── lib/
    ├── ai/                 # AI SDK configuration
    ├── db/                 # Database schema & queries
    └── spatial/            # Spatial Network integration
```

---

## 🌟 Join the Movement

### For Conscious Creators

- **Build**: Create AI agents that align with your values
- **Share**: Contribute to the open source ecosystem
- **Earn**: Monetize your agents on the Spatial Network
- **Impact**: Use technology to heal the world

### For Developers

- **Contribute**: Help build the future of open source AGI
- **Learn**: Master cutting-edge AI development techniques
- **Connect**: Join a community of conscious technologists
- **Grow**: Advance your career in the AI revolution

### Ways to Contribute

1. **🐛 Report Issues**: Help us improve by reporting bugs
2. **💡 Feature Requests**: Suggest new capabilities
3. **🔧 Code Contributions**: Submit PRs for fixes and features
4. **📖 Documentation**: Improve guides and tutorials
5. **🎨 Design**: Enhance the user experience
6. **🌍 Translation**: Make Jaguar accessible globally

---

## 📚 Documentation

### Core Documentation

- **[Jaguar Core](docs/jaguar-core.md)**: Complete Jaguar architecture and API guide
- **[OpenWebUI Integration](docs/openwebui-integration.md)**: Setup and integration patterns
- **[Setup Guide](SETUP.md)**: Complete installation instructions

### Infrastructure Guides

- **[n8n Workflows](https://docs.n8n.io/)**: Workflow automation and agent orchestration
- **[React Development](https://react.dev/)**: Modern React patterns for AI interfaces
- **[Next.js Framework](https://nextjs.org/docs)**: Full-stack React framework guide
- **[PostgreSQL](https://www.postgresql.org/docs/)**: Database management and optimization

### AGI & Ethics

- **[Permaculture Ethics](docs/jaguar-core.md#permaculture-ethics-integration)**: Earth Care, People Care, Fair Share
- **[Conscious AI Development](docs/jaguar-core.md#masterclass-wisdom)**: Ethical AI frameworks
- **[System Prompt](docs/system_prompt.md)**: Core AI behavior configuration

---

## 🤝 Community

- **Discord**: [Join our community](https://discord.gg/jaguar-sdk)
- **Twitter**: [@JaguarSDK](https://twitter.com/JaguarSDK)
- **GitHub**: [Discussions](https://github.com/serenelion/jaguar-sdk/discussions)
- **Website**: [jaguar-sdk.dev](https://jaguar-sdk.dev)

---

## 📄 License

Jaguar SDK is open source software licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

Built with love by the conscious technology community. Special thanks to:

- **Vercel** for the AI SDK and deployment platform
- **Supabase** for the backend infrastructure
- **The Spatial Network** for the vision of decentralized intelligence
- **All contributors** who believe in technology for the new earth

---

<div align="center">

**Ready to manifest your dreams?**

[🚀 **Get Started**](https://github.com/serenelion/jaguar-sdk) · [💬 **Join Discord**](https://discord.gg/jaguar-sdk) · [🌐 **Visit Website**](https://jaguar-sdk.dev)

---

_"The future belongs to those who believe in the beauty of their dreams."_  
**— Eleanor Roosevelt**

</div>
