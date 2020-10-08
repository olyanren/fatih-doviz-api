const config = require('./config.js');
const AWS = require('aws-sdk');
// Set the region
AWS.config.update(config.aws_remote_config);

// Create the DynamoDB service object
const db = new AWS.DynamoDBStreams({apiVersion: 'latest'});
exports.handler = async (event) => {
  let lastEvaluatedShardId = null;

  let params = {
    "ExclusiveStartShardId": null,
    "Limit": 100,
    "StreamArn": config.aws_stream_arn
  };
  const describeStreamResult = await db.describeStream(params).promise();
  do {
    let shards = describeStreamResult.StreamDescription.Shards;
    let shardIndex=0;
    for (const shard of shards) {
      let params = {
        "ShardId": shard.ShardId,
        "ShardIteratorType": "TRIM_HORIZON",
        "StreamArn": config.aws_stream_arn
      };
      let processedRecordCount = 0;
      let maxItemCount = 100;
      const shardIterator = await db.getShardIterator(params).promise();
      let currentShardIter = shardIterator.ShardIterator;
      while (currentShardIter !== "undefined" && currentShardIter !== undefined && processedRecordCount < maxItemCount) {

        let params = {
          "ShardIterator": currentShardIter
        };
        let recordData = await db.getRecords(params).promise();
        currentShardIter = recordData.NextShardIterator;

        for (let item of recordData.Records) {
          console.log(JSON.stringify(item));
        }
        processedRecordCount += recordData.Records.length;

      }
      console.log("Shard index: "+(shardIndex++));
    }
    lastEvaluatedShardId = describeStreamResult.StreamDescription.LastEvaluatedShardId;
    console.log(lastEvaluatedShardId);
  } while (lastEvaluatedShardId !== null && lastEvaluatedShardId !== undefined);
  console.log("Finished");
}