// Saves options to chrome.storage
function save_options() {
  var secret_schedule = document.getElementById('secret_sche').checked;
  var selected_date = document.getElementById('selected_date').value;

  chrome.storage.sync.set({
    secret: secret_schedule,
    select: selected_date
  }, function () {
    var status = document.getElementById('status');
    status.textContent = 'Saved';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    secret: '',
    select: ''
  }, function (items) {
    document.getElementById('secret_sche').checked = items.secret;
    document.getElementById('selected_date').value = items.select;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);