const config = require('./config.js');
let AWS = require('aws-sdk');
// Set the region
AWS.config.update(config.aws_remote_config);

// Create the DynamoDB service object
var db = new AWS.DynamoDB({apiVersion: 'latest'});
module.exports.getItem = (req, res) => {
  let type = 'CURRENCY';

  if (req.query.type !== undefined) type = req.query.type;

  var params = {
    TableName: config.aws_table_name,
    FilterExpression: 'contains (#Type, :post)',
    ExpressionAttributeNames: {
      "#Type": "Type",
    },
    ExpressionAttributeValues: {
      ":post"  : {S: type}
    }
  };

  var count = 0;

  db.scan(params, function (err, data) {
    if(data==null)return;
    data.Items.forEach(function(item) {
      console.log("Item :", ++count,JSON.stringify(item));
    });
  });

}

function putItem() {
  var params = {
    TableName: 'Currencies',
    Item: {
      'CUSTOMER_ID': {N: '001'},
      'CUSTOMER_NAME': {S: 'Richard Roe'}
    }
  };
  // Call DynamoDB to add the item to the table
  ddb.putItem(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Success", data);
    }
  });
}
