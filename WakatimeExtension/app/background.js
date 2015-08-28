chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        Logtime(tab.url);
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
    chrome.tabs.query({ 'active': true }, function (activeTabs) {
        var activeTab = activeTabs[0];

        if (activeTab == updatedTab) {
            Logtime(activeTab.url);
        }
    });
});


function Logtime(newUrl) {
    var url = String(newUrl).split('/')[2];
    if (url == null || url == undefined) { return; } // If we don't have a URL, exit

    var _Filter;
    var _Enabled;
    var _FilterObj;

    chrome.storage.sync.get({
        Filter: '',
        Enabled: true
    }, function (items) {
        _Filter = items.Filter;
        _Enabled = items.Enabled;


        // If we aren't enabled, exit the function
        if (_Enabled == false) { return; }

        try {
            _FilterObj = JSON.parse(_Filter);
        } catch (e) {
            console.log("Unknown error reading filter: " + _Filter + "\r\n" + e.message);
            return;
        }


        var Branch = GetBranch(_FilterObj, url);
        if (Branch == "" || Branch == "IgnoredSites") { console.log('Ignored Site'); return; }


        // Build object to pass to wakatime
        timeData = new Object();

        timeData.entity = url;
        timeData.type = "url";
        timeData.time = (new Date().getTime()) / 1000;
        timeData.project = "Chrome WebBrowsing",
        timeData.branch = Branch,
        timeData.language = "WebBrowsing";
        timeData.dependencies = "";
        timeData.lines = 1;
        timeData.lineno = 1;
        timeData.cursorpos = 1;
        timeData.is_write = false;
        timeData.is_debugging = false;

        // Send object to wakatime. If there was an error and we have a debugger running, fire a breakpoint;
        $.ajax({
            method: "POST",
            url: "https://wakatime.com/api/v1/users/current/heartbeats",
            data: JSON.stringify(timeData),
            complete: function (xhr, timeDataReturn) {
                if (timeDataReturn != "success") {
                    //debugger; 
                }
                else {
                    console.log('Sent Heartbeat');
                }
            },
            contentType: "application/json",
            dataType: "json"

        });

    });
}

function GetBranch(_Filter, url) {

    if (_Filter != null) {
        for (var branch in _Filter) {
            if (branch == "Ignored Sites") {
                for (var ignoreurl in _Filter[branch]) {
                    if (url.toLowerCase().indexOf(_Filter[branch][ignoreurl].toLowerCase()) > -1) {
                        return "";
                    }
                }
            }
            else {
                for (var branchurl in _Filter[branch]) {
                    if (url.toLowerCase().indexOf(_Filter[branch][branchurl].toLowerCase()) > -1) {
                        return branch;
                    }
                }
            }

        }
    }
    return "Browsing";
}

var pollInterval = 1000 * 15; // 15 seconds, in milliseconds
window.setTimeout(startRequest, pollInterval);
function startRequest() {
        
    chrome.tabs.getSelected(null, function (tab) {

        Logtime(tab.url);

    });

}