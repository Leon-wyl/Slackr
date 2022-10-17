import { appendDate, appendText, removeAllChildren } from "./helpers.js";

export const appendMessageToChatbox = (messages, start) => {
	// If reloading message, remove all messages in chatbox and add the end marker back
	if (start === 0) {
		removeAllChildren("all-messages");
		const endOfMsgMarker = document.getElementById("end-of-all-messages").cloneNode(true);
		document.getElementById("all-messages").appendChild(endOfMsgMarker);
	}
	messages.forEach(message => {
		clearMsgTemplate();
		// Copy from the template
		const newMsgNode = document.getElementById("single-message").cloneNode(true);
		// set the message id to outside nodes of the msg
		newMsgNode.setAttribute("data-id", message.id);
		newMsgNode.setAttribute("id", "message-" + message.id);
		const container = newMsgNode.querySelector("#avatar-message-container");
		console.log(container)
		container.setAttribute("id", "avatar-message-container-" + message.id)
		const userNameNode = newMsgNode.querySelector(".user-name-message");
		const textMsgNode = newMsgNode.querySelector(".text-message");
		const sentAtMsgNode = newMsgNode.querySelector(".sent-at-message");
		const editedAtMsgNode = newMsgNode.querySelector(".edited-at-message");
		// remove id attributes
		userNameNode.setAttribute("id", "");
		textMsgNode.setAttribute("id", "");
		sentAtMsgNode.setAttribute("id", "");
		editedAtMsgNode.setAttribute("id", "");
		// append text into the infomation nodes
		appendText(userNameNode, message.sender.toString())
		appendText(textMsgNode, message.message);
		appendDate(sentAtMsgNode, message.sentAt);
		if (message.editedAt !== null) appendDate(editedAtMsgNode, message.editedAt);
		// append the whole msg node to the chatbox
		const parentDiv = document.getElementById("all-messages");
		const firstMsgElement = document.getElementById("all-messages").firstChild;
		parentDiv.insertBefore(newMsgNode, firstMsgElement);
		// set the outest node and the img container to display flex
		const appendedNode = document.getElementById("message-" + message.id);
		console.log(appendedNode)
		appendedNode.style.display = "flex";
		const appendedNodeImgContainer = document.getElementById("avatar-message-container-" + message.id);
		console.log(appendedNodeImgContainer)
		appendedNodeImgContainer.style.display ="flex";
	});
	document.getElementById("all-messages").scrollTop = document.getElementById("all-messages").scrollHeight;
}

const clearMsgTemplate = () => {
	removeAllChildren("user-name-message");
	removeAllChildren("text-message");
	removeAllChildren("sent-at-message");
	removeAllChildren("edited-at-message");
}