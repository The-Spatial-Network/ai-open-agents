# Contributing to AI Open Agents

Thank you for your interest in contributing to the AI Open Agents project! This document provides guidelines and instructions for contributing.

## Code of Conduct

In the interest of fostering an open and welcoming environment, we expect all participants to adhere to the principles of respect, empathy, and collaboration.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with the following information:
- A clear, descriptive title
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Any relevant logs or screenshots
- Your environment (OS, browser, etc.)

### Suggesting Enhancements

We welcome suggestions for enhancements! Please create an issue with:
- A clear, descriptive title
- A detailed description of the proposed enhancement
- Any relevant examples, mockups, or use cases

### Pull Requests

1. Fork the repository
2. Create a new branch from `main`
3. Make your changes
4. Run tests if applicable
5. Submit a pull request

#### Pull Request Guidelines

- Keep changes focused and atomic
- Follow the existing code style
- Include tests for new functionality
- Update documentation as needed
- Provide a clear description of the changes

## Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and fill in the values
3. Run `docker-compose up -d` to start the services
4. Access the UI at `http://localhost:3000`

## Project Structure

- `/tools` - Custom tool server implementation
  - `/python/utils` - Utility modules for external services
- `docker-compose.yml` - Docker Compose configuration
- `README.md` - Project documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the project's license.

## Questions?

If you have any questions about contributing, please reach out to the project maintainers.

Thank you for helping to improve AI Open Agents!
