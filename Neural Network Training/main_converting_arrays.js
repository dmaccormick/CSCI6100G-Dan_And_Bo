//--- Data ---//
let imageList = [];
let imageListNormalized = [];
let imageListShortened = [];
let labels = [];
let neuralNet;
const NUM_IMAGES_TO_LOAD = 100;


// WHAT HAVE WE LEARNED
/**
 * 1. Even in a random set of numbers, if the 'alpha' value is ALWAYS 1, IT WILL NOT WORK and go NaN
 * 2. Even loading in noisy images which are basically just random numbers, IT WILL NOT WORK
 * 3. The issue is probably p5 loading images and us converting from UInt8 over to what we think are floats
 * 4. If all inputs are the same, it WILL NOT WORK
 */



//--- p5 Functions ---//
function preload() 
{
    console.log('preload()');

    // Clear the saved info
    imageList = [];
    imageListNormalized = [];
    imageListShortened = [];

    // Get the first image's filepath from the input
    //const inputElement = document.getElementById('firstImageName');
    const filename = 'Screenshot_2019-12-05 Button Generation Practice(0)';

    // Find the place where we can change the ID of the image (look for the bracket and then edit the number inside of it)
    const bracketIndex = filename.indexOf('(');

    // Delete the rest of the filename
    const filenameTrimmed = filename.substr(0, bracketIndex + 1);

    // Create a string to hold the iamge path
    const imageFolder = 'data/';

    // Load in all of the images
    for (let i = 0; i < NUM_IMAGES_TO_LOAD; i++) 
    {
        // Create the filename with the ID, bracket, and .png extension
        const newFileName = `${filenameTrimmed}${i}).png`;
        const fullFilePath = imageFolder + newFileName;

        // Try to load the image object. If it fails, call the fail function
        const imageObj = loadImage(fullFilePath);

        // Add the loaded image to the array
        imageList.push(imageObj);
        imageListNormalized.push([]);
    }
}

function setup() {
    console.log('setup');
}


const OnCSVLoaded = () =>
{
    // Clear the existing labels
    labels = [];

    // Grab the file object from the HTML
    const fileElement = document.getElementById('labelCSV');
    
    // Read in the entire file
    ReadEntireFile(fileElement, function(fileContents) 
    {
        // Split the CSV into lines and drop the last one
        const csvLines = fileContents.split('\n');
        csvLines.pop();

        // Parse each line into a label object and save it to the array
        for (let i = 0; i < csvLines.length; i++) {
            labels.push(new LabelObject(csvLines[i]));
        }

        // Enable the training button
        document.getElementById('trainButton').disabled = false;
    });
};


const Train = () => 
{
    // Convert the UInt8 arrays to regular arrays and then normalize down to 0-1
    for (let i = 0; i < NUM_IMAGES_TO_LOAD; i++) 
    {
        // Populate the pixel array
        imageList[i].loadPixels();

        // Convert to a regular array from the UInt8 array
        imageListNormalized[i] = Array.from(imageList[i].pixels);

        // Normalize all of the RGBA values to between 0 and 1
        for (let j = 0; j < imageListNormalized[i].length; j++) {
            imageListNormalized[i][j] /= 255.0;
        }
    }

    // shorten the normalized arrays to get rid of the alpha values
    for (let i = 0; i < NUM_IMAGES_TO_LOAD; i++) 
    {
        // Add a new blank array into the filtered list
        imageListShortened.push([]);

        // Now loop through and add the normalized values. Filter OUT the alphas which are all 1 anyways
        for (let j = 0; j < imageListNormalized[i].length; j++)
        {
            // Skip every 4th value since these are the alphas
            if (j !== 0 && (j + 1) % 4 === 0) {
                continue;
            }

            // Add the value otherwise so we end up with an array like RGB,RGB,RGB 
            imageListShortened[i].push(imageListNormalized[i][j]);
        }
    }

    // Create the neural network options
    const nnOptions = 
    {
        inputs: 45000,                                                         // 200x200 px, 4 channels per px
        outputs: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],      // Different colours of the images
        task: 'classification'
    };

    // Create the neural net inputs
    const nnInputs = [];

    // Add the image data into the nn input array
    for (let i = 0; i < NUM_IMAGES_TO_LOAD; i++) {
        nnInputs.push(imageListShortened[i]);
    }

    // Output the inputs for clarity
    console.log('NN Inputs');
    console.log(nnInputs);

    // Create the neural net outputs
    const nnOutputs = [];

    // Add the loaded labels into the neural net outputs
    for (let i = 0; i < NUM_IMAGES_TO_LOAD; i++) 
    {
        // Grab the label from the CSV loaded object
        let label = labels[i]._backgroundColour;

        // Send the label to the output list, embedding it into an array
        nnOutputs.push([label]); 
    }

    // Log the outputs for clarity
    console.log('NN Outputs');
    console.log(nnOutputs);

    // Set up the neural network
    nn = ml5.neuralNetwork(nnOptions);

    // Add the inputs and outputs INDIVIDUALLY
    for (let i = 0; i < nnInputs.length; i++) {
        nn.addData(nnInputs[i], nnOutputs[i]);
    }

    // Normalize the data
    nn.normalizeData();

    // Set up the training parameters
    const nnTrainingInfo = {
        epochs: 250,
        batchSize: 25
    };

    // Train the neural net
    nn.train(nnTrainingInfo, WhileTraining, FinishedTraining);
};



//--- Neural Net Callbacks ---//
const WhileTraining = (epoch, logs) => {
    // Output information about the training progress
    console.log(`Epoch: ${epoch + 1} - loss: ${logs.loss}`);
};

const FinishedTraining = () => {
    // Output a message
    console.log('Finished training!');
};