import { config } from "dotenv"
config()
//.env file contains Openai API Key as API_KEY
import { Configuration, OpenAIApi } from "openai"
import readline from "readline"

const openAi = new OpenAIApi(   //New openai object
  new Configuration({
    apiKey: process.env.API_KEY,  //API_KEY is stored in .env file
  })
)

//We will create userInterface to get input in console
const userInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
//Take input and store in "input"
userInterface.prompt()
userInterface.on("line", async input => {
  const response = await openAi.createChatCompletion({    //createChatCompletion method to get response from openai
    model: "gpt-3.5-turbo",   //Version of openai chatgpt
    messages: [{ role: "user", content: input }],   //content : input which will sent to openai
  })
  //console.log(input)
  console.log(response.data.choices[0].message.content)
  userInterface.prompt()    //take input continuoiusly from users
})