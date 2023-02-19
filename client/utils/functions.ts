import * as Yup from "yup";
import toast from "react-hot-toast";

import type { CustomFieldTypes } from "./types/shared.types";

export function CreateYupSchema(schema: any, config: CustomFieldTypes) {
  if (config) {
    const { name, validationtype: validationType, validations = [] } = config;
    if (!Yup[validationType as keyof typeof Yup]) return schema;
    // @ts-ignore
    let validator = Yup[validationType]();
    validations.forEach((validation) => {
      const { params, type } = validation;
      if (!validator[type]) return;
      validator = validator[type](...(params as Array<any>));
    });
    schema[name] = validator;
    return schema;
  }
}

export const DatesToTenure = (start: string, end: string | null): number => {
  const _start = +start.split("-").join("");
  if (!end) return _start;
  const _end = +end.split("-").join("");
  return +`${_start}${_end}`;
};

export const TenureToDates = (
  tenure: string
): { startDate: Date; endDate: Date | null } => {
  const sy = tenure.substring(0, 4);
  const sm = tenure.substring(4, 6);
  const sd = tenure.substring(6, 8);
  const SD = [sy, sm, sd].join("-");
  if (!tenure[8]) return { startDate: new Date(SD), endDate: null };
  const ey = tenure.substring(8, 12);
  const em = tenure.substring(12, 14);
  const ed = tenure.substring(14, 16);
  const ED = [ey, em, ed].join("-");
  return { startDate: new Date(SD), endDate: new Date(ED) };
};

const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const DateParser = (date: Date): string => {
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const PopPromiseToast = (
  promise: Promise<any>,
  loading: string,
  success: string,
  error: string
) => {
  toast.promise(promise, {
    loading,
    success,
    error,
  });
};
