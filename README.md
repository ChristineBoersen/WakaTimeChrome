## WakaTimeChrome
WakaTime Extension For Chrome

## Purpose
### Allow logging and categorizing of time spent in Google Chrome to show on your WakaTime
I needed a way to determine where my web browsing was being focused while working, as much of the browsing is work related, but I wanted to be able to determine when I was being distracted by non-work related sites. 

##Usage
### (alpha docs, need to provide better documentation)
* Clone or download the repository
* Open Google Chrome and
* Navigate to chrome://extensions
* In the top right, click "Developer Mode"
* Click "Load Unpacked Extension"
* Navigate to local folder where you extracted the repository and point to the 'WakaTimeChrome\WakatimeExtension\app' within.

You can click 'Options' to edit the JSON string. Note the IgnoredSites array are sites to *NOT LOG ANY TIME FOR*
You can add any number of additional arrays into the JSON string as they are *Language* in WakaTime reporting
You will also see a new icon in the upper right of your google toolbar that looks like a clock. This gets you to options as well.

The extension comes pre-populated with a JSON string to give you ideas of how to segregate your browsing and now lists out the chrome debugger under "Debugging" by default instead of ignoring the site.

**ANY SITE THAT ISN'T LISTED IN THE JSON options string is listed under a language called "Browsing" in WakaTime.**

### 2015-08-27
Initial release

### Added 2015-08-30
The extension is now using *Language* instead of *Branches* to categorize your web browsing. 
The extension is now using your *last_project* value from your most recent heartbeat to determine the project the browsing should be attached too. 
Added content_scripts to inject into pages your are browsing to be able to capture browsing changes and get a heartbeat as soon as you navigate between web pages instead of it waiting for the first interval tick as it had previously. We were already triggering heartbeats on new tabs and tab changes, so this just tightened up the first heartbeat issue when navigating between sites.

There's also a new feature called DeadTime. DeadTime Use Case (long winded): You startup your computer or just come back from a break and hop on the internet. You haven't opened an editor or done any work yet/recently. Without this feature enabled, your web browsing would get attached to the last project you worked on, which most likely you aren't working on right this second. As soon as you start working on a project, your heartbeats will show the correct last_project value on the next heartbeat sent from Chrome automatically. Set to 0 to disable this feature.

### Added 2015-09-03
Added listeners to document.onmousedown and document.onkeydown to capture if the user is actively using the brower. If it is over Deadtime, don't log the heartbeat (unless actively Debugging) again until the user either clicks or presses a key in the active browser window. This is to resolve https://github.com/ChristineBoersen/WakaTimeChrome/issues/2

