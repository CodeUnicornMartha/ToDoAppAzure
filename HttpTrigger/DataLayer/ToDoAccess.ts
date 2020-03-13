import { CreateTodoRequest } from '../requests/CreateTodoRequest'
//import { createLogger } from '../utils/logger'
//import * as AWS  from 'aws-sdk'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
//import * as AWSXRAY from 'aws-xray-sdk'
const { CosmosClient } = require("@azure/cosmos");
//const logger = createLogger('DataLayer')
//const XAWS = AWSXRAY.captureAWS(AWS)
const endpoint = process.env.ToDoDBEndpoint
const key = process.env.ToDoDBKey
const databaseDefinition = process.env.databaseDefinition || "ToDoDB"

// ToDO -> Table API anschauen - Struktur -  Collection/Item - process.env - erstellen
// Cosmos DB mit Namen "ToDoDB" erstellen

export async function createtodo(userId: string, todo: CreateTodoRequest, todoId: string) {
    const client = new CosmosClient({ endpoint, key });
    const { database } = await client.databases(databaseDefinition);
    const timestamp = (new Date()).toISOString()
    const ToDoTable = process.env.ToDo_TABLE
    const newTodoitem = {
        userId: userId,
        createdAt: timestamp,
        todoId: todoId,
        name: todo.name,
        dueDate: todo.dueDate
      }
      console.log("newTodoitem", newTodoitem)
    const resultcreatedata = await client.create({
        TableName: ToDoTable,
        Item: newTodoitem      
      }).promise()
    console.log("resultcreate", resultcreatedata)
    return newTodoitem
}

export async function deletetodo(userId: string, todoId: string) {
    const client = new CosmosClient({ endpoint, key });
    const ToDoTable = process.env.ToDo_TABLE
    const Key = {
        todoId: todoId,
        userId: userId
        }
    console.log("Key", Key)
    const resultdeletedata = await client.delete({
        TableName: ToDoTable,
        Key: Key
      }).promise()
      console.log("resultdelete", resultdeletedata)

      return resultdeletedata
}

export async function gettodos(userId: string){
    const client = new CosmosClient({ endpoint, key });
    const ToDoTable = process.env.ToDo_TABLE
    const UserIdINDEX = process.env.UserIdINDEX
    const resultgetdata = await client.query({
        TableName: ToDoTable,
        IndexName: UserIdINDEX,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise()
      console.log("result", resultgetdata)
    
    return resultgetdata
}

export async function ToDoExists(todoId: string, userId: string) {
    const ToDoTable = process.env.ToDo_TABLE
    const client = new CosmosClient({ endpoint, key });
    const result = await client.get({
        TableName: ToDoTable,
        Key: {
          todoId: todoId,
          userId: userId
        }
      }).promise()
  
    console.log('Get ToDo: ', result)
    return !!result.Item
  }
/*
 export function getUploadUrl(todoId: string) {
    //const s3 = new XAWS.S3({ signatureVersion: 'v4'})
    const bucketName = process.env.ToDo_S3_BUCKET
    const urlExpiration = process.env.SIGNED_URL_EXPIRATION
    return s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: todoId,
      Expires: urlExpiration
    })
  }
  */

export async function updateuploadurl(todoId: string, userId: string){
    const ToDoTable = process.env.ToDo_TABLE
    const bucketName = process.env.ToDo_S3_BUCKET
    const client = new CosmosClient({ endpoint, key });
    const imageUrl =  `https://${bucketName}.s3.amazonaws.com/${todoId}`
    const resultuploadurldb = await client.update({
        TableName: ToDoTable,
        Key: {
          todoId: todoId,
          userId: userId
        },
        UpdateExpression: 'set uploadUrl = :uploadUrl',
        ExpressionAttributeValues: {
        ':uploadUrl': imageUrl
      },
      ReturnValues: "UPDATED_NEW"
      })
      .promise()
    console.log("resultuploadurldb", resultuploadurldb)
    return resultuploadurldb
}

export async function updatetodo( updatedTodo: UpdateTodoRequest, todoId: string, userId: string){
  const ToDoTable = process.env.ToDo_TABLE
  const client = new CosmosClient({ endpoint, key });
  const todoname = updatedTodo.name
  const done = updatedTodo.done
  const dueDate = updatedTodo.dueDate

  const resultupdatedata = await client.update({
    TableName: ToDoTable,
    Key: {
      todoId: todoId,
      userId: userId
    },
    UpdateExpression: 'set todoname = :todoname, done = :done, dueDate = :dueDate',
    ExpressionAttributeValues: {
      ':todoname': todoname,
      ':done': done,
      ':dueDate': dueDate

    },
    ReturnValues: "UPDATED_NEW"     
      
  }).promise();

  console.log("result", resultupdatedata)

  return resultupdatedata
  
}


  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06      
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-3193378732-1992673?contextType=room
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617/community:thread-2c214fc0-8307-11e9-8c0b-bb3f327e9dbb-1503309?contextType=room
  // https://winterwindsoftware.com/serverless-photo-upload-api/
  // https://github.com/BaineGames/udacity-nd9990-p5/tree/master/backend/src/lambda/http
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://stackoverflow.com/questions/7067966/why-doesnt-adding-cors-headers-to-an-options-route-allow-browsers-to-access-my
  // https://hub.udacity.com/rooms/community:nd9990:840125-project-617?contextType=room
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.06
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.03.html#GettingStarted.NodeJs.03.03
  // https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/s3-example-presigned-urls.html
  // https://serverless.com/plugins/serverless-plugin-tracing/
  // https://github.com/alex-murashkin/serverless-plugin-tracing
  // https://medium.com/@glicht/using-aws-x-ray-to-achieve-least-privilege-permissions-93dfd6701318
