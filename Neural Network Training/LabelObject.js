/**
 *  Contains all of the information for a given image's labels
 */ 
class LabelObject
{
    //--- Constructors ---//
    /**
     * @constructs LabelObject
     * 
     * @param {string} csvLine The line from the CSV, which should contain all of the information needed for all the labels
     */
    constructor(csvLine) 
    {
        // Split the line into the individual tokens
        let tokens = csvLine.split(',');

        // Identify possible errors
        console.assert(tokens.length === 9, 'the number of tokens in the csvline is incorrect!');

        // Pull in all of the tokens individually
        this._id = Number.parseInt(tokens[0]);
        this._backgroundColour = tokens[1];
        this._borderWidth = tokens[2];
        this._borderColour = tokens[3];
        this._borderStyle = tokens[4];
        this._fontSize = tokens[5];
        this._borderRadius = tokens[6];
        this._shadowSize = tokens[7];
        this._shadowColour = tokens[8];
    }
}