
const FormData = require('form-data');
const axios = require('axios');

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();
const bucketName = 'gcf-sources-909553356548-us-central1';
const fileName = 'allnecpdfs/com_certificado.jpeg';


exports.pdfpost = async (req, res, admin) => {
  try {
    // Recuperar tokens do Firestore
    const docRef = admin.firestore().collection('allnec').doc('code_tokens');
    const getDoc = await docRef.get();
    const dados = getDoc.data();
    const token = dados.access_token;

    const docpdf = admin.firestore().collection('allnec').doc('pdf_id');
    // Recuperar o arquivo PDF do Google Cloud Storage
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(fileName);

    // Fazer o download do arquivo PDF
    const [fileContent] = await file.download();

    // Criar um objeto FormData para enviar o arquivo
    const formData = new FormData();
    formData.append('file', fileContent, 'com_certificado.jpeg');

    // Configurar a solicitação POST para o Mercado Livre
    const url = 'https://api.mercadolibre.com/messages/attachments?tag=post_sale&site_id=MLB';
    const headers = {
      'Authorization': `Bearer ${token}`,
      'content-type': 'multipart/form-data'
    };

    // Enviar a solicitação POST
    const response = await axios.post(url, formData, { headers });
    
    //salvar id no banco de dados
    const resultado = response.data
    const data = {
        id : resultado.id
    }
    
    docpdf.set(data)

    // Processar a resposta
    console.log('Resposta:', resultado);
    res.status(200).send('Arquivo PDF enviado com sucesso para o Mercado Livre');
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).send(error);
  }
};
