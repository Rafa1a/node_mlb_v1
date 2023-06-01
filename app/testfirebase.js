const admin = require('firebase-admin');

admin.initializeApp();

// Função de exemplo para pushar uma informação para o Cloud Firestore
exports.index = async (req, res) => {
  try {
    // Recupera os dados a serem pushados (substitua 'data' com seus próprios dados)
    /*const data = {
      nome: 'Exemplo',
      idade: 25,
      email: 'exemplo@example.com'
    };*/

    // Obtém uma referência para o documento desejado na coleção do Cloud Firestore
    const docRef = admin.firestore().collection('colecao').doc('documento');
    const snapshot = await docRef.get();
       // Acessa o objeto com os dados do documento
    const data = snapshot.data();

       // Acessa o valor do campo 'nome' do documento
    const nome = data.nome;

    // Insere os dados no documento
    //await docRef.set(data);

    console.log('Dados inseridos com sucesso no Cloud Firestore!');
    res.status(200).json({ message: 'Dados inseridos com sucesso no Cloud Firestore!', nome });
  } catch (error) {
    console.error('Erro ao inserir dados no Cloud Firestore:', error);
    res.status(500).send('Erro ao inserir dados no Cloud Firestore');
  }
};
