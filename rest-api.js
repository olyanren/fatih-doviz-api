const config = require('./config.js');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update(config.aws_remote_config);

// Create the DynamoDB service object
const db = new AWS.DynamoDB({apiVersion: 'latest'});
exports.handler = async (event) => {
  let type = 'CURRENCY';
  if (event !== undefined && event.type != null) type = event.type;
  var params = {
    TableName: config.aws_table_name,
    FilterExpression: 'contains (#Type, :post)',
    ExpressionAttributeNames: {
      "#Type": "Type",
    },
    ExpressionAttributeValues: {
      ":post": {S: type}
    }
  };

  const awsRequest = await db.scan(params);
  try {
    const result = await awsRequest.promise();
    return {
      statusCode: 200,
      body: result.Items
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.code+": "+e.message
    };
  }

}