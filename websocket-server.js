const WebSocket = require('ws');
const axios = require('axios');
const https = require('https');

const wss = new WebSocket.Server({ port: 1180 });

async function getImageBinary() {
  try {
    const response = await axios.get('https://random.imagecdn.app/v1/image?width=360&height=240');
    const imageUrl = response.data;  
    const imageBuffer = await downloadImage(imageUrl);
    return imageBuffer;
  } catch (error) {
    console.error('Ошибка при получении изображения:', error);
    return null;
  }
}

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    });
  });
}

wss.on('connection', (ws) => {
  console.log('Новое подключение');
  
  const streamImages = async () => {
    try {
      while (true) {
        const imageBuffer = await getImageBinary();
        
        if (imageBuffer) {
          ws.send(imageBuffer);
          console.log('Отправлено бинарное изображение');
        }
        
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error('Ошибка при стриминге изображений:', error);
    }
  };

  streamImages();
  ws.on('close', () => {
    console.log('Соединение закрыто');
  });
});

console.log('Вебсокет сервер работает на порту 1180');
