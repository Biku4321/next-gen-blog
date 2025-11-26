import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher"; // 🟢 Added

const VoiceToText = ({ onTranscript, onError }) => {
  const { t, i18n } = useTranslation();
  const [isListening, setIsListening] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [language, setLanguage] = useState("en-US");
  const [isPlaying, setIsPlaying] = useState(false);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsAvailable(true);
      initializeSpeechRecognition();
    } else {
      setIsAvailable(false);
      onError?.(t("voice.error_not_supported"));
    }

    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (streamRef.current)
        streamRef.current.getTracks().forEach((track) => track.stop());
    };
  }, [t]);

  const initializeSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onerror = (event) => {
      let errorMessage = t("voice.error_generic");
      switch (event.error) {
        case "no-speech":
          errorMessage = t("voice.error_no_speech");
          break;
        case "audio-capture":
          errorMessage = t("voice.error_audio");
          break;
        case "not-allowed":
          errorMessage = t("voice.error_permission");
          break;
        case "network":
          errorMessage = t("voice.error_network");
          break;
      }
      onError?.(errorMessage);
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          setConfidence(result[0].confidence);
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        const newTranscript = transcript + finalTranscript;
        setTranscript(newTranscript);
        onTranscript?.(newTranscript);
      }

      setInterimTranscript(interimTranscript);
    };

    recognitionRef.current = recognition;
  };

  const startListening = async () => {
    if (!isAvailable || !recognitionRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
    } catch {
      onError?.(t("voice.error_permission"));
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    if (streamRef.current)
      streamRef.current.getTracks().forEach((track) => track.stop());
  };

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
    setConfidence(0);
  };

  const speakText = (text) => {
    if (!synthRef.current || !text) return;
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    synthRef.current.speak(utterance);
  };

  if (!isAvailable) {
    return (
      <div className="glass-card p-4 rounded-xl text-center">
        <MicOff className="w-8 h-8 mx-auto text-red-500 mb-2" />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t("voice.error_not_supported")}
          <br />
          {t("voice.try_other_browser")}
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{t("voice.title")}</h3>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher /> {/* 🟢 Added visible language switcher */}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <motion.button
          onClick={isListening ? stopListening : startListening}
          className={`p-4 rounded-full ${
            isListening ? "bg-red-500" : "bg-blue-500"
          } text-white shadow-lg`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
        >
          {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
        </motion.button>

        {transcript && (
          <>
            <motion.button
              onClick={() => speakText(transcript)}
              className="p-3 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isPlaying}
            >
              {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </motion.button>

            <motion.button
              onClick={clearTranscript}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {t("voice.clear")}
            </motion.button>
          </>
        )}
      </div>

      {/* Transcript */}
      {(transcript || interimTranscript) && (
        <div className="border-t pt-4">
          <div className="bg-white/10 dark:bg-gray-800/50 p-4 rounded-xl max-h-40 overflow-y-auto">
            <p className="text-sm text-gray-800 dark:text-gray-200">
              {transcript}{" "}
              <span className="text-gray-500 italic">{interimTranscript}</span>
            </p>
            {confidence > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                {t("voice.confidence")}: {Math.round(confidence * 100)}%
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500 space-y-1">
        <p>{t("voice.tip_1")}</p>
        <p>{t("voice.tip_2")}</p>
        <p>{t("voice.tip_3")}</p>
      </div>
    </div>
  );
};

export default VoiceToText;
