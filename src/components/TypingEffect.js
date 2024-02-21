import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function TypingEffect({ texts }) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(0);
  const [checkedSentences, setCheckedSentences] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentText = texts[currentTextIndex];
      if (currentCharacterIndex < currentText.length) {
        setCurrentCharacterIndex((prevIndex) => prevIndex + 1);
      } else {
        clearInterval(intervalId);
        if (currentTextIndex < texts.length - 1) {
          setTimeout(() => {
            setCheckedSentences((prevCheckedSentences) => [
              ...prevCheckedSentences,
              texts[currentTextIndex],
            ]);
            setCurrentTextIndex((prevIndex) => prevIndex + 1);
            setCurrentCharacterIndex(0);
          }, 1000); // Delay before typing the next text
        } else {
          setCheckedSentences((prevCheckedSentences) => [
            ...prevCheckedSentences,
            texts[currentTextIndex],
          ]);
        }
      }
    }, 100); // Adjust the interval to control typing speed

    return () => clearInterval(intervalId);
  }, [texts, currentTextIndex, currentCharacterIndex]);

  return (
    <div className="typing-effect">
      {texts.map((text, index) => (
        <p key={index}>
          {checkedSentences.includes(text) && (
            <span className="checked-slogan-item">&#10003; </span>
          )}
          {index <= currentTextIndex &&
            (index === currentTextIndex
              ? texts[currentTextIndex].slice(0, currentCharacterIndex)
              : texts[index])}
        </p>
      ))}
    </div>
  );
}

export default TypingEffect;
