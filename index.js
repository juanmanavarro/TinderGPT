require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");
const axios = require('axios');

(async () => {
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

  await axios.post(`https://public-api.wordpress.com/rest/v1.1/sites/${process.env.WP_URL}/posts/new`, {
    title: postTitleCompleition.data.choices[0].text,
    content: postCompleition.data.choices[0].text,
  }, {
    headers: {
      Authorization: `Bearer ${process.env.WP_API_TOKEN}`
    },
  });
})();
