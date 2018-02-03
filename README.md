# [meo](https://haiderzia2002.github.io/meo/)
HTML5 &lt;video>/&lt;audio> player that focuses on efficiency, customisability and functionality. A demo can be found on the [project site](https://haiderzia2002.github.io/meo/).

# Features
* Skins
* Progress bar
* Loading bar
* Time float
* Fullscreen
* Fallback
* Keyboard controls
* Controls auto-hide
* jQuery required

# Browser support
* Desktop
  * Internet Explorer (Latest)
  * Edge (Latest)
  * Safari (Latest)
  * Firefox (Latest)
  * Chrome/Opera (Latest)
* Mobile
  * iOS (Latest)
  * Android Firefox (Latest)
  * Android Chrome (Latest)

# Usage
1. [Download meo](https://github.com/haiderzia2002/meo/releases)
1. Add CSS and JS to &lt;head>.
    ```html
    <script src="path/to/meo.js"></script>
    <link rel="stylesheet" type="text/css" href="path/to/meo.css">
    ```
1. Add this to your JavaScript. Where "video, audio" is, replace with the identifier for one or more &lt;video>/&lt;audio> elements.
    ```javascript
    $("video, audio").meo()
    ```
1. Optionally configure according to the guidelines below.
    ```javascript
    $("video, audio").meo({
    timeFormat: "default", // This sets the format that the time is displayed in. Choose "hhmmss", "mmss" or "default"
    hideTime: "2000", // Time it should take for controlbar to hide after mouse inactivity in milliseconds
    skip: "5" // Number of seconds the keyboard shortcuts (ArrowLeft, j, l and ArrowRight) should move
    });
    ```
