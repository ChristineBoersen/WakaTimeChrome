// Saves options to chrome.storage.sync.
function save_options() {
    var _Filter = document.getElementById('Filter').value;
    var _Enabled = document.getElementById('Enabled').checked;
    var _DeadTime = document.getElementById('DeadTime').value;
    chrome.storage.sync.set({
        Filter: _Filter,
        Enabled: _Enabled,
        DeadTime: _DeadTime
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
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
    Filter: '{            "Debugging": ["devtools"],            "IgnoredSites": ["newtab", "extensions", "history", "settings"],            "SlackSites": ["facebook.com", "twitter.com"],            "WorkSites": ["localhost", "visualstudioonline.com"]}',
        Enabled: true,
        DeadTime: 600
    }, function (items) {
        document.getElementById('Filter').value = items.Filter;
        document.getElementById('Enabled').checked = items.Enabled;
        document.getElementById('DeadTime').value = items.DeadTime;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);