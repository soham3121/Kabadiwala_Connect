// Text-to-Speech utility for low-literacy informal collectors
export const playSpeech = (text, lang = 'hi', onEnd = () => {}) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);

  // Set language
  if (lang === 'hi') {
    utterance.lang = 'hi-IN';
  } else if (lang === 'mr') {
    utterance.lang = 'mr-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95; // Slightly slower for low-literacy clarity
  utterance.pitch = 1.0;

  // Fallback voice selection if available
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes(lang));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = onEnd;
  utterance.onerror = (err) => {
    console.warn('Speech error:', err);
    onEnd();
  };

  window.speechSynthesis.speak(utterance);
};

export const stopSpeech = () => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
