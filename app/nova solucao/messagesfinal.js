const axios = require('axios');

exports.messages = async (req, res, admin) => {
   
    try {
        // Recuperar tokens do Firestore
        const docRef = admin.firestore().collection('allnec').doc('code_tokens');
        const getDoc = await docRef.get();
        const dados = getDoc.data();
        const token = dados.access_token;
        

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        // Enviar a solicitação GET
        const response = await axios.get(`https://api.mercadolibre.com/messages/unread?tag=post_sale`, { headers });

        // Processar a resposta
        

        const results = response.data.results;
        
        const globalArray = [];
        //IMPORTAR IDS 
        const docorder = admin.firestore().collection('allnec').doc('orders_id');
        const getdo = await docorder.get();    
        const dado = getdo.data();
        const ids = dado.ids;
        const ids2 = dado.ids2
        //IMPORTAR ID PDF 
        const docpdf = admin.firestore().collection('allnec').doc('pdf_id');
        const getpdf = await docpdf.get();    
        const dadopdf = getpdf.data();
        const id = dadopdf.id;
        const sentMessages = [];

        for (let i = 0; i < results.length; i++) {
            const resourceValue = results[i].resource;
            //const count = results[i].count
            const match = resourceValue.match(/\/packs\/(\d+)\//);
            if (match ) {
                const number = match[1];
                if (ids.includes(number) && !ids2.includes(number)) {
                    globalArray.push(number);
                }
            }
        }
        if (ids2.length > 90) {
            ids2.shift();
            await docorder.update({ ids2: ids2 });
        } 

        for (let i = 0; i < globalArray.length; i++){
           
            const orders_id = globalArray[i]
            try {
            
                const headers1 = {
                    'Authorization': `Bearer ${token}`,
                };
                const responseorders = await axios.get(`https://api.mercadolibre.com/orders/${orders_id}`, {headers: headers1});
                const resultadoorders =  responseorders.data;
        
                const user_id = resultadoorders.buyer.id
                const seller_id = resultadoorders.seller.id
        
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                
                const data = {
                    "from" : {
                        "user_id": seller_id,
                    },
                    "to": {
                        "user_id" : user_id
                    },
                    "text": "Aqui estão os anexos que fornecem informações detalhadas sobre o item em questão. Por favor, verifique os arquivos anexos para obter todos os esclarecimentos necessários sobre o produto.",
                    "attachments": [id]
                };
                
                try {
                    
                    if (!sentMessages.includes(orders_id) && !ids2.includes(orders_id)) {
                        const response = await axios.post(`https://api.mercadolibre.com/messages/packs/${orders_id}/sellers/${seller_id}?tag=post_sale`, data, {headers: headers});

                        sentMessages.push(orders_id);

                        await docorder.update({ ids2: [...ids2, orders_id] });
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        res.status(200).send('ok');
                      }
                } catch (error) {

                    console.error('Erro na solicitação:', error.message);
                    res.status(500).send(error);
                }
                res.status(200).send('ok');
            }catch (error){
                console.error('Erro na solicitação:', error.message);
                res.status(500).send(error);
                
            }   
        }    

    res.status(200).send('ok');
    } catch (error) {
        console.error('Erro ocorreu:', error);
        res.status(500).send(error);
    }
};
