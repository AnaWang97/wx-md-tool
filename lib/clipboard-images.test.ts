import { describe, expect, it } from "vitest";
import { getClipboardImageFiles } from "./clipboard-images";

describe("getClipboardImageFiles", () => {
  it("extracts image files from clipboard items before falling back to files", () => {
    const itemImage = new File(["image"], "image.png", { type: "image/png" });
    const fileImage = new File(["fallback"], "fallback.jpg", {
      type: "image/jpeg",
    });

    const files = getClipboardImageFiles({
      items: [
        {
          kind: "file",
          type: "image/png",
          getAsFile: () => itemImage,
        },
      ],
      files: [fileImage],
    });

    expect(files).toEqual([itemImage]);
  });

  it("falls back to image files when clipboard items do not expose files", () => {
    const fileImage = new File(["fallback"], "fallback.jpg", {
      type: "image/jpeg",
    });

    const files = getClipboardImageFiles({
      items: [],
      files: [fileImage],
    });

    expect(files).toEqual([fileImage]);
  });
});
