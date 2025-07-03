# ai-open-agents
The Spatial Network's AI platform. Open-Web-UI plus a custom OpenAPI Tool Server.

We are creating a library of AI solutions to aid in the Regeneration of Earth. This platform combines the power of large language models with custom tools to create AI agents that can perform specific tasks to support environmental regeneration efforts.

_OpenSourceEverything_

## Components

### [Open Web UI](https://github.com/open-webui/open-webui)

[Open Web UI](https://github.com/open-webui/open-webui) is the core of this project. It provides an OpenSource platform for building on top of AI. It's a user-friendly interface for interacting with various AI models and integrating custom tools.

We deploy it as a docker container in our docker-compose file. Pinned for stability. Let's check in for updates frequently. If we need the platform to do more cool stuff, let's contribute to this project!

Key features:
- Web-based chat interface for AI interactions
- Support for multiple AI models
- Integration with custom tools via OpenAPI
- User management and conversation history


### Custom Tool Server

Open Web UI supports integrating OpenAPI servers as tools that you can use to give your AI assistants agentic behavior. These tools allow the AI to perform actions in the real world, such as accessing databases, interacting with file systems, or calling external APIs.

We build a custom docker image in the `/tools` directory and deploy it in our docker-compose file. This server exposes a set of OpenAPI endpoints that the AI can use to perform specific tasks related to environmental regeneration.

The tool server is built using:
- FastAPI for the API framework
- Python for the backend logic
- Docker for containerization and deployment


#### Tool Utilities
`tools/python/utils/*`

Our tool server includes various utility modules to interact with external services:

* **Supabase Integration**: 
  * Located at: `tools/python/utils/supabase.py`
  * Configuration: Requires `SUPABASE_API_URL` and `SUPABASE_API_KEY` environment variables
  * Purpose: Store and retrieve data from our Supabase database, including project information and business plans

* **NextCloud Integration**: (Coming Soon)
  * Will provide file storage and sharing capabilities
  * Will allow AI agents to access and manipulate documents, images, and other files
  * Planned location: `tools/utils/nextcloud.py`

* **WordPress Integration**: (Under Consideration)
  * Would enable AI agents to publish content to WordPress sites
  * Could be used for automated reporting, blog posts about environmental initiatives, and public updates
  * Potential location: `tools/utils/wordpress.py`

## Deployment

The entire platform is deployed using Docker Compose, which orchestrates the following containers:
- Open Web UI frontend
- Custom Tool Server
- Database (if needed)
- Any additional services

See the `docker-compose.yml` file for the complete deployment configuration.

## Getting Started

1. Clone this repository
2. Set up the required environment variables (see `.env.example`)
3. Run `docker-compose up -d` to start the services
4. Access the UI at `http://localhost:3000` (or your configured port)

## Contributing

We welcome contributions to this project! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines.

## License

This project is licensed under the terms of the LICENSE file included in this repository.
