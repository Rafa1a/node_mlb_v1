const axios = require('axios');

const ref = require('./refresh');

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
        //get para orders
        const responseorders = await axios.get(`https://api.mercadolibre.com/${resource}`, {headers: headers});
        const resultadoorders =  responseorders.data;
        //const pack_id = resultadoorders.pack_id;
        const MLB = resultadoorders.order_items[0].item.id
        
        // banco de dados ids
        const docorder = admin.firestore().collection('allnec').doc('orders_id');
        const getdo = await docorder.get();    
        const dado = getdo.data();
        const ids = dado.ids;
        if (ids.includes(orders_id)){
            return
        }else {
            if (MLB == 'MLB3337547121' || MLB == 'MLB3337991729') {

                try {
                    const headers1 = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    };
                    const data = {
                        "option_id": "OTHER",
                        "text": "testando"
                    };
                    const response = await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${orders_id}/option`, data, {headers: headers1});
                    
                    console.log('Resposta do envio da mensagem:', response.data);
                    retry = false;
                    if (ids.length > 90) {
                        ids.shift();
                        await docorder.update({ ids: ids });
                    }
                    await docorder.update({ ids: [...ids, orders_id] });
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

        }else if (MLB == 'MLB3693555292') {
            
                try {
                    const headers1 = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    };
                    const data = {
                        "option_id": "OTHER",
                        "text": "tpa10k testando unico"
                    };
                    const response = await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${orders_id}/option`, data, {headers: headers1});
                    
                    console.log('Resposta do envio da mensagem:', response.data);
                    if (ids.length > 90) {
                        ids.shift();
                        await docorder.update({ ids: ids });
                    }
                    await docorder.update({ ids: [...ids, orders_id] });
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

        }else {
            
                try {
                    const headers1 = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    };
                    const data = {
                        "option_id": "OTHER",
                        "text": "vsem MLB testando"
                    };
                    const response = await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${orders_id}/option`, data, {headers: headers1});
                    
                    console.log('Resposta do envio da mensagem:', response.data);
                    if (ids.length > 90) {
                        ids.shift();
                        await docorder.update({ ids: ids });
                    }
                    await docorder.update({ ids: [...ids, orders_id] });
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
        }
        
      } catch (error) {
        // Se ocorrer um erro, atualize o access token
        ref.refresh(req, res, admin);
        console.error('Erro na solicitação orders_id:', error.message);
        // Aguarde um tempo antes de tentar novamente
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };
  