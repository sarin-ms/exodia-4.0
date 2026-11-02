const ticketWidth = 1120;
const ticketHeight = 440;

function nextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

export async function createTicketPng(node: HTMLElement): Promise<Blob> {
  await document.fonts.ready;
  await Promise.all(
    Array.from(node.querySelectorAll("img"), async (image) => {
      image.loading = "eager";
      await image.decode();
      if (!image.naturalWidth)
        throw new Error("Ticket artwork could not be loaded.");
    }),
  );

  const { toSvg, getFontEmbedCSS } = await import("html-to-image");
  // Rubik uses the woff2-variations format; preserve the source format when embedding.
  const options = { includeQueryParams: true };
  const fontEmbedCSS = await getFontEmbedCSS(node, options);
  if (!/url\(["']?data:/i.test(fontEmbedCSS)) {
    throw new Error("The ticket font could not be embedded.");
  }
  const snapshot = await toSvg(node, {
    ...options,
    fontEmbedCSS,
    width: ticketWidth,
    height: ticketHeight,
    style: { filter: "none", margin: "0" },
  });
  const image = new Image();
  image.src = snapshot;
  await image.decode();

  const canvas = document.createElement("canvas");
  canvas.width = ticketWidth * 2;
  canvas.height = ticketHeight * 2;
  const context = canvas.getContext("2d");
  if (!context)
    throw new Error("Image downloads are unavailable in this browser.");
  // Repaint the same embedded snapshot after a frame for WebKit image decoding.
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  await nextPaint();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Your ticket image could not be created."));
    }, "image/png");
  });
}
