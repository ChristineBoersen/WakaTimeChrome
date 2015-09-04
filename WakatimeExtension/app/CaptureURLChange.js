
chrome.runtime.sendMessage({ data: "heartbeat" }, function (response) {
    //console.log(response.farewell);
});
document.addEventListener("mousedown", function () {

    chrome.runtime.sendMessage({ data: "mousedown" }, function (response) {
        //console.log(response.farewell);
    });
});
document.addEventListener("keydown", function () {

    chrome.runtime.sendMessage({ data: "keydown" }, function (response) {
        //console.log(response.farewell);
    });
});