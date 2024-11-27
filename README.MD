## Usage

```bash
git clone https://github.com/rityak/ws-fake-stream-server.git
cd ws-fake-stream-server
npm install axios ws pm2
sudo npm install -g pm2
pm2 start websocket-server.js --name websocket-stream
pm2 startup
pm2 save
```

*WS Port* - `1180`