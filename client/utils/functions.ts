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
