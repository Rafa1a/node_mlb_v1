const axios = require('axios');


const clientId = '2898738539387497';
const clientSecret = 'gAEBaHQf2MxtkRmV2nb4XxQV5l3CXEWq';


exports.refresh = async (req, res, admin) => {
  const docRef = admin.firestore().collection('allnec').doc('code_tokens');
  const getdoc = await docRef.get();
       
  const dados = getdoc.data();
    
  const code = dados.code;
 
  const data = {
    grant_type: 'refresh_token',
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: code,
  };
  const headers = {
    accept: 'application/json',
    'content-type': 'application/x-www-form-urlencoded'
  }
  axios
    .post('https://api.mercadolibre.com/oauth/token', data, {headers: headers})
    .then(async (response) => {
      const resultado = response.data;

      const data = {
        code: resultado.refresh_token,
        access_token: resultado.access_token  
      };
      
      await docRef.set(data);

      console.log('Access Token:', resultado.access_token);
      console.log('Code:', resultado.refresh_token);

      
    })
    .catch((error) => {
      console.error('Erro:', error);
      
    });
};
