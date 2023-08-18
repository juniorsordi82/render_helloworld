var XLSX = require("xlsx");
let fs = require("fs");
var request = require('request');

async function convertToFIMSTemplate(fileName, infos) {
    var workbook = XLSX.readFile("./uploads/" + fileName);
    var sheet_name_list = workbook.SheetNames;
    var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    let writeStream = "";
    let json = [];
    sheetData.map(function (line) {
        
        writeStream += 'H;' + ';;' + infos.airWaybill +';' + line.order + ';' + line.firstName + ' ' + line.lastName + ';;' + line.address1 + ';' + ';' + ';;' + line.city + ';' + line.state + ';' 
            + line.postalCode + ';' + line.country + ';' + line.phoneNumber + ';;' + 'R;' + 'x;' + infos.labelType + ';' + '1;' + ';' + ';' + ';' + ';' + "\n";
        
        let jsonItem = {
            commodities: [],
            order: line.order,
            name: line.firstName + " " + line.lastName,
            address1: line.address1,
            city: line.city,
            state: line.state,
            postalCode: line.postalCode,
            country: line.country,
            phoneNumber: line.phoneNumber,
            info: infos
        };

        if (line['product0 name']) {
            let weight = (line['product0 weight'] ? line['product0 weight'] : 0);
            writeStream += `D;${line['product0 name']};${line['product0 price']};${weight};875591234567;US;\n`;

            jsonItem.commodities.push({ name: line['product0 name'], weight: weight, price: line['product0 price'], tarif: '875591234567' });
        }
        if (line['product1 name']) {
            let weight = (line['product1 weight'] ? line['product0 weight'] : 0);
            writeStream += `D;${line['product1 name']};${line['product1 price']};${weight};875591234567;US;\n`;
            jsonItem.commodities.push({ name: line['product1 name'], weight: weight, price: line['product1 price'], tarif: '875591234567' });
        }
        if (line['product2 name']) {
            let weight = (line['product2 weight'] ? line['product2 weight'] : 0);
            writeStream += `D;${line['product2 name']};${line['product2 price']};${weight};875591234567;US;\n`;
            jsonItem.commodities.push({ name: line['product2 name'], weight: weight, price: line['product2 price'], tarif: '875591234567' });
        }
        if (line['product3 name']) {
            let weight = (line['product3 weight'] ? line['product3 weight'] : 0);
            writeStream += `D;${line['product3 name']};${line['product3 price']};${weight};875591234567;US;\n`;
            jsonItem.commodities.push({ name: line['product3 name'], weight: weight, price: line['product3 price'], tarif: '875591234567' });
        }

        json.push(jsonItem);
    });
    let csvFilename = infos.custCode + "_" + Date.now() + ".csv"
    fs.writeFile("./public/CSV/" + csvFilename, writeStream, (err) => { console.log(err || "done"); });

    return {
        CSV: csvFilename,
        data: json
    }
}

async function sendCreateLabelRequest(item) {
    // define soap params
    return soapTestXML(item);
    const params = {
        host: 'https://www.shipfims.com',
        path: '/pkgFedex3Beta/pkgFormService',
        wsdl: '/pkgFedex3Beta/schemas/pkgFormService.wsdl',

        // set soap headers (optional)
        headers: [{
            'name': 'item_name',
            'value': 'item_value',
            'namespace': 'item_namespace'
        }]
    };

    let requestLabel = {
        "custCode": "656565656",
        "serviceId": "CE9VKZ6PLX4S2RH",
        "labelSource": "42",
        "responseFormat": "P",
        "labelSize": "6",
        "airWaybill": "888888888888",
        "shipperReference": item.order,
        "labelType": "51",
        "declaration": "X",
        "consignee": {
            "name": item.name,
            "company": "",
            "address1": item.address1,
            "address2": "",
            "address3": "",
            "preCode": "",
            "city": item.city,
            "state": item.state,
            "zipCode": item.postalCode,
            "country": item.country,
            "phone": item.phoneNumber,
            "email": "",
            "taxNo": ""
        },
        "commodities": []
    };

    var temp1 = {}
    var xml = "{";
    var length = item.commodities.length-1;
    var i = 0;
    item.commodities.map(function(comodity) {
        var com = {
            "description": comodity.name,
            "value": comodity.price,
            "currency": "USD",
            "weight": (comodity.weight > 0 ? comodity.weight : "0.06"),
            "tariffNo": comodity.tarif,
            "originCountry": "US"
        };
        
        //temp1 = Object.assign(temp1, com);
        //requestLabel.commodities = { commodity: temp1 };
        xml += `
            "commodity": {
                "description": "${comodity.name}",
                "value": "${comodity.price}",
                "currency": "USD",
                "weight": "${(comodity.weight > 0 ? comodity.weight : "0.06") }",
                "tariffNo": "${comodity.tarif}",
                "originCountry": "US"
            }`;
        if(i < length) {
            xml += ",";
        }
        /*
        requestLabel.commodities = Object.assign( { "commodity": {
            "description": comodity.name,
            "value": comodity.price,
            "currency": "USD",
            "weight": (comodity.weight > 0 ? comodity.weight : "0.06"),
            "tariffNo": comodity.tarif,
            "originCountry": "US"
        }});
        //*/
        i++;
    });

    xml += "}";
    console.log(xml);
    var tempJson = JSON.parse(xml);
    console.log(tempJson);
    
    /*
        "commodity": {
                "description": "2-IN-1 WIRE CUTTER / STRIPPER 000000 00000 00000 000000 000 0000 0000 0000 0000 2-IN-1 WIRE CUTTER / STRIPPER 000000 00000 00000 000000 000 0000 0000 0000 0000",
                "value": "19.99",
                "currency": "USD",
                "weight": "0.06",
                "tariffNo": "8203.20.60",
                "originCountry": "TW"
            }
    */

    return requestLabel;
    var soapClient = EasySoap(params);
    /*
    
    soapClient.getAllFunctions()
        .then((functionArray) => { console.log(functionArray); })
        .catch((err) => { throw new Error(err); });

    soapClient.getMethodParamsByName('pkgFormService')
        .then((methodParams) => {
            console.log(methodParams.request);
            console.log(methodParams.response);
        })
        .catch((err) => { throw new Error(err); });
    //*/

    /*
     * call soap method
     */
    return await soapClient.call({
        method: 'pkgFormService',
        attributes: {
            xmlns: 'http://schemas.xmlsoap.org/soap/envelope/'
        },
        params: {
            "labelRequest": requestLabel
        }
    }) .then((callResponse) => {
            let temp = callResponse.data;
            let returnData = {
                tracking: temp.parcelId,
                label: temp.attached_label,
                fedex_code: temp.trackingNo,
                pdf: temp.parcelId + ".pdf"
            };
            var buf = Buffer.from(temp.attached_label, 'base64');
            // Your code to handle buffer
            fs.writeFile('./public/labels/' + temp.parcelId +".pdf", buf, error => {
                if (error) {
                    throw error;
                } else {
                    console.log('buffer saved!');
                }
            });
            return returnData;
            //console.log(callResponse.data);	// response data as json
            //console.log(callResponse.body);	// response body
            //console.log(callResponse.header);  //response header
        })
        .catch((err) => { throw new Error(err); });
    //*/
}

async function saveLabelPDF(base64, parcelId) {
    var buf = Buffer.from(base64, 'base64');
    fs.writeFile('./public/labels/' + parcelId + ".pdf", buf, error => { if (error) { throw error; } });
}

async function saveXML(xml, filename) {
    var buf = Buffer.from(xml);
    fs.writeFile('./public/labels/' + filename + ".xml", buf, error => { if (error) { throw error; } });
}

async function soapTestXML(item, res) {
    /*
    const xmlFile = fs.readFileSync('test.xml', 'utf8');
    //console.log(xmlFile);
    const string = xmlFile;
    const regex = /<parcelId>(.*)<\/parcelId>/g

    let matches = string.match(regex);
    let parcelId = matches[0].replace("<parcelId>", "").replace("</parcelId>", "");
    let trackingNo = string.match(/<trackingNo>(.*)<\/trackingNo>/g)[0].replace("<trackingNo>", "").replace("</trackingNo>", "");
    let label = string.match(/<attached_label>(.*)<\/attached_label>/g)[0].replace("<attached_label>", "").replace("</attached_label>", "");

    saveLabelPDF(label, parcelId);
    
    return [];//*/
    ///
    var params = {
        host: 'https://www.shipfims.com',
        path: '/pkgFedex3Beta/pkgFormService',
        wsdl: '/pkgFedex3Beta/schemas/pkgFormService.wsdl',
    }
    const WSDL = params.host + params.wsdl;
    
    const url = WSDL;
    const headers = {
        'Content-Type': 'application/soap+xml;charset=UTF-8',
        'soapAction': '/pkgFedex3Beta/pkgFormService',
    };
    // example data
    let commodities = "";
    item.commodities.map(function (comodity) {
        commodities += `<commodity>
            <description>${comodity.name}</description>
            <value>${comodity.price}</value>
            <currency>USD</currency>
            <weight>${(comodity.weight > 0 ? comodity.weight : "0.06") }</weight>
            <tariffNo>${comodity.tarif}</tariffNo>
            <originCountry>US</originCountry>
        </commodity>`;
    });

    let info = item.info;

    const xml = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
   <soapenv:Header/>
   <soapenv:Body>
      <labelRequest>
         <custCode>${info.custCode}</custCode>
         <serviceId>${info.serviceId}</serviceId>
         <labelSource>42</labelSource>
         <responseFormat>P</responseFormat>
         <labelSize>6</labelSize>
         <parcelId></parcelId>
         <airWaybill>${info.airWaybill}</airWaybill>
         <shipperReference>${item.order}</shipperReference>
         <labelType>${info.labelType}</labelType>
         <declaration>X</declaration>
         <pkgWeight>0.06</pkgWeight>
         <pkgLength>6</pkgLength>
         <pkgWidth>4</pkgWidth>
         <pkgHeight>4</pkgHeight>
         <consignee>
            <name>${item.name}</name>
            <address1>${item.address1}</address1>
            <address2></address2>
            <address3></address3>
            <city>${item.city}</city>
            <state>${item.state}</state>
            <zipCode>${item.postalCode}</zipCode>
            <country>${item.country}</country>
            <phone>${item.phoneNumber}</phone>
         </consignee>
         <commodities>
            ${commodities}
         </commodities>
      </labelRequest>
   </soapenv:Body>
</soapenv:Envelope>
`;
    //saveXML(xml, Date.now() + "-" + item.order);

    var options = {
        url: 'https://www.shipfims.com/pkgFedex3Beta/pkgFormService',
        method: 'POST',
        body: xml,
        headers: {
            'Content-Type': 'text/xml;charset=utf-8',
            'Accept-Encoding': 'gzip,deflate',
            'Content-Length': xml.length,
            'SOAPAction': "pkgFormService"
        }
    };

    let callback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
            //console.log('Raw result', body);
            const string = body;
            const regex = /<parcelId>(.*)<\/parcelId>/g

            let matches = string.match(regex);
            console.log(matches)
            let parcelId = matches[0].replace("<parcelId>", "").replace("</parcelId>", "");
            let trackingNo = string.match(/<trackingNo>(.*)<\/trackingNo>/g)[0].replace("<trackingNo>", "").replace("</trackingNo>", "");
            let label = string.match(/<attached_label>(.*)<\/attached_label>/g)[0].replace("<attached_label>", "").replace("</attached_label>", "");

            saveLabelPDF(label, parcelId);
            let respJson = {
                tracking: parcelId,
                label: label,
                fedex_code: trackingNo,
                pdf: parcelId + ".pdf"
            };
            res.status(200).json({ success: true, data: respJson });
        };
        //console.log('E', response.statusCode, response.statusMessage);
    };
    request(options, callback);
}

module.exports = {
    convertToFIMSTemplate,
    sendCreateLabelRequest,
    soapTestXML,
}