import toast from "react-hot-toast/headless";

export const auth = (resp: Response, callback: () => void) => {
  if (resp.status === 401) {
    callback();
  }
  return resp;
};

export const mustLogin = (resp: Response) => {
  if (resp.status === 401) {
    throw "log in first";
  }
  return resp;
};
