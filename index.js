const AWS = require('aws-sdk');
AWS.config.update({
    region:'eu-west-1' //region 
});

const DynamoDB = new AWS.DynamoDB.DocumentClient();//
const dynamodbTableName = 'UserStreams';//database name

//path names
const streamPath = '/stream';//checks if the user is streaming more than one concurrently
const removeStream = '/removeStream';//deletes  the streams after

//defines our handler functionfor lambda
exports.handler = async function(event) {
    console.log('Request event:',event);

    //resonpds to the APIGATEWAY
    let response;
    //handle different request in a switch statement
    switch(true) {
        //first case handle UserStream check
        case event.httpMethod ==='POST' && event.path === streamPath;
        response = buildResponse(201);
        break;


    }

}
//defins the funstions
