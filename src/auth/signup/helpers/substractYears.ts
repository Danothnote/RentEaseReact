import moment, { type Moment } from "moment";

export const substractYears = (years: number): Moment => {
  return moment().subtract(years, 'years');
};
