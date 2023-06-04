exports.enviar = async (req, res, admin) => {
    let retry = true;
  
    for (let attempt = 0; retry && attempt < 2; attempt++) {
      try {
        const docRef = admin.firestore().collection('allnec').doc('code_tokens');
        const getdoc = await docRef.get();
        const dados = getdoc.data();
        const token = dados.access_token;
        //REQ DO BODY
        const resource = req.body.resource;
        const orders_id = req.body.resource.split('/').pop();
  
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        
        //CONEXAO ORDERS_ID

        const responseorders = await axios.get(`https://api.mercadolibre.com/${resource}`, {headers: headers});
        const resultadoorders =  responseorders.data;
        const pack_id = resultadoorders.pack_id;
        const MLB = resultadoorders.order_items[0].item.id

        // BANCO DE DADOS TEXTO 

        const doctext= admin.firestore().collection('allnec').doc('texto_posvenda');
        const getdoctext = await doctext.get();
        const dadostext = getdoctext.data();
        const certificado_s =   dadostext.cert_s
        const certificado_c =   dadostext.cert_c
        const textneutro    =   dadostext.neutro

        if (MLB == 'MLB860044284' || MLB == 'MLB860793131' || MLB == 'MLB948500675' || MLB == 'MLB1722608932' || MLB == 'MLB3188602750' || MLB == 'MLB1757687138' || MLB == 'MLB2048672953' || MLB == 'MLB3258278429') {
            if (!pack_id) {
                try {
                    const headers1 = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    };
                    const data = {
                        "option_id": "OTHER",
                        "text": certificado_s
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
                        "text": certificado_s
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

        }else if (MLB == 'MLB860793560' || MLB == 'MLB1163570011' || MLB == 'MLB1726169128' || MLB == 'MLB2048679577' || MLB == 'MLB3258314215') {
            if (!pack_id) {
                try {
                    const headers1 = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    };
                    const data = {
                        "option_id": "OTHER",
                        "text": certificado_c
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
                        "text": certificado_c
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

        }else {
            if (!pack_id) {
                try {
                    const headers1 = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    };
                    const data = {
                        "option_id": "OTHER",
                        "text": textneutro
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
                        "text": textneutro
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
  