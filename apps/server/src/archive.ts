import yauzl from "yauzl";
export function readArchiveEntry(
  archive: string,
  name: string,
  limit = 96 * 1024 * 1024,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    yauzl.open(archive, { lazyEntries: true }, (error, zip) => {
      if (error || !zip)
        return reject(error ?? new Error("Archive unavailable"));
      let found = false;
      zip.on("error", reject);
      zip.on("end", () => {
        if (!found) reject(new Error("Archive entry unavailable"));
      });
      zip.on("entry", (entry) => {
        if (entry.fileName !== name) return zip.readEntry();
        found = true;
        if (entry.uncompressedSize > limit) {
          zip.close();
          return reject(new Error("Raster exceeds local memory limit"));
        }
        zip.openReadStream(entry, (error, stream) => {
          if (error || !stream) {
            zip.close();
            return reject(error);
          }
          const chunks: Buffer[] = [];
          let bytes = 0;
          stream.on("error", (e) => {
            zip.close();
            reject(e);
          });
          stream.on("data", (chunk) => {
            bytes += chunk.length;
            if (bytes > limit) stream.destroy(new Error("Archive size limit"));
            else chunks.push(chunk);
          });
          stream.on("end", () => {
            zip.close();
            resolve(Buffer.concat(chunks));
          });
        });
      });
      zip.readEntry();
    });
  });
}
