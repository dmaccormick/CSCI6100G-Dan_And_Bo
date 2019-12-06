// Keep a reference to the button object in the scene so it can be changed at any time
const buttonObject = document.getElementById('btn');

// Randomize the button styling information
GenerateNewButtonStyle = () => 
{
    // Create a new label object so we can hold onto the label info for later
    const labelInfo = new LabelInfo();

    // Base Colour
    const colours = ["red", "orange", "yellow", "green", "blue", "purple"];
    const selectedColourIndex = Math.floor(Math.random() * colours.length);
    const selectedColour = colours[selectedColourIndex];
    buttonObject.style.setProperty("background", selectedColour);
    labelInfo.SetBackgroundColour(selectedColour);

    // Border width
    const borderWidths = ['1px', '2px', '3px', '4px', '5px', '6px', '7px', '8px', '9px', '10px'];
    const borderWidthIndex = Math.floor(Math.random() * borderWidths.length);
    const borderWidth = borderWidths[borderWidthIndex];
    buttonObject.style.setProperty("border-width", borderWidth);
    labelInfo.SetBorderWidth(borderWidth);

    // Border colour
    const borderColourIndex = Math.floor(Math.random() * colours.length);
    const selectedBorderColour = colours[borderColourIndex];
    buttonObject.style.setProperty("border-color", selectedBorderColour);
    labelInfo.SetBorderColour(selectedBorderColour);

    // Border style
    const borderStyles = ["solid", "dashed", "inset", "dotted", "outset", "ridge", "double", "groove"];
    const borderStyleIndex = Math.floor(Math.random() * borderStyles.length);
    const borderStyle = borderStyles[borderStyleIndex];
    buttonObject.style.setProperty("border-style", borderStyle);
    labelInfo.SetBorderStyle(borderStyle);

    // Font size
    const fontSizes = ['10px', '15px', '20px', '25px', '30px', '35px', '40px', '45px', '50px'];
    const fontSizeIndex = Math.floor(Math.random() * fontSizes.length);
    const fontSize = fontSizes[fontSizeIndex];
    buttonObject.style.setProperty("font-size", fontSize);
    labelInfo.SetFontSize(fontSize);

    // Border Radius
    const borderRadiusIndex = Math.floor(Math.random() * fontSizes.length);
    const borderRadius = fontSizes[borderRadiusIndex];
    buttonObject.style.setProperty("border-radius", borderRadius);
    labelInfo.SetBorderRadius(borderRadius);

    // Shadow size (on the y axis only)
    const shadowSizeIndex = Math.floor(Math.random() * borderWidths.length);
    const shadowSize = borderWidths[shadowSizeIndex];
    labelInfo.SetShadowWidth(shadowSize);
    
    // Shadow colour
    const shadowColourIndex = Math.floor(Math.random() * colours.length);
    const shadowColour = colours[shadowColourIndex];
    labelInfo.SetShadowColour(shadowColour);

    // Apply both shadow size and colour
    buttonObject.style.setProperty("box-shadow", `0px ${shadowSize} ${shadowColour}`);

    // Add the label information to the list stored in LabelGenerator.js
    AddLabel(labelInfo);
}

// Create a style tag and put all of the styling there instead
CreateStyleDynamically = () =>
{
    // Create a style tag which lets us put CSS directly into the HTML page
    const styleTag = document.createElement("style");
    document.body.appendChild(styleTag);

    // Set up the base information
    styleTag.sheet.insertRule(".button {background: lightgreen;}", 0);
    styleTag.sheet.insertRule(".button {font-size: 5em;}", 1);

    // Set up the hover information
    styleTag.sheet.insertRule(".button:hover {background: greenyellow}", 2);
    styleTag.sheet.insertRule(".button:hover {border-width: 5px}", 3);

    // Set up the click information
    styleTag.sheet.insertRule(".button:active {background: darkgreen}", 4);
}