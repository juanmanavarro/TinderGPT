require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
var CronJob = require('cron').CronJob;
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const spanishDateApps = [
  'Tinder',
  'Badoo',
  'Meetic',
  'Bumble',
  'AdoptaUnChico',
  'Happn',
  'OkCupid',
  'POF',
  'eDarling',
  'Lovoo',
  'Hinge',
  'Grindr',
];

const randomDateApp = () => {
  const randomIndex = Math.floor(Math.random() * spanishDateApps.length);
  return spanishDateApps[randomIndex];
};

console.log(randomDateApp());

const generatePostTitle = async () => {
  try {
    const response = await axios.get(`${process.env.WP_URL}/posts`, {
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
      messages: [{
        role: 'user',
        content: `Dame el titulo para un post de un blog sobre la aplicacion de citas ${randomDateApp()}, que sea totalmente diferente a cualquiera de estos: ${lastTitles}`
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
    const { status } = await axios.post(`${process.env.WP_URL}/posts/new`, {
      title,
      content,
    }, {
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

// test dev
(async () => {
  const title = await generatePostTitle();
  console.log(title);
  // const content = await generatePostContent(title);
  // console.log(content);
  // const status = await publish(title, content);
})()
