
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
    console.log('topic fora da condicao :',req.body.topic)
    if (req.body.topic == 'messages') {
        const resource = req.body.resource

        console.log("userID : ", req.body.user_id)
        console.log('resource :', resource)

        try {
            // Recuperar tokens do Firestore
            const docRef = admin.firestore().collection('allnec').doc('code_tokens');
            const getDoc = await docRef.get();
            const dados = getDoc.data();
            const token = dados.access_token;
            console.log(token)
            
            const headers = {
              'Authorization': `Bearer ${token}`,
            };
        
            // Enviar a solicitação POST
            const response = await axios.get(`https://api.mercadolibre.com/messages/${resource}`, {headers: headers});
        
            // Processar a resposta
            console.log('Resposta:', response.data);
        
            res.status(200).send('ok');
          } catch (error) {
            console.error('Erro deu erro vish osso');
            res.status(500).send(error);
          }
    }else {
        console.log("dentro da condicao: " ,req.body.topic)
        res.status(200).send('ok');
    }
    
};
