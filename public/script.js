const tbodyEl = document.querySelector("#tbody")
const addButton = document.querySelector("#add-row");
const saveButton = document.querySelector("#save-button");

const addInsertRow = () => {
  const newRow = `
  <tr id="new-row" class=key-value-row">
    <td id="check" class="checkmark-td"></td>
    <td id="row-td">
      <textarea id="key" rows="1" class="new-pair-key" placeholder="key..." onkeydown="disableKeys(event)"></textarea>
    </td>
    <td id="value-td" class="value-td">
      <textarea id="value" rows="1" class="new-pair-value" placeholder="value..." onkeydown="disableKeys(event)" ></textarea>
    </td>
    <td class="table-addrow-x pointer" onClick="cancelAdd()">
      <img class="pointer" src="./x-icon.svg" loading="lazy"/>
    </td>
  </tr>
  `;
  tbodyEl.innerHTML += newRow;
  const row = document.getElementById("new-row");
  try {
    const newKey = document.querySelector('#key');
    const newValue = document.querySelector('#value');
    row.addEventListener('keyup', () => {
      if (newKey.value && newValue.value) {
        enableSaveButton();
      } else {
        disableSaveButton();
      }
    })
    disableAddButton();
  } catch (error) {
    generateErrorMessage('Unknown error.')
  }  }

const cancelForm = () => {
  const newRow = document.querySelector('#new-row');
  if (newRow) {
    tbodyEl.removeChild(newRow);
  }
}

// Reloads window 
const reload = () => {
  location.reload();
}

// Inserts a key-value pair in the database
const addRow = () => {
  let tBody = document.querySelector("#tbody");
  const key = document.querySelector("#new-row #row-td #key").value;
  const value = document.querySelector("#new-row #value-td #value").value;
  if (key.includes(" ") || value.includes(" ")) {
    generateErrorMessage("Key or value includes a space character.");
    return;
  }
  fetch('/api/post', {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: key,
      value: value
    })
  }).then(response => {
    return response.json();
  }).then(data => {
    // Add new row to the frontend table
    if(data.promise.success) {
      const id = data.promise.id;
      removeErrorMessage();
      document.querySelector("#new-row").remove();
      tBody.innerHTML += `
      <tr id="row-${id}">
        <td class="checkmark-td">
          <div class="flex-center">
            <img src="./checkmark.svg" alt="checkmark" loading="lazy"/>
          </div>
        </td>
        <td>
          <textarea id="key-id-${id}" rows="1" placeholder="Key..." disabled>${key}</textarea>
        </td>
        <td class="value-td">
          <textarea id="value-${id}" rows="1" placeholder="Value..." disabled>${value}</textarea>
        </td>
        <td class="p-relative">
          <div id="delete-${id}" class="flex-center pointer icon-container" onClick="openDeletePopup('${id}')">
            <img class="x-icon" src="./x-icon.svg" alr="x icon" loading="lazy"/>
          </div>
          <div data-value="${id}" class="popup" id="delete-popup-${id}">
            <span class="popuptext" id="myPopup">
              Confirm <br />
              <button class="delete-button" onclick="deleteRow('${id}')">
                Delete
              </button>
            </span>  
          </div>
        </td>
      </tr>
      `
      try {
        document.querySelector('#items-counter').innerHTML = data.counter.data.count;
      } catch (error) {
        document.querySelector("#item-container").innerHTML = `
          <div style="text-align: right; background-color: #EFEFEF; padding: 3px 17px; border: 1px solid #DDDDDD">
            <p style="margin: 0">Items stored: <span id="items-counter">${data.counter.data.count}</span></p>
          </div>
        `;
      }
      enableAddButton();
      disableSaveButton();
    } else {
      generateErrorMessage(data.promise.msg)
    }
  })
}

const deleteRow = (id) => {
  fetch('/api/delete', {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id })
  }).then(response => {        
    return response.json();
  }).then(data => {
    removeErrorMessage();
    if(data.data.success) {
      document.querySelector(`#row-${id}`).remove();
      if (data.counter.data.count > 0) {
      document.querySelector('#items-counter').innerHTML = data.counter.data.count;
      } else {
        document.querySelector('#item-container').innerHTML = '';
      }
    } else {
      generateErrorMessage(data.promise.msg)
    }
  })
}

// Popup action
const openDeletePopup = (id) => {
  const popups = document.querySelectorAll(`[id^=delete-popup-]`);
  popups.forEach(popup => {
    popup.style.display = "none";
    addOpenPopupFunctionality(id)
  })
  const popup = document.querySelector(`#delete-popup-${id}`);
  popup.style.display = "block";
  addClosePopupFunctionality(id)
}

const closeDeletePopup = (id) => {
  const popup = document.querySelector(`#delete-popup-${id}`);
  popup.style.display = 'none';
  addOpenPopupFunctionality(id)
}

const addClosePopupFunctionality = (id) => {
  const icon = document.querySelector(`#delete-${id}`);
  icon.setAttribute('onClick', `closeDeletePopup('${id}')`)
}

const addOpenPopupFunctionality = (id) => {
  const icon = document.querySelector(`#delete-${id}`);
  icon.setAttribute('onClick', `openDeletePopup('${id}')`);    
}

// Utilities

const disableAddButton = () => {
  addButton.disabled = true;
  addButton.querySelector('img').classList.add('disabled-img');
}

const enableAddButton = () => {
  addButton.disabled = false;
  addButton.querySelector('img').classList.remove('disabled-img');
}

const disableSaveButton = () => {
  saveButton.disabled = true;
  saveButton.querySelector('img').classList.add('disabled-img');
}

const enableSaveButton = () => {
  saveButton.disabled = false;
  saveButton.querySelector('img').classList.remove('disabled-img');    
}

const cancelAdd = () => {
  document.querySelector('#new-row').remove();
  disableSaveButton();
  enableAddButton();
}

const generateErrorMessage = (message) => {
  const errorContainer = document.querySelector("#errors");
  const checkContainer = document.querySelector("#check");
  const images = checkContainer.getElementsByTagName('img');
  if(images.length < 1) {
    const icon = document.createElement('img');
    icon.classList.add('flex-center');
    icon.setAttribute('src', './alert.svg');
    icon.setAttribute('loading', 'lazy');
    checkContainer.appendChild(icon);
  }
  errorContainer.innerHTML = message;
}

const removeErrorMessage = () => {
  const errorContainer = document.querySelector("#errors");
  errorContainer.innerHTML = "";
}

const disableKeys = (e) => {
if (e.key === "Enter" || e.key === " ") {
  e.preventDefault();
}
};