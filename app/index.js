const per = require('./permissao');
const env = require('./posvenda');


const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
  try {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();
    const dados = getdoc.data();

    const code = dados && dados.code ? dados.code : '';
  
    if (!code) {
      per.permissao(req, res, admin);
    } else {
      if (req.body.topic === 'orders_v2') {
        res.status(200).send('ok')
        env.enviar(req, res, admin);
      }else{
        res.status(200).send('ok')
      }
    }
  } catch (error) {
    console.error('Erro ao executar a função:', error);
    res.status(500).send('Erro ao executar a função');
  }
};
