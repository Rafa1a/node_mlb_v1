const axios = require('axios');

const ref = require('./refresh');


exports.enviar = async (req, res, admin) => {
  let retry = true;
  let attempt = 0;
  
  while (retry && attempt < 2) {
    try {
      const docRef = admin.firestore().collection('allnec').doc('code_tokens');
      const getdoc = await docRef.get();
      const dados = getdoc.data();
      const token = dados.access_token;
  
      const resource = req.body.resource;
      const orders_id = req.body.resource.split('/').pop();
  
      const headers = {
        'Authorization': `Bearer ${token}`
      };
  
      const responseorders = await axios.get(`https://api.mercadolibre.com/${resource}`, {headers: headers});
      const resultadoorders =  responseorders.data;
      const pack_id = resultadoorders.pack_id;
  
      if (!pack_id) {
        const headers1 = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        const data = {
          "option_id": "OTHER",
          "text": "vai q vai "
        };
        const response = await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${orders_id}/option`, data, {headers: headers1});
  
        console.log('Resposta do envio da mensagem:', response.data); 
      } else {
        const headers1 = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };
        const data = {
          "option_id": "OTHER",
          "text": "vai q vai "
        };
        const response = await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${pack_id}/option`, data, {headers: headers1});
  
        console.log('Resposta do envio da mensagem:', response.data); 
      }
  
      console.log('Resposta da orders_id:');
      retry = false; // Saída do loop caso a execução seja bem-sucedida
    } catch (error) {
      // Se ocorrer um erro, atualize o access token
      ref.refresh(req, res, admin);
      console.error('Erro na solicitação orders_id:', error.message);
      // Aguarde um tempo antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempt++; // Incrementa o contador de tentativas
    }
  }
};
