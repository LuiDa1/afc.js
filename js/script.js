// Gets all the nessesary Elements, or creates the variables for them
var ascii = document.querySelector('.ascii');
var asciiLines = ascii.querySelectorAll('pre');
var colorSpans;
var configs = [];

// Stores the attributes/settings
var asciiColorType = ascii.getAttribute('ascii_color_type');
var asciiRandomColor = ascii.getAttribute('ascii_random_color');
// Should be a Number, leave it empty for a Strobo-Effect
var asciiInterval = ascii.getAttribute('ascii_interval');

// Get the Config from the ascii_characters attripute of the .ascii element
var asciiCharacters = ascii.getAttribute('ascii_characters').split(',');

// Generates a random color based on the asciiColorType attribute
function randomColor() {
  // Generates a color array
  function colorGen(value1, value2, value3) {
    return [
      Math.floor(Math.random() * value1),
      Math.floor(Math.random() * value2),
      Math.floor(Math.random() * value3)
    ];
  }

  // CURRENTLY NOT WORKING // HSL
  if (asciiColorType === 'hsl') {
    return colorGen(360,100,100);

  // default RGB, also in case of an error...
  } else {
    return colorGen(255,255,255);
  }
}

// Calculates the Color steps between the start and end colors, depending on the available lines
function calculateSteps(config) {
  config.colorSteps = [];

  config.endColor.forEach(function(color, colorIndex) {
    config.colorSteps.push(Math.floor((color - config.startColor[colorIndex]) / asciiLines.length - config.shadowCorrection));
  });
}

// Sets the current Color, is run for each span
function setCurrentColor(line, lineIndex, config, configIndex) {
  if(lineIndex === 0) {
    config.currentColor = config.startColor;

  } else if(lineIndex + 1 === asciiLines.length) {
    config.currentColor = config.endColor;

  } else {
    config.currentColor.forEach(function(color, colorIndex) {
      config.currentColor[colorIndex] = color + config.colorSteps[colorIndex];
    });
  }
}

// Loops over every character and creates the classes for the different caracters.
function characterCrawler(lineArray) {
  var lastCharacter = '';

  lineArray.forEach(function (character, characterIndex) {
    var beginning = '';
    var closure = '';

    configs.forEach(function(config, configIndex) {
      if (config.characters.includes(lastCharacter) && !config.characters.includes(character)) {
        closure += '</span>';

      } else if (!config.characters.includes(lastCharacter) && config.characters.includes(character)) {
        beginning += '<span class="ascii' + configIndex + '">';
      }
    });

    lineArray[characterIndex] = closure + beginning + character;
    lastCharacter = character;
  });
}

// Loops over every line to create the class
function lineCrawler() {
  asciiLines.forEach(function (line, lineIndex) {
    var lineArray = line.innerHTML.split('');

    characterCrawler(lineArray);

    line.innerHTML = lineArray.join('');
  });
}

// Sets (renders) the color for each line, depending of the character type and color grade(step)
function setColor(asciiLines, asciiColorType) {
  configs.forEach(function(config, configIndex) {

    calculateSteps(config);

    asciiLines.forEach(function (line, lineIndex) {
      setCurrentColor(line, lineIndex, config, configIndex);

      var asciiSelection = line.querySelectorAll('.ascii' + configIndex);

      asciiSelection.forEach(function(ascii) {
        //ascii.style.color = asciiColorType + '(' + config.currentColor + ')';
        ascii.style.color = 'rgb' + '(' + config.currentColor + ')';
      });
    });
  });
}

// Initial definition of the characters, with start and end color + optional shadowcorrection,
// the shadowcorrection is necessary for certain fonts, that have a shadow-effect,
// the shadowcorrection makes sure that the "foreground" characters have the steps set
// for the last line with the characters
asciiCharacters.forEach(function(config) {
  configs.push({
    characters: config.split(''),
    startColor: randomColor(),
    endColor: randomColor(),
    shadowCorrection: 0,
  });
});

// Injects the spans/classess for the different characters
lineCrawler();

// Stores all span elements that have been created by this script
colorSpans = ascii.querySelectorAll('span');

// Sets the css transition-speed according to the ascii_interval attribute
colorSpans.forEach(function(span) {
  span.style.transition = 'color ' + asciiInterval + 's linear';
});

// Sets the color initiali, is necessary for the case, where you don't want a random color
setColor(asciiLines, asciiColorType);

// If the asciiInterval is defined, set an interval
if (asciiInterval === '' || asciiInterval.length >= 1) {
  console.log('hello');
  window.setInterval(function() {
    asciiCharacters.forEach(function(config, configID) {
      configs[configID].startColor = randomColor();
      configs[configID].endColor = randomColor();
    });

    setColor(asciiLines, asciiColorType);
  }, asciiInterval * 1000);
}

// If you want a random initial color, make sure the ascii element has the asciiRandomColor attribute,
// WITHOUT a value
if (asciiRandomColor === '') {
  asciiCharacters.forEach(function(config, configID) {
    configs[configID].startColor = randomColor();
    configs[configID].endColor = randomColor();
  });

  setColor(asciiLines, asciiColorType);
}