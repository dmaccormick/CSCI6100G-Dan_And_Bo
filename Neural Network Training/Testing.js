//--- Data ---//
let neuralNets = [];
let tableOutputCells = [];
let neuralNetsLoaded = false;
let buttonImageLoaded = false;
let nextInteractableID = 0;



//--- p5 Callbacks ---//
function preload()
{
    // Clear the saved info in case of caching
    neuralNets = [];
    tableOutputCells = [];
    neuralNetsLoaded = false;
    buttonImageLoaded = false;
    nextInteractableID = 0;

    // Set up the neural net list
    neuralNets.push(new NeuralNet('nn_background_colour', '_backgroundColour', 6));
    neuralNets.push(new NeuralNet('nn_border_width', '_borderWidth', 10));
    neuralNets.push(new NeuralNet('nn_border_colour', '_borderColour', 6));
    neuralNets.push(new NeuralNet('nn_border_style', '_borderStyle', 8));
    neuralNets.push(new NeuralNet('nn_font_size', '_fontSize', 9));
    neuralNets.push(new NeuralNet('nn_border_radius', '_borderRadius', 9));
    neuralNets.push(new NeuralNet('nn_shadow_size', '_shadowSize', 10));
    neuralNets.push(new NeuralNet('nn_shadow_colour', '_shadowColour', 6));

    // Find all of the table output cells and add them
    for (let colNum = 0; colNum < 3; colNum++) 
    {
        // Add a new array to hold the next column's output cells
        tableOutputCells.push([]);

        // Find all of the cells in that column and add them to the subarray
        neuralNets.forEach(nn => tableOutputCells[colNum].push(document.getElementById(`${nn._name}_${colNum}`)));
    }
}

function setup()
{
    // Initialize all of the neural networks
    neuralNets.forEach(nn => nn.Initialize());

    // Remove the p5 canvas
    noCanvas();
}



//--- UI Callbacks ---//
const OnLoadNeuralNets = () =>
{
    // Load all of the trained neural nets
    neuralNets.forEach(nn => nn.LoadModel());

    // The neural nets are now loaded
    neuralNetsLoaded = true;

    // Attempt to activate all of the analyze buttons
    for (let i = 0; i < 3; i++) {
        ActivateAnalyzeButton(i);
    }
};

const OnImageUploaded = (colNum) =>
{
    // Find the image upload element and get the file from it
    const uploadButton = document.getElementById(`imageUpload_${colNum}`);
    const imageFile = uploadButton.files[0];

    // Find the image display element
    const imageDisplay = document.getElementById(`buttonImg_${colNum}`);

    // Create a new file reader
    const fileReader = new FileReader();

    // Set up the onload callback so that it displays the image by passing the src over
    fileReader.onloadend = () => 
    {
        // Pass the source image over
        imageDisplay.src = fileReader.result;

        // The image is now uploaded
        buttonImageLoaded = true;

        // Attempt to activate the analyze button
        ActivateAnalyzeButton(colNum);
    };

    // Trigger the file reader
    fileReader.readAsDataURL(imageFile);
};

const ActivateAnalyzeButton = (colNum) => 
{
    // If the neural lets are loaded and a button image was selected, we can go ahead and try to analyze it
    document.getElementById(`analyzeButton_${colNum}`).disabled = (!neuralNetsLoaded || !buttonImageLoaded);
};

const OnAnalyzeImage = (colNum) =>
{
    // Get the image element from the HTML
    const imageElement = document.getElementById(`buttonImg_${colNum}`);

    // Pass the image to the neural nets and have them write the output to the relevant cell in the table
    for (let i = 0; i < neuralNets.length; i++) {
        neuralNets[i].Classify(imageElement, tableOutputCells[colNum][i]);
    }

    // Enable the button which can be used to generate a new button with the styling applied
    document.getElementById(`generateButton_${colNum}`).disabled = false;
};

const OnGenerateCSSButton = (colNum) =>
{
    // Create a div to wrap the button in
    const newDiv = document.createElement('div');
    newDiv.classList.add('generatedButtonView');

    // Create a new button object
    const newButton = document.createElement('button');
    newButton.innerHTML = 'Click';

    // Get all of the AI guesses from the table
    const ai_BackgroundColour = document.getElementById(`nn_background_colour_${colNum}`).textContent;
    const ai_BorderWidth = document.getElementById(`nn_border_width_${colNum}`).textContent;
    const ai_BorderColour = document.getElementById(`nn_border_colour_${colNum}`).textContent;
    const ai_BorderStyle = document.getElementById(`nn_border_style_${colNum}`).textContent;
    const ai_FontSize = document.getElementById(`nn_font_size_${colNum}`).textContent;
    const ai_BorderRadius = document.getElementById(`nn_border_radius_${colNum}`).textContent;
    const ai_ShadowSize = document.getElementById(`nn_shadow_size_${colNum}`).textContent;
    const ai_ShadowColour = document.getElementById(`nn_shadow_colour_${colNum}`).textContent;

    // Put all of the styling onto the button
    newButton.style.setProperty(`background`, ai_BackgroundColour);
    newButton.style.setProperty(`border-width`, ai_BorderWidth);
    newButton.style.setProperty(`border-color`, ai_BorderColour);
    newButton.style.setProperty(`border-style`, ai_BorderStyle);
    newButton.style.setProperty(`font-size`, ai_FontSize);
    newButton.style.setProperty(`border-radius`, ai_BorderRadius);
    newButton.style.setProperty(`box-shadow`, `0px ${ai_ShadowSize} ${ai_ShadowColour}`);

    // Add the button to the div
    newDiv.appendChild(newButton);
  
    // Find the table view
    const buttonTableParent = document.getElementById(`buttonView_${colNum}`);

    // Create a new row in the table with two new cells
    const newRow = document.createElement('tr');
    const groundTruthTD = document.createElement('td');
    const resultTD = document.createElement('td');
    newRow.appendChild(groundTruthTD);
    newRow.appendChild(resultTD);

    // Create an image element that is essentially a duplicate of the input image view
    const groundTruthImage = document.createElement('img');
    groundTruthImage.src = document.getElementById(`buttonImg_${colNum}`).src;
    groundTruthTD.appendChild(groundTruthImage);
    resultTD.appendChild(newDiv);

    // Place the row into the table
    buttonTableParent.appendChild(newRow);
};

const OnGenerateInteractable = () =>
{
    // Find the interactable button div so we know where to put the buttons
    const interactableButtonDiv = document.getElementById('interactableButtons');

    // Create a another div to ensure the button displays in the center of the box
    const newButtonDiv = document.createElement('div');
    newButtonDiv.classList.add('generatedButtonView');

    // Create a new button
    const newButtonObj = document.createElement('button');
    newButtonObj.innerHTML = `Click`;
    newButtonObj.id = `interact_${nextInteractableID}`;

    // Add the button to the new div
    newButtonDiv.appendChild(newButtonObj);

    // Create a style tag which lets us put CSS directly into the HTML page
    const styleTag = document.createElement(`style`);
    document.body.appendChild(styleTag);

    // Keep track of the rule number so that we add the rules in order since order matters in CSS
    // For this to work, the base is 1st, hover is 2nd, and active is 3rd
    let ruleNumber = 0;

    // Loop through the 3 columns and add their styling information to the button
    for (let colNum = 0; colNum < 3; colNum++)
    {
        // Determine if this is the base, hover, or click state. The string changes a bit
        let ruleTitle = `#interact_${nextInteractableID}`;
        ruleTitle += (colNum === 1) ? ':hover' : '';
        ruleTitle += (colNum === 2) ? ':active' : '';

        // Get all of the AI guesses from the table
        const ai_BackgroundColour = document.getElementById(`nn_background_colour_${colNum}`).textContent;
        const ai_BorderWidth = document.getElementById(`nn_border_width_${colNum}`).textContent;
        const ai_BorderColour = document.getElementById(`nn_border_colour_${colNum}`).textContent;
        const ai_BorderStyle = document.getElementById(`nn_border_style_${colNum}`).textContent;
        const ai_FontSize = document.getElementById(`nn_font_size_${colNum}`).textContent;
        const ai_BorderRadius = document.getElementById(`nn_border_radius_${colNum}`).textContent;
        const ai_ShadowSize = document.getElementById(`nn_shadow_size_${colNum}`).textContent;
        const ai_ShadowColour = document.getElementById(`nn_shadow_colour_${colNum}`).textContent;

        // Set up the base information
        styleTag.sheet.insertRule(`${ruleTitle} {background: ${ai_BackgroundColour};}`, ruleNumber++);
        styleTag.sheet.insertRule(`${ruleTitle} {border-width: ${ai_BorderWidth};}`,  ruleNumber++);
        styleTag.sheet.insertRule(`${ruleTitle} {border-color: ${ai_BorderColour};}`,  ruleNumber++);
        styleTag.sheet.insertRule(`${ruleTitle} {border-style: ${ai_BorderStyle};}`,  ruleNumber++);
        styleTag.sheet.insertRule(`${ruleTitle} {font-size: ${ai_FontSize};}`,  ruleNumber++);
        styleTag.sheet.insertRule(`${ruleTitle} {border-radius: ${ai_BorderRadius};}`,  ruleNumber++);
        styleTag.sheet.insertRule(`${ruleTitle} {box-shadow: 0px ${ai_ShadowSize} ${ai_ShadowColour};}`,  ruleNumber++);

        // Remove the blue border that shows up around the button (good for accessibility but makes it hard to see the effect)
        styleTag.sheet.insertRule(`${ruleTitle} {outline: none;}`, ruleNumber++);
    }

    // Place the new button into the scene by placing its parent div
    interactableButtonDiv.appendChild(newButtonDiv);

    // Set up for the next button
    nextInteractableID++;
};