/**
 * Reads an entire file from start to finish and returns it as a string
 * 
 * @param {HTMLElement} fileInputElement The file input element to grab the file from
 * @param {callback} callback The function callback for when the file is done being read. The file contents will be passed as a parameter
 */
const ReadEntireFile = (fileInputElement, callback) =>
{
    // Handle possible errors
    console.assert(fileInputElement instanceof HTMLElement, 'the file input element needs to actually be an HTMLElement');

    // Grab the file object from the element
    const file = fileInputElement.files[0];

    // Handle possible errors
    console.assert(file, "the file does not exist!");

    // Set up the file reading and tell the file to execute it
    const fileReader = new FileReader(event);

    // Hold the file contents for returning shortly
    let fileContents = '';

    // Set up the event that we need to trigger to read the file
    fileReader.onload = arg => 
    { 
        // Get the file contents
        fileContents = arg.target.result; 

        // Pass the file contents to the callback function
        callback(fileContents);
    };

    // Set up the event that triggers if it fails to read
    fileReader.onerror = arg => {
        console.error('Error when trying to read the file!');
    };

    // Set up the event that triggers if it abots
    fileReader.onabort = arg => {
        console.error('Aborted the file reading!');
    };

    // Trigger the event we just created
    fileReader.readAsText(file);
};