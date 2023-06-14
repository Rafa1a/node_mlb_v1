const axios = require('axios');

const clientId = 'clientid';
const clientSecret = 'clientsecret';
const admin = require('firebase-admin');
admin.initializeApp();

exports.permissao = async (req, res) => {
  const docRef = admin.firestore().collection('allnec_testes').doc('code_tokens');
  const code = req.query.code;

  const data = {
    grant_type: 'authorization_code',
    client_id: clientId,
    client_secret: clientSecret,
    code: code,
    redirect_uri: 'https://southamerica-east1-frangoboss.cloudfunctions.net/ambientetest_back_posvenda_mlb-1',
    
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
        `<a href="https://auth.mercadolivre.com.br/authorization?response_type=code&client_id=8951575098014866&redirect_uri=https://southamerica-east1-frangoboss.cloudfunctions.net/ambientetest_back_posvenda_mlb-1">Solicitar permissio</a>`
      );
*/
      res.status(200).send('Autorização concluída. Tudo Pronto para funcionar');
    })
    .catch((error) => {
      console.error('Erro:', error);
      res.status(500).json(error);
    });
};
