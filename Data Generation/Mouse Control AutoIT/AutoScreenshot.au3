; Define an exit function to stop the script just in case
Func _Exit()
   Exit
EndFunc

; Bind a hotkey to the exit function (Press F8 to stop!)
HotKeySet("{ESC}", "_Exit")

; Mode 1 means relative to the top left of the primary screen (right hand screen)
Opt("MouseCoordMode", 1)

; The first thing we need to do is press the "Start Labels" button to begin the dataset generation
MouseMove(133, 114)
MouseClick("left")

; Define a variable named $current that we can use to control the count
local $current = 0

; Define a variable for how many screenshots we want to take
local $max = 10000

; Loop and take screenshots. Loop starts at Do and ends at Until
Do
   ; Move to the generate button and click
   MouseMove(48, 112, 10)
   MouseClick("left")

   ; Moves away and right clicks to open the options
   MouseMove(250,250, 10)
   MouseClick("right")

   ; Move down to "Take Screenshot" and then click
   MouseMove(351, 487, 10)
   MouseClick("left")

   ; Move back into the button element box so Firefox highlights it
   MouseMove(150, 240, 10) ; This HAS to be a speed of 2 or more (needs time to process)
   MouseClick("left")

   ; Move down to the download button and click it. This automatically saves the image to the downloads folder
   ; The name of the image is defaulted to a timestamp ... will need to write a script to clean this up later
   MouseMove(220, 280, 10)
   MouseClick("left")

   ; Increase the counter
   $current += 1

; Loop the above block until the bottom condition is solved
Until $current = $max

; The last thing we need to do is press the "Download Labels" button to finish the dataset generation and get the CSV of labels
MouseMove(240, 114)
MouseClick("left")