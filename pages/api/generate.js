import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const coordinate = req.body.coordinate || '';
  const feeling = req.body.feeling || 'curious';
  const profession = req.body.profession || 'student';
  if (coordinate.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid coordinate",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePromptGPS(coordinate, feeling, profession),
      temperature: 0.4,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic 
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}


function generatePromptGPS(myLatLong, feeling, profession) {
  return `I am a ${profession} visiting a new town. I am currently at the following coordinates: ${myLatLong}. Right now I am feeling ${feeling}.
  Please describe a historical event, monument, geological feature or other interesting place that would be interesting to me to visit, within a 10 min walk.
  Please answer just the name of the event, monument, or place.`
}

