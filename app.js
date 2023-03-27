const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const sslRedirect = require('express-sslify');

dotenv.config();
const app = express();

// Redirecionar todas as solicitações HTTP para HTTPS
if (process.env.NODE_ENV === 'production') {
  app.use(sslRedirect.HTTPS({ trustProtoHeader: true }));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.HUGGY_CLIENT_ID;
  res.send([redirectUri, clientId]);
});

app.get('/access-token/:code', (req, res) => {
  const code = req.params.code;
  axios
    .post('https://auth.huggy.app/oauth/access_token', {
      grant_type: 'authorization_code',
      redirect_uri: process.env.REDIRECT_URI,
      client_id: process.env.HUGGY_CLIENT_ID,
      client_secret: process.env.HUGGY_CLIENT_SECRET,
      code: code,
    })
    .then((response) => {
      res.send(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
});
