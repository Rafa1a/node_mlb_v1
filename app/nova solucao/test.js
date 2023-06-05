const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
        try {
            const docRef = admin.firestore().collection('allnec').doc('code_tokens');
            const getDoc = await docRef.get();
            const dados = getDoc.data();
            const token = dados.access_token;
            console.log(token)
            
            const headers = {
              'Authorization': `Bearer ${token}`,
            };
            const responseorders = await axios.get(`https://api.mercadolibre.com/orders/2000005784231482`, {headers: headers});
            const resultadoorders =  responseorders.data;
            
            res.status(200).send(resultadoorders);
        }catch (error) {
            console.error('Erro deu erro vish osso');
            res.status(500).send(error);
        }
       
};
