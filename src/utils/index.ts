export const timeElapse = (prev: Date, now: Date) => {
  const prevTime: number = prev.valueOf();
  const nowTime: number = now.valueOf();
  const elapsedDate = new Date(nowTime - prevTime);
  const elapsedYear = elapsedDate.getFullYear() - 1970;
  return (elapsedYear ? elapsedYear + ' year ' : '') + elapsedDate.getMonth() + ' months';
}

export const longerThanYears = (startDate, endDate, years): boolean => {
  const [startYear, startMonth, startDay] = [startDate.year(), startDate.month(), startDate.date()];
  const [endYear, endMonth, endDay] = [endDate.year(), endDate.month(), endDate.date()];
  if (endYear > startYear + years) {
    return true;
  }
  if (endYear == startYear + years) {
    if (endMonth > startMonth) {
      return true;
    }
    if (endMonth == startMonth && endDay > startDay) {
      return true;
    }
  }
  return false;
};
