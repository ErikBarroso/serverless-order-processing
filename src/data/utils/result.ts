export const ok = (msg?: string, data?: any): any => ({
  code: 200,
  msg,
  data,
});

export const created = (msg?: string, data?: any): any => ({
  code: 201,
  msg,
  data,
});

export const unprocessableEntity = (msg?: string, data?: any): any => ({
  code: 422,
  msg,
  data,
});

export const unauthorized = (msg?: string, data?: any): any => ({
  code: 401,
  msg,
  data,
});

export const forbidden = (msg?: string, data?: any): any => ({
  code: 403,
  msg,
  data,
});
