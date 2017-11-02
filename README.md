# afc.js
afc.js - ASCII Font Colorizer in JavaScript

![Header IMG that shows the capabilitys of the script](img/header.gif)

## Overview
afc.js is a script that colorizes ASCII Fonts. The script works in two steps:
1. It searches the Text for specific characters and puts the associating characters in a <span> element with the .ascii'configID' class.
2. It gets all the associated classes and adds the inline-css-color. If specified it will also repeat this step with random colors and also animate the change via CSS Transitions

## Configuration
In order to work the Script needs an container-element with the .ascii class, containing the <pre> elements.

More info following soon...

## Todo
- hsl color support (not working right now)
- Cleanup the configuration options
- Create a way to specify the characters once, and add the start and end colors later
- Write examples with images (in the docs)

## Where do I get ASCII fonts?
Different ASCII Fonts can be fount here:
- [Patorjk's Text to ASCII Art Generator](http://www.patorjk.com/software/taag/#p=testall&f=Alpha&t=AFC.JS)
- [FIGlet](http://www.figlet.org/)
- Or any other ASCII Art resource ;-)