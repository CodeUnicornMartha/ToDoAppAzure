import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { CreateTodoRequest } from './requests/CreateTodoRequest'
import { createtodo } from './DataLayer/ToDoAccess'
import * as uuid from 'uuid'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
    
    //begin Create (AWS)

    const newTodo: CreateTodoRequest = JSON.parse(req.body)
    //include ToDoTable in ARM Template -> process.env
    const ToDoTable = process.env.ToDo_TABLE
    const userId = "1"
    //getuserId(event)
    const todoId = uuid.v4()
    //logger.info("key", todoId)
    // const newTodoitem = await createtodo(userId, newTodo, todoId)
    const newTodoitem = await createtodo(userId, newTodo, todoId)
    let statusCode = 201
        if (!newTodoitem) {
            console.log("Unable to create To Do")
            statusCode = 404
        } else {
            console.log("CreateItem succeeded:")
        }
        console.log("newTodoitem", newTodoitem)

    //end Create (AWS)
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            item: {
            todoId: todoId,
            TableName: ToDoTable,
            userId: userId,
            ... newTodoitem
            }
        })
        //body: responseMessage
    };

};

export default httpTrigger;