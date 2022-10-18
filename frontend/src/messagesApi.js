import { BACKEND_PORT } from "./config.js";
import { errorModalPop } from "./helpers.js";
import { appendMessageToChatbox } from "./message.js";

const originUrl = `http://localhost:${BACKEND_PORT}`;

export const fetchMessages = (channelId, start) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/${channelId}`);
  url.searchParams.append("start", start);
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
      } else if (res.status === 400 && start === 0) {
        errorModalPop("Channel Doesn't Exist.");
      } else if (res.status === 400 && start !== 0) {
        document
          .getElementById("all-messages")
          .setAttribute("data-requestflag", "true");
				document
          .getElementById("all-messages")
          .setAttribute("data-loadfinish", "true");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to see the message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchSendMessage = (channelId, msg, img) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/${channelId}`);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      message: msg,
      image: img,
    }),
  };
  fetch(url, options)
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then(() => {
            fetchMessages(channelId, 0);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop(
          "Some thing wrong in the input message or input picture."
        );
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to send the message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchEditMessage = (messageId, channelId, msg, img) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/${channelId}/${messageId}`);
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      message: msg,
      image: img,
    }),
  };
  fetch(url, options)
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {
            fetchMessages(channelId, 0);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop(
          "Channel or message Doesn't Exist, Or invalid text or image input."
        );
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to see the message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

export const fetchDeleteMessage = (channelId, messageId) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/${channelId}/${messageId}`);
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  };
  fetch(url, options)
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then(() => {
            fetchMessages(channelId, 0);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel or message Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to see the message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};
