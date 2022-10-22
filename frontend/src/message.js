import {
  appendDate,
  appendText,
  errorModalPop,
  removeAllChildren,
} from "./helpers.js";
import {
  fetchDeleteMessage,
  fetchEditMessage,
  fetchSendMessage,
} from "./messagesApi.js";
import { fetchSingleUserInfoForMessage } from "./usersApi.js";

export const appendMessageToChatbox = (messages, start) => {
  const allMsgNode = document.getElementById("all-messages");
  // If reloading message, remove all messages in chatbox and add the end marker back
  if (start === 0) {
    removeAllChildren("all-messages");
    const endOfMsgMarker = document
      .getElementById("end-of-all-messages")
      .cloneNode(true);
    allMsgNode.appendChild(endOfMsgMarker);
		allMsgNode.setAttribute("data-lastscrollheight", "");
  }
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
  messages.forEach((message) => {
		console.log(message);
    clearMsgTemplate();
    // Count the number of messages
    const currNumOfMsg = Number(allMsgNode.dataset.number) + 1;
    allMsgNode.setAttribute("data-number", currNumOfMsg);
    // Copy from the template
    const newMsgNode = document
      .getElementById("single-message")
      .cloneNode(true);
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
    const avatarContainerNode = newMsgNode.querySelector(".user-name-message");
    // remove id attributes
    userNameNode.setAttribute("id", "");
		userNameNode.setAttribute("data-senderid", message.sender);
    textMsgNode.setAttribute("id", "");
    sentAtMsgNode.setAttribute("id", "");
    editedAtMsgNode.setAttribute("id", "");
    avatarContainerNode.setAttribute("id", "");
    // append text into the infomation nodes
    fetchSingleUserInfoForMessage(
      message.sender,
      avatarContainerNode,
      userNameNode
    );
    appendText(textMsgNode, message.message);
    appendDate(sentAtMsgNode, message.sentAt);
    if (message.editedAt !== null)
      appendDate(editedAtMsgNode, message.editedAt);
    // append the whole msg node to the chatbox
    const parentDiv = document.getElementById("all-messages");
    const firstMsgElement = document.getElementById("all-messages").firstChild;
    parentDiv.insertBefore(newMsgNode, firstMsgElement);
    // set the outest node and the img container to display flex
    const appendedNode = document.getElementById("message-" + message.id);
    appendedNode.style.display = "flex";
    const appendedNodeImgContainer = document.getElementById(
      "avatar-message-container-" + message.id
    );
    appendedNodeImgContainer.style.display = "flex";
  });
  // Automatically scroll down to the end after loading all messages
  allMsgNode.scrollTop = allMsgNode.dataset.lastscrollheight
    ? allMsgNode.scrollHeight - allMsgNode.dataset.lastscrollheight
    : allMsgNode.scrollHeight;
	console.log(allMsgNode.dataset.lastscrollheight)
	console.log(allMsgNode.scrollTop, allMsgNode.scrollHeight)
  allMsgNode.setAttribute("data-lastscrollheight", allMsgNode.scrollHeight);
};

const clearMsgTemplate = () => {
  removeAllChildren("user-name-message");
  removeAllChildren("text-message");
  removeAllChildren("sent-at-message");
  removeAllChildren("edited-at-message");
};

export const sendMessage = () => {
  const msgInput = document.getElementById("text-input-message").value;
  const pattern = /^\s*$/;
  if (msgInput.length === 0 || pattern.test(msgInput)) {
    errorModalPop("Sent message cannot be empty");
    return;
  }
  const channelId = document.getElementById("channel").dataset.id;
  fetchSendMessage(channelId, msgInput, "");
};

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

export const editMessage = () => {
  const modalInputNode = document.getElementById("text-message-edit");
  if (modalInputNode.value === modalInputNode.dataset.origin) {
    errorModalPop("You haven't editted the message.");
    return;
  }
  const edittedMsg = document.getElementById("text-message-edit").value;
  const channelId = document.getElementById("channel").dataset.id;
  const messageId = document.getElementById("text-message-edit").dataset.msgid;
  fetchEditMessage(messageId, channelId, edittedMsg, "");
};

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
