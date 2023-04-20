import { getAllRecords } from "../fetchData/airtable";
import { csvKeys, fetchData } from "../fetchData/fetchData";
import axios from "axios";
import qs from "qs";

const client_id = process.env.clientID; // Your client id
const client_secret = process.env.clientSecret; // Your secret

export default async function handler(req, res) {
  const records = await getAllRecords();

  await Promise.all(
    records.map(async (record) => {
      const refreshToken = record.fields[csvKeys.refreshToken];

      try {
        const options = {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              new Buffer(client_id + ":" + client_secret).toString("base64"),
            "content-type": "application/x-www-form-urlencoded",
          },
          data: qs.stringify({
            grant_type: "refresh_token",
            refresh_token: refreshToken,
          }),
          url: "https://accounts.spotify.com/api/token",
        };
        const response = await axios(options);
        await fetchData(response.data.access_token, refreshToken);
      } catch (error) {
        console.log("~~~ error", error.data);
      }
    })
  );

  res.send("ok");
}
