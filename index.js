const AWS = require('aws-sdk');
const { response } = require('express');
const { v4: uuidv4 } = require("uuid");
const { logStream } = require('./Stream-Service-API/newStreamLog');

AWS.config.update({
    region:'eu-west-1' //region 
});

const DynamoDB = new AWS.DynamoDB.DocumentClient(options);//
const dynamodbTableName = 'UserStreams';//database table name


//path names
const streamPath = '/stream';//checks user stream
const removeStreamPath = '/removeStream';//deletes  the streams after

//defines our handler function for lambda
exports.handler = async function(event) {
    console.log('Request event:',event);

    //resonpds to the APIGATEWAY
    let response;
    //handle different request in a switch statement
    switch(true) {
        
        //i am just creating cases here to maatch with methods i defined in the API gateway
        case event.httpMethod ==='POST' && event.path === streamPath:
        response = await checkStream(JSON.parse(event.body).streamId);

        break;

        case event.httpMethod === 'DELETE' && event.path === removeStreamPath:
        response = await deleteStream(JSON.parse(event.body.streamId));
        break;
        default:
            response = buildResponse(404,'404 Not Found');
    }
    return response;


    }

//defines the functions
 function buildResponse(statusCode,body) {
    return{
        statusCode : statusCode,
        Headers :{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}

 async function checkStream (event, context, callback)  {
    const requestBody = JSON.parse(event.body);
  
    const params = {
      TableName: userStreams,
      ProjectionExpression: "#uid",
      FilterExpression: "#uid = :uid",
      ExpressionAttributeNames: {
        "#uid": "userId"
      },
      ExpressionAttributeValues: {
        ":uid": requestBody.userId,
      },
    };
  
    const stream = {
      streamId: uuidv4(),
      userId: requestBody.userId,
    };
  
    if (!stream.userId) {
      callback(null, response(400, { error: "Request missing userId" }));
    } else {
      return db.scan(params, (error, data) => {
        if (data.Items.length < 3) {
          db.put({
            TableName: userStreams,
            Item: stream,
          })
            .promise()
            .then(() => {
              callback(null, response(201, stream));
            })
            .catch((error) => {
              callback(null, response(error.statusCode, { message: error }));
            });
        } else {
          callback(
            null,
            response(400, {
              error: "Unable to start a new stream, maximum limit reached",
            })
          );
        }
      });
    }
  }
  async function deleteStream(stream) {
      const params = {
    TableName: dynamodbTableName,
    Key: {
        'streamId': streamId
    },
    ReturnValues: 'ALL_OLD'
}
return await DynamoDB.delete(params).promise().then((response )=> {
    const body = {
        Operation: 'DELETE',
        Message: 'SUCCESS',
        Item: response
    }
    return buildResponse(200,body);
},(error) => {
console.error('Error deleting',error);
});
  }