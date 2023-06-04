const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();
            
    const dados = getdoc.data();
    const token = dados.access_token;
    console.log(req.body.topic)    
    if (req.body.topic === 'orders_v2') {
        const orders_id = req.body.resource.split('/').pop();
        console.log(orders_id)
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    
        const data = {
            "from" : {
            "user_id": "1388551316",
            },
            "to": {
                    "user_id" : "1388550410"
            },
                   "text": "mais um texto para upar",
                   
            }
            
        try {
            const response = await axios.post(`https://api.mercadolibre.com/messages/packs/${orders_id}/sellers/1388551316?tag=post_sale`, data, {
            headers: headers
            });
    
            console.log('Resposta da solicitação:', response.data);
            res.status(200).send(response.data);
        } catch (error) {
            console.error('Erro na solicitação:', error.message);
            res.status(500).send(error);
        }
    }
    
};
