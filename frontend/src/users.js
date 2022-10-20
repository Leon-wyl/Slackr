import { appendText, removeAllChildren } from "./helpers.js";
import { fetchAllUsers, fetchAllUsersDetail } from "./usersApi.js";

export const getAllUsers = () => {
  const userPromiseArrayInOne = [];
  const userIdArray = [];
	// Get all user ids
  fetchAllUsers(userPromiseArrayInOne);
  Promise.all(userPromiseArrayInOne)
    .then((res) => {
			// If success, use the ids to get all user's detail
      const userPromiseArray = [];
      res[0].users.forEach((user) => {
        userIdArray.push(user.id);
        fetchAllUsersDetail(user.id, userPromiseArray);
      });
      return Promise.all(userPromiseArray);
    })
    .then((data) => {
			// If success, combine corresponding ids and names into object, except for use him/herself
      const userIdNameArray = [];
      for (let i = 0; i < userIdArray.length; i++) {
        if (userIdArray[i] !== Number(localStorage.getItem("userId"))) {
          userIdNameArray.push({
            id: userIdArray[i],
            name: data[i].name,
          });
        }
      }
      userIdNameArray.sort(compareNames);
      pushUserToSelect(userIdNameArray);
    });
};

const pushUserToSelect = (userIdNameArray) => {
  removeAllChildren("multi-user-select");
  const selectNode = document.getElementById("multi-user-select");
	// Create a hidden option for user select, in order to do multiple select
  const hideOption = document.createElement("option");
  hideOption.hidden = true;
  selectNode.appendChild(hideOption);
	// loop through all ids/names, construction option elements to select element
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
