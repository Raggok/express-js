/*import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import express from 'express';

import swaggerJSDoc from 'swagger-jsdoc';
import SwaggerUI from 'swagger-ui-express';

import toolsRoutes from './routes/tools.routes.js';
import usersRoutes from './routes/users.routes.js';
import logsRoutes from './routes/logs.routes.js';

const app = express();
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EFINFO AI',
      version: '1.0.0',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
  apis: ['./src/routes/*.js'], // files containing annotations as above
};
//console.log(`${path.join(path.resolve(), 'routes/*.js')}`);
//Settings
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Express JS on Vercel');
});
app.use('/api-doc', SwaggerUI.serve, SwaggerUI.setup(swaggerJSDoc(options)));

//Routes
app.use('/api/users', usersRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api', toolsRoutes);

export default app;*/
//import 'dotenv/config';
import express from 'express';

const app = express();
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());

app.get('*', (req, res) => {
  res.send('Express JS on Vercel');
});

export default app;
