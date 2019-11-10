// Keep a reference to the button object in the scene so it can be changed at any time
const buttonObject = document.getElementById('btn');

// Randomize the button styling information
GenerateNewButtonStyle = () => 
{
    // Base Colour
    const colourR = Math.floor(Math.random() * 256);
    const colourG = Math.floor(Math.random() * 256);
    const colourB = Math.floor(Math.random() * 256);
    const colourA = Math.random(); // Alpha is on a range from 0 - 1
    buttonObject.style.setProperty("background", `rgba(${colourR},${colourG},${colourB},${colourA})`);

    // Border width
    const borderWidth = Math.floor(Math.random() * 10);
    buttonObject.style.setProperty("border-width", `${borderWidth}px`)

    // Border colour
    const borderColourR = Math.floor(Math.random() * 256);
    const borderColourG = Math.floor(Math.random() * 256);
    const borderColourB = Math.floor(Math.random() * 256);
    buttonObject.style.setProperty("border-color", `rgb(${borderColourR},${borderColourG},${borderColourB})`);

    // Border style
    const borderStyles = ["solid", "dashed", "inset", "dotted", "outset", "ridge", "double", "groove", "none"];
    const borderStyleIndex = Math.floor(Math.random() * borderStyles.length);
    buttonObject.style.setProperty("border-style", `${borderStyles[borderStyleIndex]}`);

    // Font size
    const fontSize = Math.floor(Math.random() * 60) + 10; // Plus 1 prevents invisible text
    buttonObject.style.setProperty("font-size", `${fontSize}px`);

    // Padding
    const paddingSize = Math.floor(Math.random() * 30);
    buttonObject.style.setProperty("padding", `10px`);

    // Border Radius
    const borderRadius = Math.floor(Math.random() * 50);
    buttonObject.style.setProperty("border-radius", `${borderRadius}px`);

    // Shadow size (on the y axis only)
    const shadowSizeY = Math.floor(Math.random() * 10);
    
    // Shadow colour
    const shadowColourR = Math.floor(Math.random() * 256);
    const shadowColourG = Math.floor(Math.random() * 256);
    const shadowColourB = Math.floor(Math.random() * 256);

    // Apply both shadow size and colour
    buttonObject.style.setProperty("box-shadow", `0px ${shadowSizeY}px rgb(${shadowColourR},${shadowColourG},${shadowColourB})`);
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