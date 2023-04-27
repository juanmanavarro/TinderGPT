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
      console.log(error);
    }
  }

  async generatePostContent(title) {
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
  }
}
