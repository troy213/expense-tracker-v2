declare namespace jest {
  interface Matchers<R> {
    toHaveTextContent(
      content: string | RegExp,
      options?: { normalizeWhitespace?: boolean }
    ): R
  }
}
