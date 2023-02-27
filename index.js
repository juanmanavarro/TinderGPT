require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');
var CronJob = require('cron').CronJob;

new CronJob(
	'30 14 * * *',
	async () => {
    console.log('Executing script...');

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const postTitleCompleition = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: "dame el titulo para un post de un blog sobre la aplicacion de citas Tinder, sin comillas",
      temperature: 1,
      max_tokens: 4000,
    });

    const postCompleition = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `escribe un post de unas 500 palabras sobre ${postTitleCompleition.data.choices[0].text}`,
      temperature: 1,
      max_tokens: 4000,
    });

    const post = {
      title: postTitleCompleition.data.choices[0].text,
      content: postCompleition.data.choices[0].text,
    };

    console.log('Post', post);

    try {
      const { status } = await axios.post(`https://public-api.wordpress.com/rest/v1.1/sites/${process.env.WP_URL}/posts/new`, post, {
        headers: {
          Authorization: `Bearer ${process.env.WP_API_TOKEN}`
        },
      });

      console.log('Script executed: ', status);
    } catch (error) {
      console.log(error);
    }
  },
	null,
	true,
	'Europe/Madrid'
);
