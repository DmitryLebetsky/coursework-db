const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API',
    description: 'API Documentation',
  },
  host: 'localhost:5000', // Ваш хост
  schemes: ['http'], // Используйте 'https', если сервер поддерживает HTTPS
};

const outputFile = './swagger-output.json'; // Путь для сохранения документации
const endpointsFiles = ['./index.js']; // Укажите здесь путь к вашему index.js

swaggerAutogen(outputFile, endpointsFiles).then(() => {
  console.log('Swagger documentation generated successfully!');
});
