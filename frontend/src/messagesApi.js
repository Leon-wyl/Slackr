import { BACKEND_PORT } from "./config.js";
import { errorModalPop, successModalPop } from "./helpers.js";
import { appendMessageToChatbox } from "./message.js";

const originUrl = `http://localhost:${BACKEND_PORT}`;

// api for fetching message to chatbox
export const fetchMessages = (channelId, start) => {
  const token = localStorage.getItem("token");
  console.log(token);
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
            // append fetched message to chat box
            appendMessageToChatbox(data.messages, start, false);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel Doesn't Exist.");
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

// api for sending message
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
            // reload message after sending
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

// api for editing message
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
          .then(() => {
            // reload messages after editing
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

// api for deleting message
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
            // reload message after deleting
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

// api for pin a message
export const fetchPin = (channelId, msgId) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/pin/${channelId}/${msgId}`);
  const options = {
    method: "POST",
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
            successModalPop("successfully pin a message");
            // reload message
            fetchMessages(channelId, 0);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel or message Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to pin this message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// api for unpin a message
export const fetchUnpin = (channelId, msgId) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/unpin/${channelId}/${msgId}`);
  const options = {
    method: "POST",
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
            successModalPop("successfully unpin a message");
            fetchMessages(channelId, 0);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel or message Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to pin this message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// create a promise for fetching all usernames
export const fetchAllPostsPromise = (channelId, token) => {
  return new Promise((resolve, reject) => {
    let page = 0;
    const allPosts = [];

    const url = new URL(originUrl + `/message/${channelId}`);
    url.searchParams.append("start", page);

    const fetchCurrentPage = () => {
      console.log(page);
      fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((res) => res.json())
        .then((msgObject) => {
          console.log(msgObject.messages.length);
          if (msgObject.messages.length === 0) {
            // base case - no more posts to fetch
            resolve(allPosts);
          } else {
            page = page + msgObject.messages.length;
            allPosts.push(...msgObject.messages);
            url.searchParams.delete("start");
            url.searchParams.append("start", page);
            fetchCurrentPage();
            // fetch next page
          }
        })
        .catch(() => {
          reject();
        });
    };
    fetchCurrentPage();
  });
};

// api for react a message
export const fetchReact = (channelId, msgId, type) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/react/${channelId}/${msgId}`);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      react: type,
    }),
  };
  fetch(url, options)
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then(() => {
            successModalPop("successfully react a message");
            fetchMessages(channelId, 0);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel or message Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to react this message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};

// api for unreact an message
export const fetchUnreact = (channelId, msgId, type) => {
  const token = localStorage.getItem("token");
  const url = new URL(originUrl + `/message/unreact/${channelId}/${msgId}`);
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({
      react: type,
    }),
  };
  fetch(url, options)
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then(() => {
            successModalPop("successfully unreact a message");
            fetchMessages(channelId, 0);
          })
          .catch((err) => {
            errorModalPop(err);
          });
      } else if (res.status === 400) {
        errorModalPop("Channel or message Doesn't Exist.");
      } else if (res.status === 403) {
        errorModalPop(
          "You are not authorized to react this message. Please logout and login again."
        );
      } else {
        errorModalPop("Something wrong happened.");
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
};
