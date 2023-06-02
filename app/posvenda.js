const axios = require('axios');




exports.enviar = async (req, res, admin) => {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();
            
    const dados = getdoc.data();
    const token = dados.access_token;

    const resource = req.body.resource
    const orders_id = req.body.resource.split('/').pop();

    const headers = {
        'Authorization': `Bearer ${token}`
    };

    try {
        const responseorders = await axios.get(`https://api.mercadolibre.com/${resource}`, {headers: headers});

        const resultadoorders =  responseorders.data
        const pack_id = resultadoorders.pack_id

        if (!pack_id) {
            try {
                const headers1 = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                const data = {
                    "option_id": "OTHER",
                    "text": "vai q vai "
                }
                const response = await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${orders_id}/option`, data, {headers: headers1});
    
                console.log('Resposta do envio da mensagem:', response.data); 
    
            }catch (error){
                console.error('Erro no envio da mensagem:', error.message);
            }
    
            
        }else {
            try {
                const headers1 = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                const data = {
                    "option_id": "OTHER",
                    "text": "vai q vai"
                }
                const response = await axios.post(`https://api.mercadolibre.com/messages/action_guide/packs/${pack_id}/option`, data, {headers: headers1});
    
                console.log('Resposta do envio da mensagem:', response.data); 
    
            }catch (error){
                console.error('Erro no envio da mensagem:', error.message);
            }
        }

       
        console.log('Resposta da orders_id:', resultadoorders);
    } catch (error) {
       
        console.error('Erro na solicitação orders_id:', error.message);
        
    }
};
