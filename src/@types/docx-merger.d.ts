declare module "docx-merger" {
  export default class DocxMerger {
    constructor(options: any, files: string[]);
    save(type: string, callback: (res: Buffer) => void);
  }
}
