//convertTimestamp(): convert timestamp to (yyyy-mm-d/dd)
export const convertTimestamp = (timeStamp) => {
  const date = new Date(timeStamp);
  return date.toLocaleDateString();
};

//計算當周日期期間
export const getWeekDates = () => {
  let now = new Date();
  let dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
  let todayDate = now.getDate(); //日期

  let start = new Date(now);
  start.setDate(todayDate - dayOfWeek + 1);
  start.setHours(0, 0, 0, 0);

  let end = new Date(now);
  end.setDate(todayDate + (7 - dayOfWeek));
  end.setHours(23, 59, 59, 999);

  return [start.valueOf(), end.valueOf()];
};
