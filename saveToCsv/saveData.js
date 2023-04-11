const axios = require("axios");
const { getAllRecords, deleteRecord, addNewRecord } = require("./airtable");
require("dotenv").config();
// mytoken
// BQDarG1zurTkYFa3a1-or4wGVmJkHo06zVcHYz9jyJepg-0kqlrWJnbWatwsraSCBrtJoV5BhYVL_M3qU3TnuSm0VEvTsgp6IcXl6jidnwcFUKCkfvrkswNU-0_Rrvc2NGV6Ymf2PDqt4noUJ65xqmLXQSoVBDaEMgQr2gmrUksB-_xJko8iXZUYry40XTdcqYsISZu26IWhCPS4O0i-27XH
const myToken =
  "BQDarG1zurTkYFa3a1-or4wGVmJkHo06zVcHYz9jyJepg-0kqlrWJnbWatwsraSCBrtJoV5BhYVL_M3qU3TnuSm0VEvTsgp6IcXl6jidnwcFUKCkfvrkswNU-0_Rrvc2NGV6Ymf2PDqt4noUJ65xqmLXQSoVBDaEMgQr2gmrUksB-_xJko8iXZUYry40XTdcqYsISZu26IWhCPS4O0i-27XH";

const baseUrl = "https://api.spotify.com/v1/me";

const getName = async (headers) => {
  const res = await axios({
    method: "get",
    url: baseUrl,
    headers,
  });
  // console.log("~~~", res.data);

  return res.data;
};

const getTopTracks = async (headers) => {
  const res = await axios({
    method: "get",
    url: `${baseUrl}/top/tracks?offset=0&limit=50`,
    headers,
  });

  return res.data.items ?? [];
};

const getTopArtists = async (headers) => {
  const res = await axios({
    method: "get",
    url: `${baseUrl}/top/artists?offset=0&limit=50`,
    headers,
  });

  return res.data.items;
};

const getUsersPlaylists = async (headers) => {
  const res = await axios({
    method: "get",
    url: `${baseUrl}/top/artists?offset=0&limit=5`,
    headers,
  });
  console.log("playlists", res.data.items);

  return res.data?.items ?? [];
};

exports.saveDataToCSV = async (access_token) => {
  const data = {};
  const bearerToken = `Bearer ${access_token}`;

  const headers = {
    Authorization: bearerToken,
    "Content-Type": "application/json",
  };

  const personalInfo = await getName(headers);
  data["Name"] = personalInfo.display_name;
  data["Email"] = personalInfo.email;
  data["Followers"] = personalInfo.followers.total;
  data["Profile"] = personalInfo.href;
  data["Country"] = personalInfo.country;
  const timeElapsed = Date.now();
  const today = new Date(timeElapsed);
  data["Date Last Accessed"] = today.toISOString();
  const topTracks = await getTopTracks(headers);
  data["Top Tracks"] = topTracks.map((t) => t.name).join(", ");
  const topArtists = await getTopArtists(headers);
  data["Top Artists"] = topArtists.map((t) => t.name).join(", ");

  const records = await getAllRecords();

  const userRecord = records.find((r) => r.fields["Email"] === data["Email"]);
  if (userRecord) {
    await deleteRecord(userRecord.id);
  }

  await addNewRecord(data);

  // await getUsersPlaylists(headers);
};
