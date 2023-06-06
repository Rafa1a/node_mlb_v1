const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
   
    try {
        // Recuperar tokens do Firestore
        const docRef = admin.firestore().collection('allnec').doc('code_tokens');
        const getDoc = await docRef.get();
        const dados = getDoc.data();
        const token = dados.access_token;
        //console.log(token);

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        // Enviar a solicitação GET
        const response = await axios.get(`https://api.mercadolibre.com/messages/unread?tag=post_sale`, { headers });

        // Processar a resposta
        

        const results = response.data.results 
        const globalArray = [];
        //IMPORTAR IDS 
        const docorder = admin.firestore().collection('allnec').doc('orders_id');
        const getdo = await docorder.get();    
        const dado = getdo.data();
        const ids = dado.ids;
        const ids2 = dado.ids2
        
        for (let i = 0; i < results.length; i++) {
            const resourceValue = results[i].resource;
            const match = resourceValue.match(/\/packs\/(\d+)\//);
            if (match) {
                const number = match[1];
                if (ids.includes(number) && !ids2.includes(number)) {
                    globalArray.push(number);
                }
            }
        }
        
        console.log('globalArray:', globalArray);

        res.status(200).send(globalArray);
    } catch (error) {
        console.error('Erro ocorreu:', error);
        res.status(500).send(error);
    }
};
