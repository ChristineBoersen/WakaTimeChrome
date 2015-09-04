var WakaTimeLastUserInteraction = (Date.now() / 1000);
chrome.tabs.onActivated.addListener(function (activeInfo) {
    try {
        chrome.tabs.get(activeInfo.tabId, function (tab) {
            if (tab) {
                Logtime(tab.url);
            }
        });
    } catch (e) {
        consle.log("Error in tabs.onActivated " + e.message);
    }

});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, updatedTab) {
    try {
        chrome.tabs.query({ 'active': true }, function (activeTabs) {
            var activeTab = activeTabs[0];

            if (activeTab == updatedTab) {
                Logtime(activeTab.url);
            }
        });
    } catch (e) {
        consle.log("Error in tabs.onUpdated " + e.message);
    }

});

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    
      if (request && request.data && request.data == "heartbeat" && sender.tab) {
          Logtime(sender.tab.url);
      }

      if (request && request.data && request.data == "mousedown" && sender.tab) {
          WakaTimeLastUserInteraction = (Date.now() / 1000);
      }

      if (request && request.data && request.data == "keydown" && sender.tab) {
          WakaTimeLastUserInteraction = (Date.now() / 1000);
      }
  });


function Logtime(newUrl) {
    var url = String(newUrl).split('/')[2];
    if (url == null || url == undefined) { return; } // If we don't have a URL, exit

    var _Filter;
    var _Enabled;
    var _DeadTime;
    var _FilterObj;

    chrome.storage.sync.get({
        Filter: '',
        Enabled: true,
        DeadTime: 0
    }, function (items) {
        _Filter = items.Filter;
        _Enabled = items.Enabled;
        _DeadTime = items.DeadTime;

        // If we aren't enabled, exit the function
        if (_Enabled == false) { return; }

        try {
            _FilterObj = JSON.parse(_Filter);
        } catch (e) {
            console.log("Unknown error reading filter: " + _Filter + "\r\n" + e.message);
            return;
        }

        $.ajax({
            method: "GET",
            url: "https://wakatime.com/api/v1/users/current",
            complete: function (xhr, timeDataReturn) {
                if (timeDataReturn != "success") {
                    debugger;
                }
                else {
                    //console.log('Retrieved stats');
                    //debugger;


                    var Project = xhr.responseJSON["data"]["last_project"];

                    // Get the Age of the last HeartBeat
                    var Age = (Date.now() / 1000) - (Date.parse(xhr.responseJSON["data"]["last_heartbeat"]) / 1000);

                    // If _DeadTime is enabled, and the Age of the last heartbeat is Older than the _DeadTime, assume we aren't actively coding.
                    if (_DeadTime > 0 && Age > _DeadTime ) {
                        Project = "Chrome WebBrowsing";
                    }

                    var Age = (Date.now() / 1000) - WakaTimeLastUserInteraction;

                    if (_DeadTime > 0 && Age > _DeadTime && Project != "Debugging")
                    {
                        console.log("No User Interaction in " + Age + " Seconds. Heartbeat not sent.")
                        return;
                    }

                    var Language = GetLanguage(_FilterObj, url);
                    if (Language == "" || Language == "IgnoredSites") { console.log('Ignored Site'); return; }


                    // Build object to pass to wakatime
                    timeData = new Object();

                    timeData.entity = url;
                    timeData.type = "url";
                    timeData.time = (new Date().getTime()) / 1000;
                    timeData.project = Project,
                    timeData.branch = "Chrome WebBrowsing",
                    timeData.language = Language;
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
                                console.log('Sent Heartbeat ' + Language);
                            }
                        },
                        contentType: "application/json",
                        dataType: "json"

                    });
                }
            },
            contentType: "application/json",
            dataType: "json"

        });



    });
}

function GetLanguage(_Filter, url) {

    if (_Filter != null) {
        for (var Language in _Filter) {
            if (Language == "Ignored Sites") {
                for (var ignoreurl in _Filter[Language]) {
                    if (url.toLowerCase().indexOf(_Filter[Language][ignoreurl].toLowerCase()) > -1) {
                        return "";
                    }
                }
            }
            else {
                for (var Languageurl in _Filter[Language]) {
                    if (url.toLowerCase().indexOf(_Filter[Language][Languageurl].toLowerCase()) > -1) {
                        return Language;
                    }
                }
            }

        }
    }
    return "Browsing";
}

var pollInterval = 1000 * 15; // 15 seconds, in milliseconds
window.setInterval(startRequest, pollInterval);
function startRequest() {

    chrome.tabs.getSelected(null, function (tab) {

        try {
            if (tab) {
                Logtime(tab.url);
            }
        } catch (e) {

        }


    });

}