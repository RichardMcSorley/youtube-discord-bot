const hasKoreanTXT = string => {
  const re = /([ㄱ-ㅎ]+)|([가-힣])*$/g;
  return re.test(string);
};
const hasEnglishTXT = string => {
  const re = /[A-Za-z]|[A-Za-z0-9]/g;
  return re.test(string);
};

const langMap = {
  ko_en: "English",
  hanja: "한자",
  ko: "한국어",
  en: "English",
  en_ko: "영어"
};

const dictMap = {
  kew: "ko_en",
  hhw: "hanja",
  kkw: "ko",
  eew: "en",
  ekw: "en_ko"
};

module.exports = {
  hasKoreanTXT,
  hasEnglishTXT,
  langMap,
  dictMap
};
