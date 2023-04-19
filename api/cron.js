import { getAllRecords } from "../fetchData/airtable";
import { csvKeys, fetchData } from "../fetchData/fetchData";
import request from "request";

const client_id = process.env.clientID; // Your client id
const client_secret = process.env.clientSecret; // Your secret

export default async function handler(req, res) {
  const records = await getAllRecords();
  await Promise.all(
    records.map(async (record) => {
      const refreshToken = record[csvKeys.refreshToken];
      // requesting access token from refresh token
      var authOptions = {
        url: "https://accounts.spotify.com/api/token",
        headers: {
          Authorization:
            "Basic " +
            new Buffer(client_id + ":" + client_secret).toString("base64"),
        },
        form: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        },
        json: true,
      };

      await new Promise((resolve) => {
        request.post(authOptions, async function (error, response, body) {
          if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            await fetchData(access_token, refreshToken);
            resolve();
          }
        });
      });
    })
  );

  res.send("ok");
}
