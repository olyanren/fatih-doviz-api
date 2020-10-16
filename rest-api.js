const config = require('./config.js');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update(config.aws_remote_config);

// Create the DynamoDB service object
const db = new AWS.DynamoDB({apiVersion: 'latest'});
const key = "f3cbfe15b941bb29a281fc3ef17b29b5";
const cryptLib = require('@skavinvarnan/cryptlib');
exports.handler = async (event) => {
  let type = null;
  if (event !== undefined && event.type != null) type = event.type;
  let params;
  if (type == null) {
    params = {
      TableName: config.aws_table_name,

    };
  } else {
    params = {
      TableName: config.aws_table_name,
      FilterExpression: 'contains (#Type, :post)',
      ExpressionAttributeNames: {
        "#Type": "Type",
      },
      ExpressionAttributeValues: {
        ":post": {S: type}
      }
    };
  }


  const awsRequest = await db.scan(params);
  try {
    const result = await awsRequest.promise();
    return {
      statusCode: 200,
      body:cryptLib.encryptPlainTextWithRandomIV(JSON.stringify(result.Items),key)
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e.code + ": " + e.message
    };
  }

}