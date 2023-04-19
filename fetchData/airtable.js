const axios = require("axios");
require("dotenv").config();

const baseId = process.env.AIRTABLE_BASE_ID;
const tableId = process.env.AIRTABLE_TABLE_ID;
const tableUri = `https://api.airtable.com/v0/${baseId}/${tableId}`;
const bearerToken = `Bearer ${process.env.AIRTABLE_ACCESS_TOKEN}`;
const headers = {
  Authorization: bearerToken,
};

const getAllRecords = async () => {
  const recordsData = await axios({
    method: "get",
    url: tableUri,
    headers,
  });

  return recordsData.data.records;
};

const addNewRecord = async (row) => {
  await axios({
    method: "post",
    url: tableUri,
    headers,
    data: {
      records: [{ fields: { ...row } }],
    },
  });
};

const deleteRecord = async (recordId) => {
  await axios({
    method: "delete",
    url: `${tableUri}/${recordId}`,
    headers,
  });
};

exports.addNewRecord = addNewRecord;
exports.getAllRecords = getAllRecords;
exports.deleteRecord = deleteRecord;
