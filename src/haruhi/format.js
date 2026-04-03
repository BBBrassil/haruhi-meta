((Format) => {
  const { Dates } = Haruhi;
  const helpers = window.calendarjs.Helpers;

  const numberOf = (count) => {
    return count === 1 ? "1" : count > 1 ? "n" : "0";
  };

  Format.dayOfWeekShort = (date) => {
    return `${helpers.weekdaysShort[date.getDay()]} ${helpers.monthsShort[date.getMonth()]} ${date.getDate()}`;
  };

  Format.month = (month) => {
    return `${helpers.months[month]}`;
  };

  Format.episodeCaption = (count, date) => {
    const isToday = !date || Dates.daysBetween(date, new Date()) < 1;
    switch (numberOf(count)) {
      case "1": return isToday ? "Today's episode: " : "This day's episode: ";
      case "n": return isToday ? "Today's episodes: " : "This day's episodes: ";
    }
    return "";
  };

  Format.timelineCaption = () => {
    return "Metachronological Order for ";
  };

  Format.timelineMonthEmpty = () => {
    return "Nothing this month.";
  };

  Format.timelineMonthLegend = () => {
    return "* Indicates the first occurrence of this episode in sequential order (1–8).";
  }
})(Haruhi.Format = Haruhi.Format || {});