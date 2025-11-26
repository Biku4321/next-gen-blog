import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      defaultValue={i18n.language}
      className="bg-transparent border rounded-md px-2 py-1"
    >
      <option value="en">English</option>
      <option value="hi">हिन्दी</option>
    </select>
  );
};

export default LanguageSwitcher;
