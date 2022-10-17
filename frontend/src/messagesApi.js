import { BACKEND_PORT } from "./config.js";
import { errorModalPop } from "./helpers.js";
import { appendMessageToChatbox } from "./message.js";

const originUrl = `http://localhost:${BACKEND_PORT}`;

export const fetchMessages = (channelId, start) => {
	const token = localStorage.getItem("token");
	console.log(token);
	const url = new URL(originUrl + `/message/${channelId}`);
	url.searchParams.append('start', start);
	fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {
            console.log(data);
						appendMessageToChatbox(data.messages, start);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop("You are not authorized to see the message. Please logout and login again.");
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    // .catch((err) => {
    //   errorModalPop(err);
    // });
}