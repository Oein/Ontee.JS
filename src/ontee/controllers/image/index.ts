import { uid } from "uid";

export let imageStorage: {
  [key: string]: HTMLImageElement;
} = {};

export let urlToImgid: {
  [key: string]: string;
} = {};

export let image = {
  load: (url: string, customID?: string) => {
    return new Promise<string>((resolve) => {
      let ui_ = customID || "ontee_image" + uid();
      if (typeof urlToImgid[url] != "undefined") ui_ = urlToImgid[url];

      if (typeof imageStorage[ui_] != "undefined") {
        return resolve(ui_);
      }

      imageStorage[ui_] = new Image();
      imageStorage[ui_].src = url;
      imageStorage[ui_].onload = () => {
        resolve(ui_);
      };
    });
  },
  get: (id: string) => {
    return imageStorage[id];
  },
};
