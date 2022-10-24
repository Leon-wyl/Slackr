import { fetchChannelsInfo } from "./channelsApi.js";

/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
  const validFileTypes = ["image/jpeg", "image/png", "image/jpg"];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error("provided file is not a png, jpg or jpeg image.");
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

// pop the error modal
export const errorModalPop = (msg) => {
  // remove old error messages
  removeAllChildren("notification-modal-title");
  removeAllChildren("notification-modal-body");
  // load new error messages
  const errorLable = document.createTextNode("Error");
  document.getElementById("notification-modal-title").appendChild(errorLable);
  const errorMsgText = document.createTextNode(msg);
  document.getElementById("notification-modal-body").appendChild(errorMsgText);
  // pop the modal
  const modal = new bootstrap.Modal(
    document.getElementById("notification-modal")
  );
  modal.show();
};

// pop the success modal
export const successModalPop = (msg) => {
  // remove old success messages
  removeAllChildren("notification-modal-title");
  removeAllChildren("notification-modal-body");
  // load new error messages
  const errorLable = document.createTextNode("Success");
  document.getElementById("notification-modal-title").appendChild(errorLable);
  const errorMsgText = document.createTextNode(msg);
  document.getElementById("notification-modal-body").appendChild(errorMsgText);
  //pop the modal
  const modal = new bootstrap.Modal(
    document.getElementById("notification-modal")
  );
  modal.show();
};

// load the main page with channel lists
export const loadMainPage = () => {
  hideAllPages();
  document.getElementById("navbar").style.display = "flex";
  fetchChannelsInfo();
  document.getElementById("sidebar-main-page").style.display = "flex";
};

export const hideAllPages = () => {
  document.getElementById("page-signin").style.display = "none";
  document.getElementById("page-register").style.display = "none";
  document.getElementById("navbar").style.display = "none";
  document.getElementById("sidebar-main-page").style.display = "none";
  document.getElementById("channel").style.display = "none";
  document.getElementById("channel-unjoined-card").style.display = "none";
  document.getElementById("profile").style.display = "none";
};

// given an node name, remove all children in that node
export const removeAllChildren = (elementName) => {
  const element = document.getElementById(elementName);
  if (element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
    }
  }
};

// Insert an element after a node
export const insertAfter = (newNode, existingNode) => {
  existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
};

// add text into an element
export const appendText = (targetElement, text) => {
  const textNode = document.createTextNode(text);
  targetElement.appendChild(textNode);
};

// add date into an element
export const appendDate = (targetElement, date) => {
  const dateObject = new Date(date);
  const dateTextNode = document.createTextNode(dateObject.toString());
  targetElement.appendChild(dateTextNode);
};
