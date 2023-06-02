const axios = require('axios');

const clientId = '2898738539387497';
const clientSecret = 'gAEBaHQf2MxtkRmV2nb4XxQV5l3CXEWq';


exports.permissao = async (req, res, admin) => {
  const docRef = admin.firestore().collection('allnec').doc('code_tokens');
  const code = req.query.code;

  const data = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: 'https://us-central1-frangoboss.cloudfunctions.net/back_posvenda_mlb',
    
  };
  const headers = {
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded',
  }
  axios
    .post('https://api.mercadolibre.com/oauth/token', data,  {headers: headers})
    .then(async (response) => {
      const resultado = response.data;

      const data = {
        code: resultado.refresh_token,
        access_token: resultado.access_token  
      };
      
      await docRef.set(data);

      console.log('Access Token:', resultado.access_token);
      console.log('Code:', resultado.refresh_token);


      /*console.log(
        `<a href="https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=2898738539387497&redirect_uri=https://us-central1-frangoboss.cloudfunctions.net/back_posvenda_mlb">Solicitar permissio</a>`
      );
*/
      res.status(200).send('Autorização concluída. Verifique o console para obter os tokens de acesso.');
    })
    .catch((error) => {
      console.error('Erro:', error);
      res.status(500).json(error);
    });
};