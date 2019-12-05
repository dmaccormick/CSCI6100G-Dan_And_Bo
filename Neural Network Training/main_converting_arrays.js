//--- Data ---//
let imageList = [];
let imageListNormalized = [];
let imageListShortened = [];
let neuralNet;


// WHAT HAVE WE LEARNED
/**
 * 1. Even in a random set of numbers, if the 'alpha' value is ALWAYS 1, IT WILL NOT WORK and go NaN
 * 2. Even loading in noisy images which are basically just random numbers, IT WILL NOT WORK
 * 3. The issue is probably p5 loading images and us converting from UInt8 over to what we think are floats
 * 4. If all inputs are the same, it WILL NOT WORK
 */



//--- p5 Functions ---//
function preload() {
    // Clear the saved info
    imageList = [];
    imageListNormalized = [];
    imageListShortened = [];

    // Get the first image's filepath from the input
    //const inputElement = document.getElementById('firstImageName');
    const filename = 'Screenshot_2019-12-04 Button Generation Practice(0)';

    // Find the place where we can change the ID of the image (look for the bracket and then edit the number inside of it)
    const bracketIndex = filename.indexOf('(');

    // Delete the rest of the filename
    const filenameTrimmed = filename.substr(0, bracketIndex + 1);

    // Create a string to hold the iamge path
    const imageFolder = 'data/';

    // Load in all of the images until it fails to load
    for (let i = 0; i < 10; i++) {
        // Create the filename with the ID, bracket, and .png extension
        const newFileName = `${filenameTrimmed}${i}).png`;
        const fullFilePath = imageFolder + newFileName;

        // Try to load the image object. If it fails, call the fail function
        const imageObj = loadImage(fullFilePath);

        // Add the loaded image to the array
        imageList.push(imageObj);
        imageListNormalized.push([]);
    }

    // Output debug information
    //console.log(imageList);
    //console.log('Loading images complete!');
}

function setup() {
    // console.log('setup() called');

    // createCanvas(500, 500);

    // Load in the image pixels
    for (let i = 0; i < 10; i++) {
        imageList[i].loadPixels();

        //console.log(imageList[i].pixels);

        // convert to a regular array
        imageListNormalized[i] = Array.from(imageList[i].pixels);

        //console.log(imageListNormalized[i]);

        // normalize to between 0 and 1
        for (let j = 0; j < imageListNormalized[i].length; j++) {
            imageListNormalized[i][j] /= 255.0;
        }

        //console.log(imageListNormalized[i]);


        // // Normalize the pixels and save to the other array
        // // instead, just drop all of the alpha values (45k instead of 60k)
        // for (let j = 0; j < imageList[i].pixels.length; j++)
        // {
        //     //imageListNormalized[i].push(imageList[i].pixels[j] / 255.0); 

        //     if (j !== 0 && (j + 1) % 4 === 0) {
        //         continue;
        //     }

        //     imageListNormalized[i].push(imageList[i].pixels[j] / 255.0); 
        // }
    }

    // shorten the normalized arrays to get rid of the alpha values
    for (let i = 0; i < 10; i++) {
        // add a new array into the shortened list
        imageListShortened.push([]);

        // now loop through and add the normalized values, EXCEPT for the alphas which are all 1 anyways
        for (let j = 0; j < imageListNormalized[i].length; j++) {
            // skip every 4th value
            if (j !== 0 && (j + 1) % 4 === 0) {
                continue;
            }

            // add the value otherwise
            imageListShortened[i].push(imageListNormalized[i][j]);
        }

        //console.log(imageListShortened[i]);
    }

    // Create the neural network options
    const nnOptions = {
        inputs: 45000,                                                         // 200x200 px, 4 channels per px
        outputs: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],      // Different colours of the images
        task: 'classification'
    };

    // Create the neural net inputs
    const nnInputs = [
        // CreateArrayOfNumber(255),
        // CreateArrayOfNumber(100),
        // CreateArrayOfNumber(30),

        //CreateArrayOfNormVals(),
        //CreateArrayOfNormVals(),
        //CreateArrayOfNormVals(),

        //CreateArrayOfNormValsWithSetAlpha(),
        //CreateArrayOfNormValsWithSetAlpha(),
        //CreateArrayOfNormValsWithSetAlpha(),

        // imageListNormalized[0],
        // imageListNormalized[1],
        // imageListNormalized[2],

        // imageListShortened[0],
        // imageListShortened[1],
        // imageListShortened[2],

        imageListShortened[0],
        imageListShortened[1],
        imageListShortened[2],
        imageListShortened[3],
        imageListShortened[4],
        imageListShortened[5],
        imageListShortened[6],
        imageListShortened[7],
        imageListShortened[8],
        imageListShortened[9],
    ];

    console.log(nnInputs);

    // Create the neural net outputs
    const nnOutputs = [
        ['orange'],
        ['red'],
        ['purple'],
        ['green'],
        ['purple'],
        ['yellow'],
        ['yellow'],
        ['yellow'],
        ['purple'],
        ['blue'],
    ];

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
        epochs: 10,
        batchSize: 4
    };

    // Train the neural net
    nn.train(nnTrainingInfo, WhileTraining, FinishedTraining);
}



//--- UI Callbacks ---//
const LoadImages = () => {
    // Clear the saved info
    imageList = [];

    // Get the first image's filepath from the input
    const inputElement = document.getElementById('firstImageName');
    const filename = inputElement.value;

    // Find the place where we can change the ID of the image (look for the bracket and then edit the number inside of it)
    const bracketIndex = filename.indexOf('(');

    // Delete the rest of the filename
    const filenameTrimmed = filename.substr(0, bracketIndex + 1);

    // Create a string to hold the iamge path
    const imageFolder = 'data/';

    // Load in all of the images until it fails to load
    for (let i = 0; i < 4; i++) {
        // Create the filename with the ID, bracket, and .png extension
        const newFileName = `${filenameTrimmed}${i}).png`;
        const fullFilePath = imageFolder + newFileName;

        // Try to load the image object. If it fails, call the fail function
        const imageObj = loadImage(fullFilePath);

        imageObj.loadPixels();

        // Add the loaded image to the array
        imageList.push(imageObj);
    }

    // Output debug information
    console.log(imageList);
    console.log('Loading images complete!');
};

const CreateNeuralNetwork = () => {
    // Create the options for the neural network
    const nnOptions =
    {
        inputs: 60000,   // 150 x 100 x 4 (need to get rid of the A values)
        outputs: ['red', 'orange', 'yellow', 'green', 'blue', 'purple'],      // ROYGB P
        //debug: true,
        //learningRate: 0.1,
        task: 'classification'
    };

    // Init the neural network
    neuralNet = ml5.neuralNetwork(nnOptions);
};


// Creates an array with 160,000 elements, all of the same value
function CreateArrayOfNumber(number) {

    // Create an array
    const numberArray = [];

    // Add 160,000 versions of the requested number
    for (let i = 0; i < 45000; i++) {
        numberArray.push(number);
    }

    // Return the created array
    return numberArray;
}

const CreateArrayOfNormVals = () => {
    // Create an array
    const numberArray = [];

    // Add 160,000 versions of the requested number
    for (let i = 0; i < 45000; i++) {
        numberArray.push(Math.random());
    }

    // Return the created array
    return numberArray;
};

const CreateArrayOfNormValsWithSetAlpha = () => {
    // Create an array
    const numberArray = [];

    // Add 160,000 versions of the requested number
    for (let i = 0; i < 45000; i++) {

        if (i !== 0 && (i + 1) % 4 === 0) {
            numberArray.push(1.0);
        }
        else {
            numberArray.push(Math.random());
        }
    }

    // Return the created array
    return numberArray;
};



const PassImagesToNeuralNet = () => {
    // // Create the nn inputs array
    // const nnInputs = [];
    // for (let i = 0; i < imageList.length; i++) nnInputs.push(imageList[i].pixels);

    // // Create the nn outputs array
    // const nnOutputs = [];
    // for (let i = 0; i < imageList.length; i++) nnOutputs.push(['red']);

    // console.log(nnInputs);
    // console.log(nnOutputs);

    // // Pass the data to the neural net
    // for (let i = 0; i < nnInputs.length; i++) {
    //     neuralNet.addData(nnInputs[i], nnOutputs[i]);
    // }


    const nnInputs = [
        CreateArrayOfNumber(0.5),
        CreateArrayOfNumber(0.5),
        CreateArrayOfNumber(0.5),
        CreateArrayOfNumber(0.5),
    ];

    const nnOutputs = [
        ['red'],
        ['red'],
        ['red'],
        ['red'],
    ];

    // Add the inputs and outputs INDIVIDUALLY
    for (let i = 0; i < nnInputs.length; i++) {
        neuralNet.addData(nnInputs[i], nnOutputs[i]);
    }

    // Normalize the data
    neuralNet.normalizeData();

    // // Loop through the images and pass them one at a time
    // for (let i = 0; i < imageList.length; i++)
    // {
    //     // Get the pixels
    //     const imgPixels = imageList[i].pixels;

    //     // TODO: SHOULD remove every 4th (ie the alpha values so just RGB)
    //     // ...

    //     // TODO: Give the neural net the label that it should be
    //     const label = 'red';

    //     // Pass the pixels and the label to the neural network
    //     neuralNet.addData(imgPixels, ['red']);
    // }

    // Normalize the data
    //neuralNet.normalizeData();
};

const Train = () => {
    // Set up the training info
    const trainingInfo =
    {
        epochs: 50,
        batchSize: 10
    };

    // Begin the actual training process
    neuralNet.train(trainingInfo, WhileTraining, FinishedTraining);
};

const WhileTraining = (epoch, logs) => {
    // Output information about the training progress
    console.log(`Epoch: ${epoch + 1} - loss: ${logs.loss.toFixed(2)}`);
};

const FinishedTraining = () => {
    // Output a message
    console.log('Finished training!');
};



const StartTraining = () => {
    // Load the images
    //LoadImages();

    // Setup the neural network
    CreateNeuralNetwork();

    // Pass the image data to the neural net
    PassImagesToNeuralNet();

    // Setup the training
    Train();
};