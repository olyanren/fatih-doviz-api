'use strict';
var AWS = require("aws-sdk");
require('./patch.js');
const ddb = new AWS.DynamoDB.DocumentClient();
let send=undefined;
exports.handler = (event, context, callback) => {
  console.log(event);
  init()
  getConnections().then((data) => {
    console.log(data.Items);
    data.Items.forEach(function (connection) {
      console.log("Connection " + connection.ConnectionId)
      event.Records.forEach((record) => {
        send(connection.ConnectionId, JSON.stringify(record));
      });

    });
  });

  callback(null, `Successfully processed ${event.Records.length} records.`);
};

function init() {
  const apigwManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: 'ih01327n49.execute-api.us-east-2.amazonaws.com' + '/' + 'production'
  });
  send = async (connectionId, data) => {
    await apigwManagementApi.postToConnection({ConnectionId: connectionId, Data: `Echo: ${data}`}).promise();
  }
}
function getConnections() {
  return ddb.scan({TableName: 'ChatUsers',}).promise();
}