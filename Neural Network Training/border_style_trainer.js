const NUM_IMAGES_TO_LOAD = 600;
let imageList = [];
let labels = [];
let promises = [];
let correctGuesses = 0;

// Image classification data
let featureExtractor;
let classifier;


//--- p5 Callbacks ---//
function preload() {
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

    // Find the div for where we are going to put all of the image
    const imgDiv = document.getElementById('imgDiv');

    // Load in all of the images
    for (let i = 0; i < NUM_IMAGES_TO_LOAD; i++) {
        // Create the filename with the ID, bracket, and .png extension
        const newFileName = `${filenameTrimmed}${i}).png`;
        const fullFilePath = imageFolder + newFileName;

        // // Try to load the image object. If it fails, call the fail function
        // const imageObj = loadImage(fullFilePath);

        // // Add the loaded image to the array
        // imageList.push(imageObj);
        // imageListNormalized.push([]);

        // Create a new img object in the HTML
        const newImgObj = document.createElement('img');
        newImgObj.src = fullFilePath;

        // Add the image to the HTML
        imgDiv.appendChild(newImgObj);

        // Give the img object to the imageList so we can later pass it to the NN
        imageList.push(newImgObj);
    }
}

function setup() {

    // Define the nn options
    const nnOptions = {
        topk: 0,
        learningRate: 0.0001,
        hiddenUnits: 100,
        epochs: 100,
        numLabels: 9, //6 for colours, 9 for border width
    };

    // Setup the feature extractor
    featureExtractor = ml5.featureExtractor("MobileNet", nnOptions, ModelReady);

    // Get the classifier from it
    classifier = featureExtractor.classification();
}

const ModelReady = () => {
    console.log('Model Ready for BORDER STYLE!');
};



//--- UI Callbacks ---//
const OnCSVLoaded = () => {
    // Clear the existing labels
    labels = [];

    // Grab the file object from the HTML
    const fileElement = document.getElementById('labelCSV');

    // Read in the entire file
    ReadEntireFile(fileElement, function (fileContents) {
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

const GiveImages = () => {
    // Loop through and add our images to the classifier with their corresponding label
    for (let i = 0; i < imageList.length * 0.8; i++) {
        // Grab the label (border style in this case)
        const imageLabel = labels[i]._borderStyle;

        // Use the promise structure
        promises.push(new Promise(resolve => {
            let img = imageList[i];
            classifier.addImage(img, imageLabel, () => {
                resolve();
                img = null;
            });
        }));

        // // Give the classifier the HTML image object and the label
        // classifier.addImage(imageList[i], imageLabel);

        //// Set the source of the image to be the next one in line
        //imgElement.src = `data/Screenshot_2019-12-05 Button Generation Practice(${i}).png`;

        // Load the pixels into the image
        //imageList[i].loadPixels();

        // Add the image and the label to the classifier
        //classifier.addImage(imageList[i], imageLabel);
        //classifier.addImage(imgElement, imageLabel);
    }
};

const Train = () => {
    // // Create an image element in the HTML to work with
    // const imgElement = document.createElement('img');
    // document.body.appendChild(imgElement);

    // // Loop through and add our images to the classifier with their corresponding label
    // for (let i = 0; i < imageList.length; i++) 
    // {
    //     // Grab the label
    //     const imageLabel = labels[i]._backgroundColour;

    //     // Use the promise structure
    //     promises.push(new Promise(resolve => {
    //         let img = imageList[i];
    //         classifier.addImage(img, imageLabel, () => {
    //             resolve();
    //             img = null;
    //         });
    //     }));

    //     // // Give the classifier the HTML image object and the label
    //     // classifier.addImage(imageList[i], imageLabel);

    //     //// Set the source of the image to be the next one in line
    //     //imgElement.src = `data/Screenshot_2019-12-05 Button Generation Practice(${i}).png`;

    //     // Load the pixels into the image
    //     //imageList[i].loadPixels();

    //     // Add the image and the label to the classifier
    //     //classifier.addImage(imageList[i], imageLabel);
    //     //classifier.addImage(imgElement, imageLabel);
    // }

    // Start to train the network
    classifier.train(function (lossValue) {
        // Output the loss value
        console.log("Loss is", lossValue);
    });
};

const TestClassify = () => 
{
    // Reset the correct guesses
    correctGuesses = 0;

    // Test it on all of the data that we just did
    for (let i = imageList.length * 0.8; i < imageList.length; i++) 
    {
        classifier.classify(imageList[i], function (err, result) 
        {
            if (err) {
                console.error(err);
            }
            else 
            {
                //console.log(`[${i + 1}] : label = ${labels[i]._borderStyle}  ->  guess = ${result[0].label}  (confidence = ${result[0].confidence})`);
                //console.log(labels[i]._borderStyle + ' -> ' + result);

                // output the result
                let outputString = `[${i + 1}] label = ${labels[i]._borderStyle}\n`;
                
                for (let j = 0; j < result.length; j++) {
                    outputString += `guess [${j + 1}] = ${result[j].label}  (confidence = ${result[j].confidence})\n`;
                }

                console.log(outputString);

                // keep track of correct guesses
                if (labels[i]._borderStyle === result[0].label) {
                    correctGuesses++;
                }
            }
        });
    }    
};

const OutputAccuracy = () => 
{
    // Write out the accuracy value to the console
    console.log(`Attempts: ${imageList.length * 0.2}      Correct Guesses: ${correctGuesses}    Accuracy: ${100 * (correctGuesses / (0.2 * imageList.length))}%`);
};