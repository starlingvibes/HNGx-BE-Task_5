const axios = require('axios');
const FormData = require('form-data');

const upload = async (req, res) => {
  const { url } = req.body;
  const apiKey = process.env.WHISPER_API_KEY;
  const apiUrl = process.env.WHISPER_API_URL;
  let data = new FormData();
  try {
    if (!url) {
      throw new Error('Please provide a URL');
    }
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `Could not transcribe file - ${error.message}`,
      data: null,
    });
  }

  try {
    data.append('url', url);

    let config = {
      method: 'POST',
      maxBodyLength: Infinity,
      url: apiUrl,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        return res.status(200).json({
          status: 'success',
          message: 'Transcription successful',
          data: {
            transcription: response.data,
          },
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(400).json({
          status: 'error',
          message: `Could not transcribe the file - ${error.message}`,
          data: null,
        });
      });
  } catch (error) {
    return res.status(400).json({
      status: 'error',
      message: `Could not transcribe the file - ${error.message}`,
      data: null,
    });
  }
};

export { upload };
