/* eslint-disable @typescript-eslint/no-extraneous-class */
import fs from "fs";
import axios from "axios";

class File {
  static async download(fileUrl: string, opPath: string) {
    const writer = fs.createWriteStream(opPath);

    const response = await axios({
      method: "get",
      url: fileUrl,
      responseType: "stream",
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  }
}

export class Media {
  static file = File;
}
