
# hacknio

hacknio is a lightweight Hacker News client created with React and Next.js, designed to deliver a fast and responsive user experience. You can navigate between pages using the arrow keys for added convenience!

![](https://i.imgur.com/sGCXhz4.png)
![](https://i.imgur.com/aT1prKp.png)
![](https://i.imgur.com/0pIGR0k.png)

## Tech Stack

- **Frontend:** React, Next.js, Tailwind CSS
- **API:** Hacker News API

## Getting Started

To run the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ni5arga/hacknio.git
   cd hacknio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser and navigate to:**
   ```
   http://localhost:3000
   ```

## Use with Docker

To run hacknio using Docker:

1. **Build and start the container:**
   First, cd into the top directory of the `hacknio` repo.

   Then do...

   ```bash
   docker compose up -d --build
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

3. **Stop the container:**
   ```bash
   docker compose down
   ```

Note: The default port is 3000. To use a different port, set the `HOST_PORT` environment variable before running docker compose or include the environment variable in an adjacent `.env` file.

## Contributing

Contributions are welcome! If you have suggestions or issues, please create an issue in the GitHub repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Hacker News API](https://github.com/HackerNews/API) for providing the data.

