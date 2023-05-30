const express = require('express');
const axios = require('axios');

const app = express();
const clientId = '2898738539387497';
const clientSecret = 'gAEBaHQf2MxtkRmV2nb4XxQV5l3CXEWq';

// Rota para receber o código de autorização e fazer o POST para obter o token de acesso\

app.get('/', (req, res) => {
  const code = req.query.code;
  console.log(code)
  
  console.log("ola caraio")
  const data = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: 'http://localhost:3000/',
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
  };

  axios
    .post('https://api.mercadolibre.com/oauth/token', data)
    .then((response) => {
      const resultado = response.data;

      console.log('Access Token:', resultado.access_token);
      console.log('Code:', resultado.refresh_token);
      /*console.log(
        `<a href="https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=2898738539387497&redirect_uri=http://localhost:3000/">Solicitar permissio</a>`
      );*/

      res.send('Autorização concluída. Verifique o console para obter os tokens de acesso.');
    })
    .catch((error) => {
      console.error('Erro:', error);
      res.status(500).send('Ocorreu um erro durante a autorização.');
    });
});

// Inicie o servidor na porta desejada
const port = 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
