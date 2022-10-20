import { appendText, removeAllChildren } from "./helpers.js";
import { fetchAllUsers, fetchSingleUserDetail } from "./usersApi.js";

export const getAllUsers = () => {
  const userPromiseArrayInOne = [];
  const userIdArray = [];
  fetchAllUsers(userPromiseArrayInOne);
  Promise.all(userPromiseArrayInOne)
    .then((res) => {
      const userPromiseArray = [];
			console.log(res[0]);
      res[0].users.forEach((user) => {
        userIdArray.push(user.id);
        fetchSingleUserDetail(user.id, userPromiseArray);
      });
      return Promise.all(userPromiseArray);
    })
    .then((data) => {
			console.log(userIdArray);
      const userIdNameArray = [];
			console.log(data);
      for (let i = 0; i < userIdArray.length; i++) {
        userIdNameArray.push({
          id: userIdArray[i],
          name: data[i].name,
        });
      }
      userIdNameArray.sort(compareNames);
      pushUserToSelect(userIdNameArray);
    });
};

const pushUserToSelect = (userIdNameArray) => {
	removeAllChildren("multi-user-select");
  const selectNode = document.getElementById("multi-user-select");
	const hideOption = document.createElement("option");
  hideOption.hidden = true;
  selectNode.appendChild(hideOption);
  for (let i = 0; i < userIdNameArray.length; i++) {
    const optionNode = document.createElement("option");
    appendText(optionNode, userIdNameArray[i].name);
    optionNode.setAttribute("data-id", userIdNameArray[i].id);
    selectNode.appendChild(optionNode);
  }
};

const compareNames = (a, b) => {
  const nameA = a.name.toLowerCase();
  const nameB = b.name.toLowerCase();
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  return 0;
};
