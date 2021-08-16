# Neural Network That Identifies CSS

## Introduction
Final project repository for CSCI 6100G - Artificial Intelligence for Software Engineering. Daniel MacCormick and Bo Yu. 
Our goal was to use convolutional neural networks to interpret the CSS code for elements on a web page. To keep the scope contained enough for a course project, we focused specifically on buttons.

## 1 - Folder Contents

On the top level, you should see two folders: "Data Generation" and "Neural Network Training".

## 2 - Data Generation

The data generation folder contains the web application that was used to generate the buttons.

Inside the main folder are two sub-folders: "Button Generation JS" and "Mouse Control AutoIT".

### 2.1 - Mouse Control AutoIT 

This folder contains an AutoIT script called "AutoScreenshot". In order to execute this script, you will need to install AutoIT.

AutoIT can be installed from this link: https://www.autoitscript.com/site/autoit/downloads/

Alternatively, you can simply open the script in a text editor such as Notepad++ to view the contents.

This is the script that automatically moves the mouse and performs the click operations necessary for using the data generation program efficiently.

### 2.2 - Button Generation JS 

This is the project folder for the web application we used to generate the button images.

The CSS folder simply contains basic styling information for the box surrounding the generated images.

The JS folder contains the scripts that we wrote to generate the buttons and download the resulting labels.

You can open index.html in a web browser to interact with the actual interface. 
It is important to note that Chrome does not support the screenshot feature that we used, only Firefox.
However, any browser should work with basic generation.

Begin by pressing the "Start Labels" button to start tracking labels.
Use the "Generate" button to create a newly randomized button.
Optionally use the Firefox screenshot feature to save the image.
Continue generating for as many buttons as you want in the dataset.
Finally, press the "Download Labels" button to save a CSV with all of the labels.

## 3 - Neural Network Training

This folder contains the project for the actual neural network training and testing pages.

The data/ folder contains the pre-trained models that were trained on 600 images.
The data/ folder also contains the full library of 10,000 button images, along with their corresponding label CSV.

There are two html pages in this folder, "index" and "training".
NOTE: In order for either page to work, the folder must be hosted on a local server. Otherwise, the images will not upload correctly.

### 3.1 - Training 

The training page is where we actually went about training the neural network models.

It automatically loads a certain number of the button images and displays them as HTML images.

The "Choose File" button should be pressed first. It will open a file dialog where you can navigate to the label CSV in the data/ folder.

The "Give Images" button will add the loaded images to the neural network models for training.

The "Train" button will actually begin the training process, using the set of images that were given to the models.

The "Test Classify" button will test the neural networks using a percentage of the loaded images.

The "Output Accuracy" button will output the accuracy of the last set of classifications.

The "Save Models" button will automatically download the trained models to the Downloads/ folder.

The "Load Models" button will import the models that are stored in the data/ folder.
NOTE: It will automatically load based on the name of the neural network saved in the code.

### 3.2 - index (Deployment)

This page is called index so that when running in the local server, it is loaded first.

This is the page where we can actually use the trained models to analyze buttons and generate CSS for them.

At the top of the page is the "Load Neural Networks" button. Once again, it will load the models from the data/ folder.

The rest of the page is split into four columns, but the first three are nearly identical.
The first three columns represent the three different button states (base, hover, and clicked).

The below instructions are the same for all three columns.
First, use the "Choose File" button to search for a button image that you want to be used for that specific state.
After finding an image, it should fill the HTML image element below.
Next, press the "Analyze Image" button. This will pass the selected image to the loaded neural network models.
Once the neural networks have predicted their specific features, they will output the predictions to the table below.
Finally, you can press the "Generate -- CSS" button towards the bottom of the column.
This step will output a comparison between the groundtruth image and the result CSS button object.

Once you have performed the above for all three columns, you can press the "Generate Interactable" button in the fourth column.
This will generate a button object that combines the three loaded images into a single interactable button.
You can then hover over and click the generated button to view the different states.
NOTE: It will use the three images you last analyzed. If you forgot to press the analyze button, it may not match the loaded images.
