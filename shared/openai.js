import { Configuration, OpenAIApi } from "openai";

export class OpenAI {
  client;

  constructor() {
    this.client = new OpenAIApi(new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    }));
  }

  async generatePostTitle(prompt) {
    try {
      const completion = await this.client.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: 'user',
          content: prompt,
        }],
        temperature: 1,
        max_tokens: 3000,
      });

      return completion
        .data
        .choices[0]
        .message
        .content
        .replace(/[\n]/g, '')
        .replace(/(^['"]|['"]$)/g, '');
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      // console.log(error.config);
    }
  }

  async generatePostContent(title) {
    try {
      const completion = await this.client.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          { role: 'user', content: `Escribe un post de unas 500 palabras sobre ${title}` },
        ],
        temperature: 1,
        max_tokens: 4000,
      });

      return completion
        .data
        .choices[0]
        .message
        .content;
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      // console.log(error.config);
    }
  }
}
