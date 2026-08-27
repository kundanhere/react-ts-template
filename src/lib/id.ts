const DEFAULT_ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export interface IGenerateIdOptions {
  alphabet?: string;
  length?: number;
}

export function generateId(
  prefixOrOptions?: string | IGenerateIdOptions,
  inputOptions: IGenerateIdOptions = {}
): string {
  const options =
    typeof prefixOrOptions === "object" ? prefixOrOptions : inputOptions;

  const { alphabet = DEFAULT_ALPHABET, length = 12 } = options;

  const chars = new Array(length);

  for (let i = 0; i < length; i += 1) {
    chars[i] = alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  return chars.join("");
}
