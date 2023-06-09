const axios = require('axios');

const ref = require('./main/refresh');

exports.enviar = async (req, res, admin) => {
    let retry = true;
  
    for (let attempt = 0; retry && attempt < 2; attempt++) {
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
            try {
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
                retry = false;
                }
            catch (error) {
                if (error.response && error.response.status === 403) {
                    // Lógica para tratar o erro 403
                    retry = false;
                } else {
                    // Se ocorrer outro tipo de erro, atualize o access token e faça outras ações necessárias
                    ref.refresh(req, res, admin);
                    console.error('Erro na solicitação mensagem:', error.message);
                    // Aguarde um tempo antes de tentar novamente
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                }
        } else {
            try {
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
                retry = false;
                }
            catch (error) {
                if (error.response && error.response.status === 403) {
                    // Lógica para tratar o erro 403
                    retry = false;
                } else {
                    // Se ocorrer outro tipo de erro, atualize o access token e faça outras ações necessárias
                    ref.refresh(req, res, admin);
                    console.error('Erro na solicitação mensagem:', error.message);
                    // Aguarde um tempo antes de tentar novamente
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                }
                  
        }
        retry = false; // Saída do loop caso a execução seja bem-sucedida
      } catch (error) {
        // Se ocorrer um erro, atualize o access token
        ref.refresh(req, res, admin);
        console.error('Erro na solicitação orders_id:', error.message);
        // Aguarde um tempo antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };
  