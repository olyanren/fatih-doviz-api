console.log('Giriş yapıldı');
const parser= require('node-html-parser');

const https = require('https');

const config = require('./config.js');
const AWS = require('aws-sdk');
// Set the region
//AWS.config.update(config.aws_remote_config);

// Create the DynamoDB service object
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler  = function(event, context, callback) {
  console.log('Received event:', JSON.stringify(event, null, 2));
  let type = 'doviz';
  if (event !== undefined && event.type != null) type = event.type;
  console.log("Type:" +type);
  var options = {
    host: config.crawler_url,
    path: '/'+type,
  }
  const request = https.request(options, function (res) {
    let data = '';
    res.on('data', function (chunk) {
      data += chunk;
    });
    console.log('Data: '+data);
    res.on('end', function () {
      const root = parser.parse(data)
      let rows = root.querySelector('.portfolio tbody').childNodes;
      let count=1;
      let typeForAmazon='CURRENCY';
      switch (type) {
        case 'doviz':
          typeForAmazon = 'CURRENCY';
          break;
        case 'altin':
          typeForAmazon = 'GOLD';
          break;
        case 'hisse-senedi':
          typeForAmazon = 'EXCHANGE';
          break;
        case 'kripto-para':
          typeForAmazon = 'COIN';
          break;
        case 'parite':
          typeForAmazon = 'PARITIES';
          break;
        case 'emtia':
          typeForAmazon = 'COMMODITIES';
          break;
        case 'endeks':
          typeForAmazon = 'INDEXES';
          break;
      }

      rows.forEach(row => {
        if (row.childNodes.length === 7) {
          let code = row.childNodes[0].querySelector('h3 a').childNodes[0].rawText
          let buying = row.childNodes[1].querySelector('span span').childNodes[0].rawText
          let selling = row.childNodes[2].querySelector('span span').childNodes[0].rawText
          let smallest = row.childNodes[3].querySelector('span span').childNodes[0].rawText
          let largest = row.childNodes[4].querySelector('span span').childNodes[0].rawText
          let difference = row.childNodes[5].querySelector('span span').childNodes[0].rawText

          const params = {
            TableName: config.aws_table_name,
            Key: {
              "Code": code,
              "Type":typeForAmazon+'-'+count++
            },
            UpdateExpression: "set Buying = :buying, Selling = :selling, Difference = :difference, Smallest = :smallest, Largest = :largest",

            ExpressionAttributeValues: {
              ":buying": buying,
              ":selling": selling,
              ":difference": difference.replace('%',''),
              ":smallest": smallest,
              ":largest":largest
            }
          };
          docClient.update(params, function(err, data) {
            if (err) console.log(err);
            else console.log(data);
          });


        }
      });
    });
  });
  request.on('error', function (e) {
    console.log(e.message);
  });
  request.end();
}