const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();



exports.index = async (req, res) => {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();
            
    const dados = getdoc.data();
    const token = dados.access_token;
    //console.log(req.body.topic)    
    //if (req.body.topic === 'orders_v2') {
       // const orders_id = req.body.resource.split('/').pop();
        //console.log(orders_id)
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
                "attachments": ["1388551316_86cf5210-ed59-4d4c-92f6-3cfd0cfa76f6.pdf", "1388551316_c7da687f-cc2c-4a72-80a9-5efab2094f6d.pdf"]
        }
        
    try {
        const response = await axios.post(`https://api.mercadolibre.com/messages/packs/2000005782689722/sellers/1388551316?tag=post_sale`, data, {
        headers: headers
        });

        console.log('Resposta da solicitação:', response.data);
        res.status(200).send(response.data);
    } catch (error) {
        console.error('Erro na solicitação:', error.message);
        res.status(500).send(error);
    }
   // }
    
};
