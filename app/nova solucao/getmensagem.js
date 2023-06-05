const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
    //console.log('topic fora da condicao:', req.body.topic);

    // const resource = req.body.resource
  
    // console.log("userID : ", req.body.user_id)
    // console.log('resource:', resource)

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
        

        const results = response.data.results;
        const ids = ['2000005785654496', '2000005790218812', '2000005784173620', '2000005788806102', '2000005790287390', '2000005786024274']; // Substitua pelos seus valores reais
        const ids2 = ['id2', '2000005784173620', '2000005785654496']; // Substitua pelos seus valores reais
        const globalArray = [];

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
