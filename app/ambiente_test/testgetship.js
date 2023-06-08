const per = require('./permissao');
const env = require('./posvenda');
const pdf = require('./pdf_post');
const msg = require('./messages');
const ref = require('./refresh');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
    let topic = req.body.topic
    console.log(topic)

    try {
        // Recuperar tokens do Firestore
        const docRef = admin.firestore().collection('allnec_testes').doc('code_tokens');
        const getDoc = await docRef.get();
        const dados = getDoc.data();
        const token = dados.access_token;
        console.log(token);
        //const shipments = req.body.resource
        const shipments=req// 
        console.log(shipments)
        const headers = {
            'Authorization': `Bearer ${token}`,
        };
        console.log(headers)
        // Enviar a solicitação GET
        const response = await axios.get(`https://api.mercadolibre.com/${shipments}`, { headers });

    
        const resultado = response.data
        console.log(resultado)
        res.status(200).send(resultado);
    } catch (error) {
        
        console.error('Erro ocorreu:', error);
        res.status(500).send(error);
    }
         
};
