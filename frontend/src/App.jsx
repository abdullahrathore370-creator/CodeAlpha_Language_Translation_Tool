import { useState } from 'react';
import axios from 'axios';
import './App.css';

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const languages = [
  'English', 'Urdu', 'Arabic', 'French', 'German', 'Spanish',
  'Chinese', 'Hindi', 'Japanese', 'Korean', 'Turkish', 'Punjabi',
  'Pashto', 'Persian', 'Italian', 'Portuguese', 'Russian'
];

const voiceLanguages = {
  English: 'en-US',
  Urdu: 'ur-PK',
  Arabic: 'ar-SA',
  French: 'fr-FR',
  German: 'de-DE',
  Spanish: 'es-ES',
  Chinese: 'zh-CN',
  Hindi: 'hi-IN',
  Japanese: 'ja-JP',
  Korean: 'ko-KR',
  Turkish: 'tr-TR',
  Punjabi: 'pa-IN',
  Pashto: 'ps',
  Persian: 'fa-IR',
  Italian: 'it-IT',
  Portuguese: 'pt-PT',
  Russian: 'ru-RU'
};

function App() {
  const [text, setText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('English');
  const [targetLanguage, setTargetLanguage] = useState('Urdu');
  const [customSourceLanguage, setCustomSourceLanguage] = useState('');
  const [customTargetLanguage, setCustomTargetLanguage] = useState('');
  const [translation, setTranslation] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [notice, setNotice] = useState('');

  const actualSourceLanguage =
    sourceLanguage === 'Custom' ? customSourceLanguage.trim() : sourceLanguage;
  const actualTargetLanguage =
    targetLanguage === 'Custom' ? customTargetLanguage.trim() : targetLanguage;

  const handleTranslate = async () => {
    setNotice('');

    if (!text.trim()) {
      setNotice('Enter some text to translate.');
      return;
    }

    if (!actualSourceLanguage || !actualTargetLanguage) {
      setNotice('Please enter both custom language names.');
      return;
    }

    if (actualSourceLanguage.toLowerCase() === actualTargetLanguage.toLowerCase()) {
      setNotice('Please select two different languages.');
      return;
    }

    setLoading(true);
    setTranslation('');

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/translate', {
        text: text.trim(),
        source_language: actualSourceLanguage,
        target_language: actualTargetLanguage
      });
      setTranslation(response.data.translation || response.data.translated_text || 'No translation returned.');
    } catch (error) {
      console.error('Translation error:', error.response?.data || error.message);
      setNotice(
        error.response?.data?.error?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        'Translation failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  const startListening = () => {
    setNotice('');

    if (!SpeechRecognition) {
      setNotice('Speech recognition is not supported in this browser. Try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = voiceLanguages[sourceLanguage] || 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const spokenText = event.results?.[0]?.[0]?.transcript;
      if (spokenText) {
        setText((previous) => `${previous}${previous ? ' ' : ''}${spokenText}`.slice(0, 5000));
      }
    };
    recognition.onerror = () => {
      setNotice('Voice input failed. Please check microphone permission and try again.');
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setNotice('Microphone could not start. Please try again.');
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setCustomSourceLanguage(customTargetLanguage);
    setCustomTargetLanguage(customSourceLanguage);
    setText(translation);
    setTranslation(text);
    setNotice('');
  };

  const copyTranslation = async () => {
    if (!translation) return;

    try {
      await navigator.clipboard.writeText(translation);
      setNotice('Translation copied to clipboard.');
    } catch {
      setNotice('Could not copy. Please select and copy the text manually.');
    }
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Language Translator home">
          <span className="brand-icon">文</span>
          <span>Language Translator<span className="brand-dot">.</span></span>
        </a>
        <span className="topbar-label">
          <span className="status-dot" />
          LANGUAGE TRANSLATOR
        </span>
      </header>

      <section className="hero">
        <h1>Language Translator</h1>
        <p>Translate text between languages.</p>
      </section>

      <section className="translator">
        <div className="translator-heading">
          <div>
            <h2>Translator</h2>
            <p>Enter text and choose your languages.</p>
          </div>
        </div>

        <div className="translation-grid">
          <section className="language-panel input-panel">
            <div className="panel-top">
              <span className="panel-label">FROM</span>
              <span className="panel-index">01</span>
            </div>

            <select
              aria-label="Source language"
              value={sourceLanguage}
              onChange={(event) => setSourceLanguage(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
              <option value="Custom">＋ Custom language</option>
            </select>

            {sourceLanguage === 'Custom' && (
              <input
                className="custom-language"
                type="text"
                placeholder="Enter source language"
                value={customSourceLanguage}
                onChange={(event) => setCustomSourceLanguage(event.target.value)}
              />
            )}

            <textarea
              className="translation-text"
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, 5000))}
              placeholder="Type something you want to translate..."
              maxLength={5000}
              aria-label="Text to translate"
            />

            <div className="panel-bottom">
              <span className="character-count">{text.length} / 5000</span>
              <div className="input-actions">
                <button
                  className={`icon-action ${isListening ? 'listening' : ''}`}
                  type="button"
                  onClick={startListening}
                  disabled={isListening}
                  title="Speak text"
                  aria-label="Speak text"
                >
                  {isListening ? '● Listening' : '🎙'}
                </button>
                <button
                  className="text-action"
                  type="button"
                  onClick={() => { setText(''); setNotice(''); }}
                  disabled={!text}
                >
                  Clear
                </button>
              </div>
            </div>

            <button
              className="translate-button"
              type="button"
              onClick={handleTranslate}
              disabled={loading}
            >
              <span>{loading ? 'Translating...' : 'Translate text'}</span>
              {!loading && <span className="button-arrow">↗</span>}
            </button>
          </section>

          <div className="swap-control">
            <button
              type="button"
              onClick={swapLanguages}
              title="Swap languages"
              aria-label="Swap languages"
            >
              ⇄
            </button>
          </div>

          <section className="language-panel output-panel">
            <div className="panel-top">
              <span className="panel-label">TO</span>
              <span className="panel-index">02</span>
            </div>

            <select
              aria-label="Target language"
              value={targetLanguage}
              onChange={(event) => setTargetLanguage(event.target.value)}
            >
              {languages.map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
              <option value="Custom">＋ Custom language</option>
            </select>

            {targetLanguage === 'Custom' && (
              <input
                className="custom-language"
                type="text"
                placeholder="Enter target language"
                value={customTargetLanguage}
                onChange={(event) => setCustomTargetLanguage(event.target.value)}
              />
            )}

            <textarea
              className="translation-text output-text"
              value={translation}
              readOnly
              placeholder="Your translation will appear here..."
              aria-label="Translated text"
            />

            <div className="panel-bottom output-bottom">
              <span className="character-count">
                {translation ? `${translation.length} characters` : 'Translation'}
              </span>
              <button
                className="text-action copy-action"
                type="button"
                onClick={copyTranslation}
                disabled={!translation || loading}
              >
                Copy ↗
              </button>
            </div>

            <div className="output-note">
              <span className="output-sparkle">✳</span>
              <span>Your translated text will appear here.</span>
            </div>
          </section>
        </div>

        {notice && <p className="notice" role="status">{notice}</p>}
      </section>

      <footer className="footer">
        <span>Made for communication without limits.</span>
        <span>LANGUAGE TRANSLATOR <span className="footer-dot">●</span></span>
      </footer>
    </main>
  );
}

export default App;
