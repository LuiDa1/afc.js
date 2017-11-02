// Gets all the nessesary Elements, or creates the variables for them
var ascii = document.querySelector('.ascii');
var asciiLines = ascii.querySelectorAll('pre');
var colorSpans;

// Stores the attributes/settings
var colorInterval = ascii.getAttribute('ascii_interval');
var asciiRandom = ascii.getAttribute('ascii_random');
var asciiColorRandom = ascii.getAttribute('ascii_color_random');
var asciiColorType = ascii.getAttribute('ascii_color_type');

// This fn creates 1 configuration at a time with the necessary information
function configCreator(characters, startColor, endColor, shadowCorrection) {
  return {
    characters,
    startColor,
    endColor,
    shadowCorrection,
    currentColor: []
  };
}

// Generates a random color based on the asciiColorType attribute
function randomColor() {
  if (asciiColorType === 'rgb') {
    return [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255)
    ];
  } else if (asciiColorType === 'hsl') {
    return [
      Math.floor(Math.random() * 360),
      Math.floor(Math.random() * 100) + '%',
      Math.floor(Math.random() * 100) + '%'
    ];
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
        ascii.style.color = asciiColorType + '(' + config.currentColor + ')';
      });
    });
  });
}

// Initial definition of the characters, with start and end color + optional shadowcorrection,
// the shadowcorrection is necessary for certain fonts, that have a shadow-effect,
// the shadowcorrection makes sure that the "foreground" characters have the steps set
// for the last line with the characters
var configs = [
  configCreator(['█','▌','▄','▀'], [255,140,0], [255,0,255], 1),
  configCreator(['═','║','╔','╗','╝','╚'], [100,0,0], [255,0,0], 0)
];

// Sets the classess for the different characters
lineCrawler();
// Sets the color initiali, is necessary for the case, where you don't want a random color
setColor(asciiLines, asciiColorType);

// Stores all span elements that have been created by this script
colorSpans = ascii.querySelectorAll('span');

// Sets the css transition-speed according to the ascii_interval attribute
colorSpans.forEach(function(span) {
  span.style.transition = 'color ' + colorInterval + 's linear';
});

// If you want a random color interval, make sure the ascii element has the asciiRandom attribute,
// WITHOUT a value
if (asciiRandom === '') {
  window.setInterval(function() {
    configs = [
      configCreator(['█','▌','▄','▀'], randomColor(), randomColor(), 1),
      configCreator(['═','║','╔','╗','╝','╚'], randomColor(), randomColor(), 0)
    ];

    setColor(asciiLines, asciiColorType);
  }, colorInterval * 1000);
}

// If you want a random initial color, make sure the ascii element has the asciiColorRandom attribute,
// WITHOUT a value
if (asciiColorRandom === '') {
  configs = [
    configCreator(['█','▌','▄','▀'], randomColor(), randomColor(), 1),
    configCreator(['═','║','╔','╗','╝','╚'], randomColor(), randomColor(), 0)
  ];

  setColor(asciiLines, asciiColorType);
}