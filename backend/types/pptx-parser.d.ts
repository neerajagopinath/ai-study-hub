declare module "pptx-parser" {
  const PPTXParser: {
    parse(buffer: Buffer): Promise<any[]>
  }
  export default PPTXParser
}
