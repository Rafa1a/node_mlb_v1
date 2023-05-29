const axios = require('axios');

const clientId = '2898738539387497';
const clientSecret = 'gAEBaHQf2MxtkRmV2nb4XxQV5l3CXEWq';
const code = process.argv[2]; // Passe o código como argumento de linha de comando ou atribua-o diretamente

const data = {
  grant_type: 'authorization_code',
  client_id: clientId,
  client_secret: clientSecret,
  code: code,
  redirect_uri: 'https://localhost/mercadolivre/index.php',
  accept: 'application/json',
  'content-type': 'application/x-www-form-urlencoded',
};

axios
  .post('https://api.mercadolibre.com/oauth/token', data)
  .then((response) => {
    const resultado = response.data;

    console.log('Access Token:', resultado.access_token);
    console.log('Code:', resultado.refresh_token);
    console.log(
      `<a href="https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=${clientId}&redirect_uri=https://localhost/mercadolivre/index.php">Solicitar permissio</a>`
    );
  })
  .catch((error) => {
    console.error('Erro:', error);
  });
