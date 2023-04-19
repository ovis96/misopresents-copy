import { getAllRecords } from "../fetchData/airtable";

export default async function handler(req) {
  const records = await getAllRecords();
  console.log("~~~ records all records", records);
}
