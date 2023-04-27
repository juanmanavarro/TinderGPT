import axios from 'axios';

export class WpApi {
  client;

  constructor(prefix, url = '') {
    this.client = axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${process.env[`${prefix}WP_API_TOKEN`]}`
      },
    });
  }

  async getLastPostTitles() {
    try {
      const response = await this.client.get(`/posts`, {
        params: {
          fields: 'title',
          number: 10,
        },
      });

      return response.data.posts.map(p => p.title).join(', ');
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

  async publish(title, content) {
    try {
      const { status } = await this.client.post(`/posts/new`, {
        title,
        content,
      });
      return status;
    } catch (error) {
      console.log(error);
    }
  }
}
