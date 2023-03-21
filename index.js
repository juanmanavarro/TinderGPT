require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
var CronJob = require('cron').CronJob;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generatePostTitle = async () => {
  try {
    const response = await axios.get(`https://public-api.wordpress.com/rest/v1.1/sites/${process.env.WP_URL}/posts`, {
      headers: {
        Authorization: `Bearer ${process.env.WP_API_TOKEN}`
      },
      params: {
        fields: 'title',
        number: 10,
      },
    });

    const lastTitles = response.data.posts.map(p => p.title).join(', ');

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'user', content: `Dame el titulo para un post de un blog sobre la aplicacion de citas Tinder, que sea totalmente diferente a cualquiera de estos; ${lastTitles}` },
      ],
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

const generatePostContent = async title => {
  const completion = await openai.createChatCompletion({
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

const publish = async (title, content) => {
  try {
    const { status } = await axios.post(`https://public-api.wordpress.com/rest/v1.1/sites/${process.env.WP_URL}/posts/new`, { title, content }, {
      headers: {
        Authorization: `Bearer ${process.env.WP_API_TOKEN}`
      },
    });

    return status;
  } catch (error) {
    console.log(error);
  }
}

new CronJob(
	'30 14 * * *',
	async () => {
    console.log('Executing script...');

    const title = await generatePostTitle();
    const content = await generatePostContent(title);

    const status = await publish(title, content);

    console.log('Script executed', status);
  },
	null,
	true,
	'Europe/Madrid'
);