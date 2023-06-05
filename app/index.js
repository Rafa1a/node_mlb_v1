const per = require('./permissao');
const env = require('./posvenda');
const pdf = require('./pdf_post');
const msg = require('./messages');
const ref = require('./refresh');
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
  try {
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getdoc = await docRef.get();
    const dados = getdoc.data();

    const code = dados && dados.code ? dados.code : '';
    //id pdf
    const docpdf = admin.firestore().collection('allnec').doc('pdf_id');
    const getpdf = await docpdf.get();    
    const dadopdf = getpdf.data();
    const id = dadopdf.id;

    if (!code) {
      per.permissao(req, res, admin);
    } else {

      if (req.body.topic === 'orders_v2') {

        res.status(200).send('ok')
      // enviar mensagem posvenda primeira

        env.enviar(req, res, admin);

      }else if (req.body.topic === 'messages'){

        res.status(200).send('ok')
      //se nao tiver id pdf atualizar

        if (!id) {
          pdf.pdfpost(req, res, admin)
        }
      //enviar mensagem 

        msg.messages(req, res, admin)

      // tentativas igual 2 refreshtoken

        if (req.body.attempts === 2) {
          ref.refresh(req, res, admin);
        }
      }else {
        res.status(200).send('ok')
      }
    }
  } catch (error) {
    console.error('Erro ao executar a função:', error);
    res.status(500).send('Erro ao executar a função');
  }
};
