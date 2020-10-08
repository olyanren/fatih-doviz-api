const config = require('./config.js');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update(config.aws_remote_config);

// Create the DynamoDB service object
const db = new AWS.DynamoDB({apiVersion: 'latest'});
exports.handler = function(e,ctx,callback) {
  let type = 'CURRENCY';


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


