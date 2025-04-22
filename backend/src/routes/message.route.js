import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import {getUsersForSidebar,getMessages,sendMessages} from '../controllers/message.controller.js';
import {translateText} from '../controllers/translateService.js';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();


router.get('/users', protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessages);

router.post('/translate', protectRoute, async (req, res) => {
    const { text, source } = req.body;
    let target_language;
    if(req.user.language == ""){
      target_language = "en";
    }
    else {
      target_language = req.user.language;
    }
    try {
      const translated = await translateText(text, target_language);
      res.json({ translatedText: translated, user_language :target_language});
    } catch (err) {
      res.status(500).json({ error: 'Translation failed.' });
    }
});
  



// for voice to text
router.post('/asr/voice_to_text', async (req, res) => {  
  const { base64 } = req.body; 
  const payload = {
    pipelineTasks: [
      {
        taskType: 'asr',
        config: {
          language: { sourceLanguage: 'mr' },
          serviceId: '',
          audioFormat: 'webm',
          samplingRate: 16000
        }
      }
    ],
    inputData: {
      audio: [
        {
          audioContent: base64
        }
      ]
    }
  };

  try {
    const response = await axios.post(
      'https://dhruva-api.bhashini.gov.in/services/inference/pipeline',
      payload,
      {
        headers: {
          'Accept': '*/*',
          'User-Agent': 'NodeBackend',
          'Authorization': process.env.BHASHINI_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('API Request Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to process audio' });
  }
});




// for text to voice
router.post("/tts/text_to_voice",async (req, res) => {
  const { text,user_language } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });
  const payload = {
    pipelineTasks: [
      {
        taskType: "tts",
        config: {
          language: { sourceLanguage: user_language },
          serviceId: "",
          gender: "female",
          samplingRate: 8000,
        },
      },
    ],
    inputData: {
      input: [{ source: text }],
    },
  };
  try {
    const response = await axios.post(
      "https://dhruva-api.bhashini.gov.in/services/inference/pipeline",
      payload,
      {
        headers: {
          Accept: "*/*",
          "User-Agent": "NodeBackend",
          Authorization: process.env.BHASHINI_API_KEY,
          "Content-Type": "application/json",
        },
        maxBodyLength: Infinity,
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("TTS Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch TTS audio." });
  }
});










export default router;