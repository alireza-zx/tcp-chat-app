# Node.js TCP Chat-app

A raw TCP chat server with CLI app built in Node.js & JavaScript.
**No third-party dependencies**

<p align="center">
  <img src="https://nodejs.org/static/images/logo.svg" width="80" />
</p>

<h1 align="center">TCP Chat Server</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-24%20LTS-339933?logo=node.js&logoColor=white" />
</p>

## 🧭 Features
- Raw TCP only — no HTTP or WebSocket layer involved.
- Each user enters a username to join the chatroom and receives a unique ID upon connection.
- Real-time notifications when users join or leave the chatroom.
- Colored messages for improved readability and better UI experience in the terminal.
- Every message includes an exact local time (date and time).
- Clean and structured server-side logging for better observability.
- Built entirely using Node.js built-in modules — no external dependencies.

## 🪄 Installation
- You need to install Node.js on your machine first: https://nodejs.org/en/download

```bash
git clone https://github.com/alireza-zx/tcp-chat-app.git
cd tcp-chat-app
node ./server/server.js
node ./app/client.js
```

## 🔧 Created by Alireza Hakimi