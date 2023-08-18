const db = require("../infra/database");
const EasySoap = require('easysoap');


async function generateFIMSLabel(idEmpresa) {
    // define soap params
    const params = {
        host: 'www.sample.com',
        path: '/path/soap/',
        wsdl: '/path/wsdl/',

        // set soap headers (optional)
        headers: [{
            'name': 'item_name',
            'value': 'item_value',
            'namespace': 'item_namespace'
        }]
    }

    /*
     * create the client
     */
    var soapClient = EasySoap(params);
    soapClient.getAllFunctions()
        .then((functionArray) => { console.log(functionArray); })
        .catch((err) => { throw new Error(err); });
}

module.exports = {
    generateFIMSLabel
}