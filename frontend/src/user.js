import { BACKEND_PORT } from "./config";

export const getSingleUserInfo = (id) => {
	const token = localStorage.getItem("token");
  fetch(`http://localhost:${BACKEND_PORT}/user/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
    },
  })
    .then((res) => {
      if (res.ok) {
        res
          .json()
          .then((data) => {
            console.log(data.channels);
            const publicChannels = data.channels.filter(
              (channel) => !channel.private
            );
            const privateChannels = data.channels.filter(
              (channel) => channel.private
            );
            loadChannels(publicChannels, "public-channels-list");
            loadChannels(privateChannels, "private-channels-list");
          })
          .catch((err) => {
            errorModalPop(err);
          });
      }
    })
    .catch((err) => {
      errorModalPop(err);
    });
}