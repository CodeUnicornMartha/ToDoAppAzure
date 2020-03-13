import { AzureFunction, Context, HttpRequest } from "@azure/functions";

/// ##### edwin's junk start  ##### //
import * as uuid from "uuid/v1";

/// faking it via https://www.npmjs.com/package/@azure/cosmos

const { CosmosClient } = require("@azure/cosmos");

const endpoint = "https://edwinsqlcosmos.documents.azure.com:443/"; // Add your endpoint
const key =
  "ZFLeWLECsyHYuj4f9y3xFXfaiS6PL1d7CfcNgSlIClzNiBfHe9AVxtLQmQeTkbZNkXxOViqfBq3ta42l3P2Y2A==";
const client = new CosmosClient({ endpoint, key });

const databaseDefinition = { id: "sample database" };
const collectionDefinition = { id: "sample collection" };
const documentDefinition = { id: "hello world doc", content: "Hello World!" };

/// ##### edwin's junk end  ##### //

const httpTrigger: AzureFunction = async function(
  context: Context,
  req: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");
  // TODO: Add some object validation logic &
  //       make sure the object is flat
  if (req.body) {
    const item = req.body;
    item["PartitionKey"] = "Partition";
    item["RowKey"] = uuid();

    const { database } = await client.databases.create(databaseDefinition);
    console.log("created database");

    const { container } = await database.containers.create(
      collectionDefinition
    );
    console.log("created collection");

    const { resource } = await container.items.create(documentDefinition);
    console.log("Created item with content: ", resource.content);
  } else {
    context.res = {
      status: 400,
      body: "Please pass an item in the request body"
    };
    context.done();
  }

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: "done"
  };
};

export default httpTrigger;