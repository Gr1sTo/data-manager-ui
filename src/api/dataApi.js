import { getRelationalData } from "./relationalApi";
import { getDocumentData } from "./documentApi";
import { getFileData } from "./fileApi";

export async function getDataByType(type) {
  switch (type) {
    case "relational":
      return getRelationalData();

    case "document":
      return getDocumentData();

    case "file":
      return getFileData();

    default:
      throw new Error(`Невідомий тип даних: ${type}`);
  }
}