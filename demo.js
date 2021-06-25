import axios from "axios";
import token from "./token.js";

const apiURL = "https://check1st.com/api";
const project = "Demo";

const scanSettingId = "5f2fc67b-2a23-416a-bc7b-53781eee8f4b";

const headers = {
  accept: "application/json",
  "content-type": "application/json",
  authorization: `Bearer ${token}`,
  token: `Bearer ${token}`,
};

const customAxios = axios.create({
  baseURL: `${apiURL}/${project}/scan-settings`,
  headers,
});

console.log("Triggering scan...");

const {
  data: { id: scanId },
} = await customAxios
  .request({
    method: "POST",
    url: `/scans`,
    data: { scan_settings_id: scanSettingId },
  })
  .catch((error) => {
    throw new Error(error);
  });

console.log("Scan triggered!");

const isScanComplete = async (scanId) => {
  const {
    data: { state },
  } = await customAxios
    .request({
      method: "POST",
      url: "/scan-state",
      data: { scan_id: scanId },
    })
    .catch((error) => {
      throw new Error(error);
    });

  return state === "Complete";
};

const sleep = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

console.log("Waiting for scan to complete...");

while (!(await isScanComplete(scanId))) {
  await sleep(1000);
}

console.log("Scan completed!");

const { data } = await customAxios
  .request({
    method: "POST",
    url: `/scans/${scanId}`,
    data: {},
  })
  .catch((error) => {
    throw new Error(error);
  });

console.log(JSON.stringify(data, null, 2));
