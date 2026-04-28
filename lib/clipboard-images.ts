interface ClipboardFileItemLike {
  kind: string;
  type: string;
  getAsFile: () => File | null;
}

interface ClipboardImageSourceLike {
  items?: ArrayLike<ClipboardFileItemLike> | null;
  files?: ArrayLike<File> | null;
}

export function getClipboardImageFiles(
  clipboardData: ClipboardImageSourceLike
): File[] {
  const itemFiles = Array.from(clipboardData.items || [])
    .filter((item) => item.kind === "file" && item.type.startsWith("image/"))
    .map((item) => item.getAsFile())
    .filter((file): file is File => Boolean(file));

  if (itemFiles.length > 0) {
    return itemFiles;
  }

  return Array.from(clipboardData.files || []).filter((file) =>
    file.type.startsWith("image/")
  );
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Unable to read image as data URL"));
      }
    };
    reader.onerror = () => reject(reader.error || new Error("Unable to read image"));
    reader.readAsDataURL(file);
  });
}

export async function readImageFilesAsDataUrls(files: File[]): Promise<string[]> {
  return Promise.all(files.map(readFileAsDataUrl));
}
