import axios from 'axios';

export const translateText = async (text, targetLang = 'mr') => {
  try {
    const response = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: {
        client: 'gtx',
        sl: 'auto',
        tl: targetLang,
        dt: 't',
        q: text
      }
    });
    const translatedText = response.data[0]?.[0]?.[0] || '';
    return translatedText;
  } catch (error) {
    console.error('Translation API error:', error.message);
    throw error;
  }
};






