const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();
            
    const dados = getdoc.data();
    const token = dados.access_token;

    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    const data = {
        site_id: 'MLB'
    };

    try {
        const response = await axios.post('https://api.mercadolibre.com/users/test_user', data, {
        headers: headers
        });

        console.log('Resposta da solicitação:', response.data);
        res.status(200).send(response.data);
    } catch (error) {
        console.error('Erro na solicitação:', error.message);
        res.status(500).send(error);
    }
};
