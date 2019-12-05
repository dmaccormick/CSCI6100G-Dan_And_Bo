// Contain all of the information for a given image's labels
class LabelObject
{
    constructor(csvLine) 
    {
        // Split the line into the individual tokens
        let tokens = csvLine.split(',');

        // TODO: Handle all of the tokens individually
        this._id = Number.parseInt(tokens[0]);
        this._backgroundColour = tokens[1];
        //..
        //..
        //..
    }
}