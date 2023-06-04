const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();     
    const dados = getdoc.data();
    const token = dados.access_token;

    const docorder = admin.firestore().collection('allnec').doc('orders_id');
    const getdo = await docorder.get();    
    const dado = getdo.data();
    const ids = dado.ids;
      
    //const orders_id = req.body.resource.split('/').pop();

    const orders_id = 2000005780372776
    
    let shouldExecuteFunction = true;

    for (let i = 0; i < ids.length; i++) {
        if (ids[i] === orders_id) {
            shouldExecuteFunction = false;
            break;
        }
    }

    if (shouldExecuteFunction) {
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
        };

        try {
            const response = await axios.post(`https://api.mercadolibre.com/messages/packs/2000005782689722/sellers/1388551316?tag=post_sale`, data, {
                headers: headers
            });

            console.log('Resposta da solicitação:', response.data);
            await docorder.update({ ids: [...ids, orders_id] });
            res.status(200).send(response.data);
        } catch (error) {
            console.error('Erro na solicitação:', error.message);
            res.status(500).send(error);
        }
    } else {
        console.log('Já respondeu');
        res.status(200).send('Já respondeu');
    }
};
