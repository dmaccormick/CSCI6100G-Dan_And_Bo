/**
 * Class that represents a neural net object
 * It contains all of the functionality required to set work with the ml5 image classifiers
 */
class NeuralNet
{
    //--- Constructors ---//
    /**
     * @constructs Neural_Net
     * 
     * @param {string} name The name of the neural net. This will be used to help identify them AND will be the file name when saved
     * @param {string} labelVarName The name of the label variable this nn looks for. This MUST match the name of the variable in the LabelObject! (ex: '_backgroundColour', '_borderStyle', etc)
     * @param {Number} uniqueLabelCount The number of outputs for this neural net. This should equal the number of unique possible labels
     */
    constructor(name, labelVarName, uniqueLabelCount)
    {
        // Identify possible errors
        console.assert(typeof(name) === 'string', 'the neural net name must be a string');
        console.assert(typeof(labelVarName) === 'string', 'the labelVarName must be a string and MUST match the name of the variable in the LabelObject! (ex: _backgroundColour, _borderStyle, etc)');
        console.assert(typeof(uniqueLabelCount) === 'number', 'the uniqueLabelCount must be a number');

        // Store the data
        this._name = name;
        this._featureName = labelVarName;
        this._labelCount = uniqueLabelCount;
    }



    //--- Methods ---//
    /**
     * Sets up the neural network using the information provided in the constructor
     */
    Initialize()
    {
        // Handle possible errors
        console.assert(this._name !== undefined && this._featureName !== undefined && this._labelCount !== undefined, 'you must construct the neural net before calling Initialize()');

        // Define the nn hyperparams. All of the neural nets will use the same ones, with the only difference being the number of labels
        const nnOptions = {
            topk: 0,
            learningRate: 0.0001,
            hiddenUnits: 100,
            epochs: 100,
            numLabels: this._labelCount, 
        };

        // Cannot pass 'this' to the callback below but we can pass values instead 
        const nameValue = this._name;

        // Setup the feature extractor
        this._featureExtractor = ml5.featureExtractor("MobileNet", nnOptions, function(){console.log(`[${nameValue}] model ready`);});

        // Setup the classifier object
        this._classifier = this._featureExtractor.classification();

        // Setup the promises list. These are all promises that will need to be resolved when adding data to the model
        this._promises = [];
    }

    /**
     * Add the images to the neural network, so that it knows what to train with
     * Based off this post: https://github.com/ml5js/ml5-examples/issues/59, specifically the answer from user 'ComputerCarl'
     * 
     * @param {HTMLImageElement[]} images The array of HTML image elements for all of the buttons that were loaded
     * @param {LabelObject[]} labels The list of labels for the data
     * @param {string} labelName The name of the specific label to grab from the label object (ex: '_background' or '_borderWidth')
     */
    AddImages(images, labels)
    {
        // Identify possible errors
        console.assert(Array.isArray(images), 'images must be an array');
        console.assert(Array.isArray(labels), 'labels must be an array');
        console.assert(images.length === labels.length, 'there must be an equal number of images and labels');

        // Clear any previous promises from other times
        this._promises = [];

        // Loop through all of the images and labels and add them to the internal model
        for (let i = 0; i < images.length && i < labels.length; i++)
        {
            // Grab the label value for this button and this neural net's specific target feature
            const imageLabel = labels[i][this._featureName];

            // Pass the image to the network using a Promise structure
            this._promises.push(new Promise(resolve => 
            {
                // Grab the image object
                let imageObject = images[i];

                // Add the image to the classifier and then resolve the promise
                this._classifier.addImage(imageObject, imageLabel, () => {
                    resolve();
                    imageObject = null;
                });
            }));
        }
    }

    /**
     * Train the neural network using all the data that was added in AddImages()
     * 
     * @param {Boolean} outputProgress (OPTIONAL) If true, the loss value will be written to the console every epoch
     */
    Train(outputProgress = true)
    {
        // Identify possible errors
        console.assert(typeof(outputProgress) === 'boolean', 'outputProgress must be a Boolean');

        // Cannot pass 'this' to the callback below but we can pass values instead 
        const nameValue = this._name;

        // Train the network
        this._classifier.train(function (lossValue) 
        {
            // Output the loss value if told to do so
            console.log(`[${nameValue}] Loss = ${lossValue}`);
        });
    }

    /**
     * Classify the set of images provided and write the answer to the console, as well as keep track of the overall accuracy
     * 
     * @param {HTMLImageElement[]} images The list of images to try and classify
     * @param {LabelObject[]} labels The list of labels for the images. Used to determine if the guesses were correct
     * @param {Boolean} outputAllGuesses (OPTIONAL) Write out all of the guesses to the console
     */
    TestClassify(images, labels, outputAllGuesses = true)
    {
        // Identify possible errors
        console.assert(Array.isArray(images), 'images must be an array');
        console.assert(Array.isArray(labels), 'labels must be an array');
        console.assert(images.length === labels.length, 'there must be an equal number of images and labels');
        console.assert(typeof(outputAllGuesses) === 'boolean', 'outputAllGuesses must be a Boolean');

        // Keep track of the number of guesses and number of attempts
        this._numGuessesCorrect = 0;
        this._numGuessesTotal = images.length;

        // Cannot pass 'this' to the callback below directly but we can pass values instead 
        const nameValue = this._name;
        const featureNameValue = this._featureName;
        const thisObj = this;

        // Attempt to classify all of the images
        for (let i = 0; i < images.length; i++)
        {
            // Classify the image and handle the results
            this._classifier.classify(images[i], function(error, results) 
            {
                // If there was an error, output it. Otherwise, handle the result
                if (error) 
                {
                    // Write out the error
                    console.error(error);
                }
                else
                {
                    // Get the expected label which is the correct answer
                    const answer = labels[i][featureNameValue];

                    // Get the top result which is the guess
                    const guess = results[0].label;

                    // Compare if the result matches the label. If it does, the network guessed correctly
                    const correctGuess = (answer === guess);

                    // Keep track of the number of correct guesses so we can determine the accuracy later
                    if (answer === guess) {
                        thisObj._numGuessesCorrect++;
                    }

                    // If desired, output the guess and result to the console
                    if (outputAllGuesses)
                    {
                        // Determine the pieces needed for the output
                        const testNumber = `#${i + 1}`;
                        const confidenceStr = results[0].confidence.toFixed(2);
                        const correctStr = (correctGuess) ? 'CORRECT' : 'INCORRECT';

                        // Write out the guess information
                        console.log(`[${nameValue}] Test ${testNumber}: Guess = ${guess} Confidence = ${confidenceStr} (${correctStr}, Answer = ${answer})`);
                    }
                }
            });
        }
    }

    /**
     * Output the accuracy of the system from the last time you called TestClassify()
     */
    OutputAccuracy()
    {
        // Identify possible errors
        console.assert(this._numGuessesCorrect !== undefined && this._numGuessesTotal !== undefined, 'you must run TestClassify() before you can output the accuracy');

        // Create a temp to string so we can write out the information in an understandable way
        let accuracyInfo = `[${this._name}] Classification Test Results :\n`;
        accuracyInfo += `Attempts: ${this._numGuessesTotal}\n`;
        accuracyInfo += `Correct:  ${this._numGuessesCorrect}\n`;
        accuracyInfo += `Accuracy: ${100 * (this._numGuessesCorrect / this._numGuessesTotal)}%`;

        // Write the string to the console
        console.log(accuracyInfo);
    }
}