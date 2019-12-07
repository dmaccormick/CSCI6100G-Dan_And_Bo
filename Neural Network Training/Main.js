//--- Constant Data ---//
const IMAGE_FOLDER_PATH = 'data/';
const FILENAME_BASE = 'Button_Img_ (';
const IMAGE_OFFSET = 0;
const NUM_IMAGES_TOTAL = 600;
const TRAINING_PERCENTAGE = 0.8;
const LAST_TRAINING_INDEX = TRAINING_PERCENTAGE * NUM_IMAGES_TOTAL;



//--- Variable Data ---//
let neuralNets = [];
let imageList = [];
let labelObjects = [];



//--- p5 Callbacks ---//
function preload()
{
    // Output a feedback message
    console.log('Preloading ...');

    // Clear the saved info
    neuralNets = [];
    imageList = [];
    labelObjects = [];

    // Initialize the neural net list
    //neuralNets.push(new NeuralNet('nn_bg_10', '_backgroundColour', 6));
    //neuralNets.push(new NeuralNet('nn_bg_100', '_backgroundColour', 6));
    //neuralNets.push(new NeuralNet('nn_bg_300', '_backgroundColour', 6));
    //neuralNets.push(new NeuralNet('nn_bg_600', '_backgroundColour', 6));
    //neuralNets.push(new NeuralNet('nn_bg_1200', '_backgroundColour', 6));

    // neuralNets.push(new NeuralNet('nn_background_colour', '_backgroundColour', 6));
    // neuralNets.push(new NeuralNet('nn_border_width', '_borderWidth', 10));
    // neuralNets.push(new NeuralNet('nn_border_colour', '_borderColour', 6));
    // neuralNets.push(new NeuralNet('nn_border_style', '_borderStyle', 8));
    // neuralNets.push(new NeuralNet('nn_font_size', '_fontSize', 9));
    // neuralNets.push(new NeuralNet('nn_border_radius', '_borderRadius', 9));
    // neuralNets.push(new NeuralNet('nn_shadow_size', '_shadowSize', 10));
    neuralNets.push(new NeuralNet('nn_shadow_colour', '_shadowColour', 6));

    // Load all of the images in
    LoadImages();
}

function setup()
{
    // Output a feedback message
    console.log('Setting up ...');

    // Initialize all of the neural networks
    neuralNets.forEach(nn => nn.Initialize());
}



//--- UI Callbacks ---//
const OnLabelCSVLoaded = () => 
{
    // Clear the existing labels
    labelObjects = [];

    // Grab the file object from the HTML
    const fileElement = document.getElementById('labelCSV');

    // Read in the entire file
    ReadEntireFile(fileElement, function (fileContents) 
    {
        // Split the CSV into lines and drop the last one
        const csvLines = fileContents.split('\n');
        csvLines.pop();

        // Parse each line into a label object and save it to the array
        for (let i = 0; i < csvLines.length; i++) {
            labelObjects.push(new LabelObject(csvLines[i]));
        }

        // Enable the next button
        document.getElementById('giveImagesButton').disabled = false;

        // Also enable the load button since labels are all that is needed for classifying with a pre-trained model
        document.getElementById('loadModelButton').disabled = false;

        // Output a feedback message
        console.log(`Label CSV loaded. Found [${labelObjects.length}] labels...`);
    });
};

const OnGiveImages = () =>
{
    // Output a feedback message
    console.log('Giving images to neural nets...');

    // Split the image and label lists so we only grab the first x% for training. The rest are for testing
    const trainingImages = imageList.slice(0, LAST_TRAINING_INDEX); 
    const trainingLabels = labelObjects.slice(IMAGE_OFFSET, IMAGE_OFFSET + LAST_TRAINING_INDEX);

    // Give all of the training images to the neural nets
    neuralNets.forEach(nn => nn.AddImages(trainingImages, trainingLabels));

    // Enable the next button
    document.getElementById('trainButton').disabled = false;
};

const OnTrain = () =>
{
    // Output a feedback message
    console.log('Training neural nets...');

    // Tell all of the neural nets to begin the training process
    neuralNets.forEach(nn => nn.Train(true));

    // Enable the next button
    document.getElementById('classifyButton').disabled = false;

    // Also enable the save button since the models are trained
    document.getElementById('saveModelButton').disabled = false;
};

const OnTestClassify = () =>
{
    // Output a feedback message
    console.log('Testing neural nets...');

    // Split the image and label lists so we get the set reserved for testing
    const testingImages = imageList.slice(LAST_TRAINING_INDEX, NUM_IMAGES_TOTAL);
    const testingLabels = labelObjects.slice(IMAGE_OFFSET + LAST_TRAINING_INDEX, IMAGE_OFFSET + NUM_IMAGES_TOTAL);

    // Give the images to all of the neural nets and have them attempt to classify
    neuralNets.forEach(nn => nn.TestClassify(testingImages, testingLabels, true));

    // Enable the next button
    document.getElementById('accuracyButton').disabled = false;
};

const OnOutputAccuracy = () =>
{
    // Output a feedback message
    console.log('Outputting neural net accuracies...');

    // Tell all of the neural nets to output their accuracies
    neuralNets.forEach(nn => nn.OutputAccuracy());
};

const OnSaveModels = () =>
{
    // Output a feedback message
    console.log('Saving neural nets...');

    // Save all of the neural nets out to files
    neuralNets.forEach(nn => nn.SaveModel());
};

const OnLoadModels = () =>
{
    // Output a feedback message
    console.log('Loading neural nets...');

    // Load all of the neural net models from files
    neuralNets.forEach(nn => nn.LoadModel());

    // Enable the classify button since the models are now loaded
    document.getElementById('classifyButton').disabled = false;

    // Also enable the save button since the models are trained
    document.getElementById('saveModelButton').disabled = false;
};



//--- Utility Methods ---//
const LoadImages = () =>
{
    // Output a feedback message
    console.log('Loading images ...');

    // Find the div in the HTML where the image elements will get placed
    const imgDiv = document.getElementById('imgDiv'); 

    // Load in as many images as expected
    for (let i = IMAGE_OFFSET; i < IMAGE_OFFSET + NUM_IMAGES_TOTAL; i++)
    {
        // Determine the full file name (ex: data/Button_Img_(1576).png)
        // The images start at 1 so that's why i is increased by 1
        const fullFilePath = `${IMAGE_FOLDER_PATH}${FILENAME_BASE}${i + 1}).png`; 

        // Create a new img object in the HTML which uses the file as the source image
        const newImgObj = document.createElement('img');
        newImgObj.src = fullFilePath;

        // Add the image to the HTML
        imgDiv.appendChild(newImgObj);

        // Give the img object to the imageList so we can later pass it to the NNs
        imageList.push(newImgObj);
    }

    // Output a feedback message
    console.log('Images loaded ...');
};