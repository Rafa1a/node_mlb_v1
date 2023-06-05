const axios = require('axios');

exports.messages = async (req, res, admin) => {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();     
    const dados = getdoc.data();
    const token = dados.access_token;

    const docorder = admin.firestore().collection('allnec').doc('orders_id');
    const getdo = await docorder.get();    
    const dado = getdo.data();
    let ids = dado.ids;
    let ids2 = dado.ids2

    const docpdf = admin.firestore().collection('allnec').doc('pdf_id');
    const getpdf = await docpdf.get();    
    const dadopdf = getpdf.data();
    const id = dadopdf.id;
    
    let i = 0; // Índice para percorrer o array ids
    
    while (i < ids.length) {
        if (!ids2.includes(ids[i])) {
            const orders_id = ids[i];

            const headers1 = {
                'Authorization': `Bearer ${token}`,
            };
            
            try {
                const responseorders = await axios.get(`https://api.mercadolibre.com/orders/${orders_id}`, { headers: headers1 });
                const resultadoorders = responseorders.data;
                const MLB = resultadoorders.order_items[0].item.id;
                const user_id = resultadoorders.buyer.id;
                const seller_id = resultadoorders.seller.id;

                if (MLB == 'MLB3337547121' || MLB == 'MLB3337991729') {
                    if (ids2.includes(orders_id)) {
                        // O orders_id já está presente em ids2, então não enviamos a mensagem novamente
                        i++; // Pula para a próxima iteração

                    }

                    const headers = {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    };

                    const data = {
                        "from": {
                            "user_id": seller_id,
                        },
                        "to": {
                            "user_id": user_id
                        },
                        "text": "Aqui estão os anexos que fornecem informações detalhadas sobre o item em questão. Por favor, verifique os arquivos anexos para obter todos os esclarecimentos necessários sobre o produto.",
                        "attachments": [id]
                    };

                    try {
                        const response = await axios.post(`https://api.mercadolibre.com/messages/packs/${orders_id}/sellers/${seller_id}?tag=post_sale`, data, { headers });

                        if (ids2.length > 10) {
                            ids2.shift();
                            await docorder.update({ ids2: [...ids2, orders_id] });
                        }else {
                            await docorder.update({ ids2: [...ids2, orders_id] });
                        }

                        ids.splice(i, 1);
                        await docorder.update({ ids: ids });
                        
                        res.status(200).send('ok');

                    } catch (error) {
                        i++;
                        console.error('Erro na solicitação:', error.message);
                        res.status(500).send(error);
                    }
                
                } else {
                    i++
                    res.status(200).send('ok');
                }

            } catch (error) {
                i++;
                console.error('Erro na solicitação:', error.message);
                res.status(500).send(error);
                
            }

        }else {
            i++; // Avança para a próxima iteração
        }
        
    }
};
