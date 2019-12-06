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
     * @param {string} name The name of the neural net. This will be used to help identify them AND will be the file name when saved. Should ideally match the feature it is supposed to look for
     * @param {Number} uniqueLabelCount The number of outputs for this neural net. This should equal the number of unique possible labels
     */
    constructor(name, uniqueLabelCount)
    {
        // Identify possible errors
        console.assert(typeof(name) === 'string', 'the neural net name must be a string');
        console.assert(typeof(uniqueLabelCount) === 'number', 'the uniqueLabelCount must be a number');

        // Store the data
        this._name = name;
        this._labelCount = uniqueLabelCount;

        // Set up the neural network with the options provided
        Initialize();
    }



    //--- Methods ---//
    /**
     * Sets up the neural network using the information provided in the constructor
     */
    Initialize()
    {
        // Handle possible errors
        console.assert(this._name !== undefined && this._labelCount !== undefined, 'you must construct the neural net before calling Initialize()');

        // Define the nn hyperparams. All of the neural nets will use the same ones, with the only difference being the number of labels
        const nnOptions = {
            topk: 0,
            learningRate: 0.0001,
            hiddenUnits: 100,
            epochs: 100,
            numLabels: this._labelCount, 
        };

        // Setup the feature extractor
        this._featureExtractor = ml5._featureExtractor("MobileNet", nnOptions, this.OnModelReady);

        // Setup the classifier object
        this._classifier = featureExtractor.classification();

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
    AddImages(images, labels, labelName)
    {
        // Identify possible errors
        console.assert(Array.isArray(images), 'images must be an array');
        console.assert(Array.isArray(labels), 'labels must be an array');
        console.assert(images.length === labels.length, 'there must be an equal number of images and labels');
        console.assert(typeof(labelName) == 'string', 'labelName must be a string');

        // Clear any previous promises from other times
        promises = [];

        // Loop through all of the images and labels and add them to the internal model
        for (let i = 0; i < images.length && i < labels.length; i++)
        {
            // Grab the label value for this button and this neural net's specific target feature
            const imageLabel = labels[i][labelName];

            // Pass the image to the network using a Promise structure
            promises.push(new Promise(resolve => 
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
        console.assert(outputProgress instanceof Boolean, 'outputProgress must be a Boolean');

        // Train the network
        this._classifier.train(function (lossValue) 
        {
            // Output the loss value if told to do so
            console.log(`[${this._name}] Loss = ${lossValue}`);
        });
    }

    /**
     * Classify the set of images provided and write the answer to the console, as well as keep track of the overall accuracy
     * 
     * @param {HTMLImageElement[]} images The list of images to try and classify
     * @param {LabelObject[]} labels The list of labels for the images. Used to determine if the guesses were correct
     * @param {string} labelName The name of the specific feature's label within the LabelObject structure
     * @param {Boolean} outputAllGuesses (OPTIONAL) Write out all of the guesses to the console
     */
    TestClassify(images, labels, labelName, outputAllGuesses = true)
    {
        // Identify possible errors
        console.assert(Array.isArray(images), 'images must be an array');
        console.assert(Array.isArray(labels), 'labels must be an array');
        console.assert(images.length === labels.length, 'there must be an equal number of images and labels');
        console.assert(typeof(labelName) == 'string', 'labelName must be a string');

        // Keep track of the number of guesses and number of attempts
        this._numGuessesCorrect = 0;
        this._numGuessesTotal = images.length;

        // Attempt to classify all of the images
        for (let i = 0; i < images.length; i++)
        {
            // Classify the image and handle the results
            this._classifier.classify(images[i], function(error, results) 
            {
                // If there was an error, output it. Otherwise, handle the result
                if (err) 
                {
                    // Write out the error
                    console.error(error);
                }
                else
                {
                    // Get the expected label which is the correct answer
                    const answer = labels[i][labelName];

                    // Get the top result which is the guess
                    const guess = results[0].label;

                    // Compare if the result matches the label. If it does, the network guessed correctly
                    const correctGuess = (answer === guess);

                    // Keep track of the number of correct guesses so we can determine the accuracy later
                    if (answer === guess) {
                        this._numGuessesCorrect++;
                    }

                    // If desired, output the guess and result to the console
                    if (outputAllGuesses)
                    {
                        // Determine the pieces needed for the output
                        const testNumber = `#${i + 1}`;
                        const confidenceStr = results[0].confidence.toFixed(2);
                        const correctStr = (correctGuess) ? 'CORRECT' : 'INCORRECT';

                        // Write out the guess information
                        console.log(`[${this._name}] Test ${testNumber}: Guess = ${guess} Confidence = ${confidenceStr} (${correctStr}, Answer = ${answer})`);
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
        accuracyInfo += `Accuracy: ${100 * (this._numGuessesCorrect / this._numGuessesCorrect)}%`;

        // Write the string to the console
        console.log(accuracyInfo);
    }



    //--- Neural Net Callbacks ---//
    /**
     * Called when the feature extractor model is ready. Outputs a message indicating as such
     */
    OnModelReady()
    {
        // Output a message indicating that this specific model is ready
        console.log(`Neural Net [${this._name}] is ready!`);
    }
}