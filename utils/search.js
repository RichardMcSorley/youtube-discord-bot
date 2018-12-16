const findKoreanUnnie = string => {
  string = string
    .replace(/\s+/g, "")
    .replace(/^\s/, "")
    .replace(/\s$/, "")
    .toLowerCase();
  const val1 = string.includes("한국언니");
  const val2 = string.includes("koreanunnie");
  return val1 || val2;
};

module.exports = {
  findKoreanUnnie
};
