import type { Properties } from "csstype";

export default function style2String(style: Properties) {
  return Object.keys(style).reduce(
    (acc, key) =>
      acc +
      key
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase() +
      ":" +
      (style as any)[key] +
      ";",
    ""
  );
}
