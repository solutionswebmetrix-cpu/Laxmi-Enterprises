import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const rotatingTexts = [
  "Reliable and Professional Services",
  "Committed to Quality Work",
  "Your One-Stop Solution",
  "Expert Technicians at Your Service"
];

const words = ["Laxmi", "Enterprises"];

const Hero = () => {
  // 🔥 Title Typewriter
  const [displayedTitle, setDisplayedTitle] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // 🔥 Rotating Text Typewriter
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex2, setCharIndex2] = useState(0);

  // ✅ Title Effect
  useEffect(() => {
    const currentWord = words[wordIndex];

    if (charIndex < currentWord.length) {
      const timeout = setTimeout(() => {
        setDisplayedTitle((prev) => prev + currentWord[charIndex]);
        setCharIndex(charIndex + 1);
      }, 120);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayedTitle("");
        setCharIndex(0);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 1200);

      return () => clearTimeout(timeout);
    }
  }, [charIndex, wordIndex]);

  // ✅ Rotating Text Effect
  useEffect(() => {
    const currentText = rotatingTexts[textIndex];

    if (charIndex2 < currentText.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + currentText[charIndex2]);
        setCharIndex2(charIndex2 + 1);
      }, 40);

      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setDisplayText("");
        setCharIndex2(0);
        setTextIndex((prev) => (prev + 1) % rotatingTexts.length);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [charIndex2, textIndex]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 to-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 text-center text-white px-4">

        {/* 🔥 Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-widest">
          <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
            {displayedTitle}
          </span>
          <span className="animate-pulse">|</span>
        </h1>

        {/* 🔥 Rotating Text */}
        <p className="text-lg md:text-xl mb-8">
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
            {displayText}
          </span>
          <span className="animate-pulse">|</span>
        </p>

      </div>

      {/* Scroll Icon */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <a href="#services" className="text-white opacity-70 hover:opacity-100">
          <ChevronRight size={32} className="rotate-90" />
        </a>
      </div>

    </section>
  );
};

export default Hero;