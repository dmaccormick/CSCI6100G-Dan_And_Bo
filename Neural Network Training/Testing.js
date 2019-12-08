//--- Data ---//
let neuralNets = [];
let tableOutputCells = [];
let neuralNetsLoaded = false;
let buttonImageLoaded = false;



//--- p5 Callbacks ---//
function preload()
{
    // Clear the saved info in case of caching
    neuralNets = [];
    tableOutputCells = [];
    neuralNetsLoaded = false;
    buttonImageLoaded = false;

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
    neuralNets.forEach(nn => tableOutputCells.push(document.getElementById(nn._name)));
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

    // Attempt to activate the analyze button
    ActivateAnalyzeButton();
}

const OnImageUploaded = () =>
{
    // Find the image upload element and get the file from it
    const uploadButton = document.getElementById('imageUpload');
    const imageFile = uploadButton.files[0];

    // Find the image display element
    const imageDisplay = document.getElementById('buttonImg');

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
        ActivateAnalyzeButton();
    }

    // Trigger the file reader
    fileReader.readAsDataURL(imageFile);
}

const ActivateAnalyzeButton = () => 
{
    // If the neural lets are loaded and a button image was selected, we can go ahead and try to analyze it
    document.getElementById('analyzeButton').disabled = (!neuralNetsLoaded || !buttonImageLoaded);
}

const OnAnalyzeImage = () =>
{
    // Get the image element from the HTML
    const imageElement = document.getElementById('buttonImg');

    // Pass the image to the neural nets and have them write the output to the relevant cell in the table
    for (let i = 0; i < neuralNets.length; i++) {
        neuralNets[i].Classify(imageElement, tableOutputCells[i]);
    }

    // Enable the button which can be used to generate a new button with the styling applied
    document.getElementById('generateButton').disabled = false;
}

const OnGenerateCSSButton = () =>
{
    // Create a div to wrap the button in
    const newDiv = document.createElement('div');
    newDiv.classList.add('generatedButtonView');

    // Create a new button object
    const newButton = document.createElement('button');
    newButton.innerHTML = 'Click';

    // Get all of the AI guesses from the table
    const ai_BackgroundColour = document.getElementById('nn_background_colour').textContent;
    const ai_BorderWidth = document.getElementById('nn_border_width').textContent;;
    const ai_BorderColour = document.getElementById('nn_border_colour').textContent;;
    const ai_BorderStyle = document.getElementById('nn_border_style').textContent;;
    const ai_FontSize = document.getElementById('nn_font_size').textContent;;
    const ai_BorderRadius = document.getElementById('nn_border_radius').textContent;;
    const ai_ShadowSize = document.getElementById('nn_shadow_size').textContent;;
    const ai_ShadowColour = document.getElementById('nn_shadow_colour').textContent;;

    // Put all of the styling onto the button
    newButton.style.setProperty("background", ai_BackgroundColour);
    newButton.style.setProperty("border-width", ai_BorderWidth);
    newButton.style.setProperty("border-color", ai_BorderColour);
    newButton.style.setProperty("border-style", ai_BorderStyle);
    newButton.style.setProperty("font-size", ai_FontSize);
    newButton.style.setProperty("border-radius", ai_BorderRadius);
    newButton.style.setProperty("box-shadow", `0px ${ai_ShadowSize} ${ai_ShadowColour}`);

    // Add the button to the div
    newDiv.appendChild(newButton);
  
    // Find the table view
    const buttonTableParent = document.getElementById('buttonView');

    // Create a new row in the table with two new cells
    const newRow = document.createElement('tr');
    const groundTruthTD = document.createElement('td');
    const resultTD = document.createElement('td');
    newRow.appendChild(groundTruthTD);
    newRow.appendChild(resultTD);

    // Create an image element that is essentially a duplicate of the input image view
    const groundTruthImage = document.createElement('img');
    groundTruthImage.src = document.getElementById('buttonImg').src;
    groundTruthTD.appendChild(groundTruthImage);
    resultTD.appendChild(newDiv);

    // Place the row into the table
    buttonTableParent.appendChild(newRow);
}