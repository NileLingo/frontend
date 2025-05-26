import React from "react";
import { useTranslation } from "react-i18next";
import Button from "./Button";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  return (
    <Button
      variant="text"
      size="sm"
      onClick={toggleLanguage}
      className="text-[#F5F5F5] hover:text-[#BB86FC]"
    >
      {i18n.language === "en" ? "العربية" : "English"}
    </Button>
  );
};

export default LanguageSelector;
