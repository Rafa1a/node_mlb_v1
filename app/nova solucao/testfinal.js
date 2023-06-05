
const admin = require('firebase-admin');
admin.initializeApp();

exports.index = async (req, res) => {
    const docorder = admin.firestore().collection('allnec').doc('orders_id');
    const getdo = await docorder.get();    
    const dado = getdo.data();
    const ids = dado.ids;
    const ids2 = dado.ids2;
    if (ids.length > 0) {
        ids.shift();
        await docorder.update({ ids: ids});
    }
    return
};
