// Convert Russian month name in english

const toEnglish = (month) => {
  // Mapping between Russian and English month names
  const monthMap = {
    Янв: "Jan",
    Фев: "Feb",
    Мар: "Mar",
    Апр: "Apr",
    Май: "May",
    Июн: "Jun",
    Июл: "Jul",
    Авг: "Aug",
    Сен: "Sep",
    Окт: "Oct",
    Ноя: "Nov",
    Дек: "Dec",
  };
  const russianMonth = month.split("-")[1];
  const englishMonth = monthMap[russianMonth];
  // convert the month name and return the converted one
  const convertedDate = month.replace(russianMonth, englishMonth);
  return convertedDate;
};

module.exports = toEnglish;
