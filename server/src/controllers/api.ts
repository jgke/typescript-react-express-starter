let data = '';

export function getApi() {
  return data;
}

export function postApi(msg: typeof data) {
  data = msg;

  return data;
}

let num = 0;

export function getNumber() {
  return num;
}

export function postNumber(msg: typeof num) {
  num = msg;

  return num;
}
