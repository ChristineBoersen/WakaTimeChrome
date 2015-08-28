# WakaTimeChrome
WakaTime Extension For Chrome

# Purpose
## Allow logging and categorizing of time spent in Google Chrome to show on your WakaTime
### I needed a way to determine where my web browsing was being focused while working, as much of the browsing is work related, but I wanted to be able to determine when I was being distracted by non-work related sites. 

#Usage
## (alpha docs, need to provide better documentation)
* Clone or download the repository
* Open Google Chrome and
* Navigate to chrome://extensions
* In the top right, click "Developer Mode"
* Click "Load Unpacked Extension"
* Navigate to local folder where you extracted the repository and point to the 'WakaTimeChrome\WakatimeExtension\app' within.

You can click 'Options' to edit the JSON string. Note the IgnoredSites array are sites to *NOT LOG ANY TIME FOR*
You can add any number of additional arrays into the JSON string as they are "Branches" in WakaTime reporting
You will also see a new icon in the upper right of your google toolbar that looks like a clock. This gets you to options as well.

The extension comes pre-populated with a JSON string to give you ideas of how to segregate your browsing. 
**ANY SITE THAT ISN'T LISTED IN THE JSON options string is listed under a branch called "Browsing" in WakaTime.**
