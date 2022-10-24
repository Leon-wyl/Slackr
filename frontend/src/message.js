import {
  appendDate,
  appendText,
  errorModalPop,
  fileToDataUrl,
  removeAllChildren,
} from "./helpers.js";
import {
  fetchAllPostsPromise,
  fetchDeleteMessage,
  fetchEditMessage,
  fetchPin,
  fetchReact,
  fetchSendMessage,
  fetchUnpin,
  fetchUnreact,
} from "./messagesApi.js";
import { fetchSingleUserInfoForMessage } from "./usersApi.js";

export const appendMessageToChatbox = (messages, start, isPinned) => {
  const allMsgNode = document.getElementById("all-messages");
  if (start === 0) reloadSettings(allMsgNode);
  infiniteScrollSettings(allMsgNode, start, messages);

  messages.forEach((message) => {
    clearMsgTemplate();
    // Count the number of messages
    const currNumOfMsg = Number(allMsgNode.dataset.number) + 1;
    allMsgNode.setAttribute("data-number", currNumOfMsg);
    // Copy from the template
    const newMsgNode = document
      .getElementById("single-message")
      .cloneNode(true);
    newMsgNode.style.display = "flex";
    // set the message id to outside nodes, links and buttons of the msg
    newMsgNode.setAttribute("data-id", message.id);
    newMsgNode.setAttribute("id", "message-" + message.id);
    const container = newMsgNode.querySelector("#avatar-message-container");
    container.setAttribute("id", "avatar-message-container-" + message.id);
    const editLink = newMsgNode.querySelector(".edit-message");
    editLink.setAttribute("data-id", message.id);
    const deleteLink = newMsgNode.querySelector(".delete-message");
    deleteLink.setAttribute("data-id", message.id);
    const smileButton = newMsgNode.querySelector(".smile-react");
    smileButton.setAttribute("data-id", message.id);
    const normalButton = newMsgNode.querySelector(".normal-react");
    normalButton.setAttribute("data-id", message.id);
    const cryButton = newMsgNode.querySelector(".cry-react");
    cryButton.setAttribute("data-id", message.id);
    const pinButton = newMsgNode.querySelector(".pin");
    pinButton.setAttribute("data-id", message.id);
    // Get the nodes that needs to be filled with info
    const userNameNode = newMsgNode.querySelector(".user-name-message");
    const textMsgNode = newMsgNode.querySelector(".text-message");
    const sentAtMsgNode = newMsgNode.querySelector(".sent-at-message");
    const editedAtMsgNode = newMsgNode.querySelector(".edited-at-message");
    const avatarContainerNode = newMsgNode.querySelector(
      ".avatar-message-container"
    );
    const imageContainerNode = newMsgNode.querySelector(
      "#image-message-container"
    );
    // remove id attributes
    userNameNode.setAttribute("id", "");
    userNameNode.setAttribute("data-senderid", message.sender);
    textMsgNode.setAttribute("id", "");
    sentAtMsgNode.setAttribute("id", "");
    editedAtMsgNode.setAttribute("id", "");
    avatarContainerNode.setAttribute("id", "");
    // append text and/or into the infomation nodes
    fetchSingleUserInfoForMessage(
      message.sender,
      avatarContainerNode,
      userNameNode
    );
    if (message.image) {
      // Set avatar to the image if avatar is not empty string
      const imgNode = document.createElement("img");
      imgNode.src = message.image;
      imgNode.height = 72;
      imgNode.width = 72;
      imgNode.setAttribute("class", "image-message");
			imgNode.setAttribute("alt", "avatar");
      imgNode.setAttribute("data-bs-toggle", "modal");
      imgNode.setAttribute("data-bs-target", "#image-modal");
      imageContainerNode.appendChild(imgNode);
    }
    // Append texts and dates, get the states of buttons
    appendText(textMsgNode, message.message);
    appendDate(sentAtMsgNode, message.sentAt);
    getPinState(pinButton, message.pinned);
    getReactState(smileButton, message.reacts, "smile");
    getReactState(normalButton, message.reacts, "normal");
    getReactState(cryButton, message.reacts, "cry");
    if (message.editedAt !== null)
      appendDate(editedAtMsgNode, message.editedAt);

    if (isPinned) {
      // append msgs to pinned message modal
      const parentDiv = document.getElementById("pinned-modal-body");
      parentDiv.appendChild(newMsgNode);
    } else {
      // append the whole msg node to the chatbox
      const parentDiv = document.getElementById("all-messages");
      const firstMsgElement =
        document.getElementById("all-messages").firstChild;
      parentDiv.insertBefore(newMsgNode, firstMsgElement);
      // set the outest node and the img container to display flex
      const appendedNode = document.getElementById("message-" + message.id);
      appendedNode.style.display = "flex";
    }
  });
  // Automatically scroll down to the end of last scrolling after loading all messages
  allMsgNode.scrollTop = allMsgNode.dataset.lastscrollheight
    ? allMsgNode.scrollHeight - allMsgNode.dataset.lastscrollheight
    : allMsgNode.scrollHeight;
  allMsgNode.setAttribute("data-lastscrollheight", allMsgNode.scrollHeight);
};

// set number, requestflag and loadfinish for infinite scrolling
const infiniteScrollSettings = (allMsgNode, start, messages) => {
  allMsgNode.setAttribute("data-number", start);
  allMsgNode.setAttribute("data-requestflag", "false");
  allMsgNode.setAttribute("data-loadfinish", "false");
  if (messages.length === 0) {
    document
      .getElementById("all-messages")
      .setAttribute("data-requestflag", "true");
    document
      .getElementById("all-messages")
      .setAttribute("data-loadfinish", "true");
  }
};

// If reloading message, remove all messages in chatbox and add the end marker back
const reloadSettings = (allMsgNode) => {
  removeAllChildren("all-messages");
  const endOfMsgMarker = document
    .getElementById("end-of-all-messages")
    .cloneNode(true);
  allMsgNode.appendChild(endOfMsgMarker);
  allMsgNode.setAttribute("data-lastscrollheight", "");
};

const clearMsgTemplate = () => {
  removeAllChildren("user-name-message");
  removeAllChildren("text-message");
  removeAllChildren("sent-at-message");
  removeAllChildren("edited-at-message");
};

// send message
export const sendMessage = () => {
  const inputNode = document.getElementById("text-input-message");
  const msgInput = inputNode.value;
  inputNode.value = "";
  const pattern = /^\s*$/;
  // check whether msg valid
  if (msgInput.length === 0 || pattern.test(msgInput)) {
    errorModalPop("Sent message cannot be empty");
    return;
  }
  const channelId = document.getElementById("channel").dataset.id;
  fetchSendMessage(channelId, msgInput, "");
};

// fill the current message into the edit msg modal
export const fillMsgToEditModal = (id) => {
  const MsgNode = document.getElementById("message-" + id);
  const textNode = MsgNode.querySelector(".text-message");
  const textString = textNode.firstChild.nodeValue;
  const modalInputNode = document.getElementById("text-message-edit");
  modalInputNode.setAttribute("data-msgid", id);
  modalInputNode.setAttribute("data-origin", textString);
  removeAllChildren("text-message-edit");
  modalInputNode.value = textString;
};

// edit a particular sent message
export const editMessage = () => {
  const modalInputNode = document.getElementById("text-message-edit");
	const imgInputNode = document.getElementById("image-input-message-edit");
  // Check if it is the same as before
  if (modalInputNode.value === modalInputNode.dataset.origin && !imgInputNode.files[0]) {
    errorModalPop("You haven't editted the message.");
    return;
  }
  const edittedMsg = document.getElementById("text-message-edit").value;
  const channelId = document.getElementById("channel").dataset.id;
  const messageId = document.getElementById("text-message-edit").dataset.msgid;
	const file = imgInputNode.files[0];
	if (file) {
		fileToDataUrl(file)
			.then((res) => {
				fetchEditMessage(messageId, channelId, "", res);
			})
			.catch(() => {
				errorModalPop("invalid image uploaded");
			});
	} else {
  	fetchEditMessage(messageId, channelId, edittedMsg, "");
	}
};

// set message id to the delete modal
export const setAttributeToDeleteModal = (id) => {
  const modal = document.getElementById("message-delete-modal");
  modal.setAttribute("data-msgid", id);
};

export const deleteMessage = () => {
  const channelId = document.getElementById("channel").dataset.id;
  const messageId = document.getElementById("message-delete-modal").dataset
    .msgid;
  fetchDeleteMessage(channelId, messageId);
};

export const sendImage = (node) => {
  const channelId = document.getElementById("channel").dataset.id;
  const file = node.files[0];
  fileToDataUrl(file)
    .then((res) => {
      fetchSendMessage(channelId, "", res);
    })
    .catch(() => {
      errorModalPop("invalid image uploaded");
    });
};

// zoom in the picture in a modal
export const loadBigImage = (node) => {
  removeAllChildren("image-modal-body");
  const modalBody = document.getElementById("image-modal-body");
  node.width = 350;
  node.height = 350;
  modalBody.appendChild(node);
};

// set the color of pin button by the pinned state
const getPinState = (node, state) => {
  if (state === true) {
    node.style.backgroundColor = "#00008B";
    node.setAttribute("data-clicked", "true");
  } else {
    node.setAttribute("data-clicked", "false");
  }
};

// decide pin or unpin according to the button state
export const clickPin = (pinNode) => {
  const pinState = pinNode.dataset.clicked;
  const channelId = document.getElementById("channel").dataset.id;
  const msgId = pinNode.dataset.id;
  if (pinState === "true") {
    fetchUnpin(channelId, msgId);
  } else {
    fetchPin(channelId, msgId);
  }
};

// get all pinned post and load it into pin modal
export const getAllPinnedPosts = () => {
  removeAllChildren("pinned-modal-body");
  const channelId = document.getElementById("channel").dataset.id;
  const token = localStorage.getItem("token");
  fetchAllPostsPromise(channelId, token).then((res) => {
    const pinnedMsgs = res.filter((message) => message.pinned);
    appendMessageToChatbox(pinnedMsgs, 0, true);
  });
};

// decide react or unreact according to the button state
export const react = (node) => {
  const type = node.dataset.type;
  const msgId = node.dataset.id;
  const channelId = document.getElementById("channel").dataset.id;
  const clicked = node.dataset.clicked;
  if (clicked === "false") {
    fetchReact(channelId, msgId, type);
  } else {
    fetchUnreact(channelId, msgId, type);
  }
};

// decide which color to display according to the react state
export const getReactState = (node, reactArray, type) => {
  const userId = localStorage.getItem("userId");
  // filter out the
  const filteredArray = reactArray.filter(
    (item) => item.user === Number(userId) && item.react === type
  );
  if (filteredArray.length) {
    node.style.backgroundColor = "#00008B";
    node.setAttribute("data-clicked", "true");
  } else {
    node.setAttribute("data-clicked", "false");
  }
};
