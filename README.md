# A four-handed "Weasley" Clock


https://user-images.githubusercontent.com/989243/139255803-986225fb-e1a2-4cf8-a686-52532e8d849e.mp4


## Parts
* 1 x Raspberry Pi
* 1 x rear plate cut from 6mm acrylic (with the big holes)
* 1 x front plate cut from 6mm acrylic
* 1 x set of clock hands laser cut from 1mm brass
* 4 x 65mm standoffs with M4 internal thread at both ends.
* 16 x M4x12mm countersunk machine screws
* 8 x M4 nuts
* 4 x 8mm OD 5mm ID plastic flanged bush
* 1 x 8mm OD 6mm ID plastic flanged bush
* 4 x 28BYJ-48 stepper motors
* 4 x flexible shaft coupling, approx 25mm long, 5mm bore, [example](https://www.robotshop.com/uk/servocity-flexible-clamping-shaft-coupler-5mm-5mm.html)
* 1 x 19mm OD, 6mm ID bearing eg [626ZZ](https://www.bearingshopuk.co.uk/626-zz/)
* 1 x stepper motor driver, eg [4tronix PiStep2](https://thepihut.com/products/pistep2-quad-stepper-motor-controller-for-raspberry-pi)
* 3 x 28 Teeth, 22.4mm pitch, 6mm bore gears (https://uk.rs-online.com/web/p/spur-gears/5217304/)
* 5 x 30 Teeth, 24mm pitch, 5mm bore gears (https://uk.rs-online.com/web/p/spur-gears/5217310/)
* 2 x 3mm ID, 6mm OD bush 9mm long (https://uk.rs-online.com/web/p/plain-bushes/5217720/)
* 1 x 4mm ID, 6mm OD bush 9mm long (https://uk.rs-online.com/web/p/plain-bushes/5217736/)
* 1 x 97mm 3mm OD [brass tube](https://maccmodels.co.uk/shop/3mm-dia-brass-tube-0-45mm-wall-300mm-long-copy/)
* 1 x 58mm 4mm OD/3.5mm ID [brass tube](https://maccmodels.co.uk/shop/4mm-dia-brass-tube-0-45mm-wall-copy/)
* 1 x 44mm 5mm OD/4.5mm ID [brass tube](https://maccmodels.co.uk/shop/5mm-dia-brass-tube-0-45mm-wall/)
* 1 x 30mm 6mm OD/5.5mm ID [brass tube](https://maccmodels.co.uk/shop/6mm-dia-brass-tube-300mm-long-2/)
* 4 x 67mm 5mm OD/4.5mm ID brass tube (a 350mm length of 5mm tube would cover it)
* Cyanoacrylate glue
* For the face we used 18mm MDF, laser printer, PVA glue and paint.

When cutting the tubes down to size, deburr and be careful not to compress the ends, they've got to rotate freely.

## Mechanism
1. On the two plastic plates, one of the four holes on both plates is 0.8mm closer to the center. On version 2 of the drawings (uploaded) this is marked with a
small hold next to it, but on version 1 it's not - identify and mark this hole on both plates
2. Glue 4mm ID and 3mm ID bushs inside two of the 6mm bore gears. We now have one gear each with 3mm/4mm/6mm core, five with 5mm core

![IMG_3619](https://user-images.githubusercontent.com/989243/139239601-22435317-1567-492f-a992-57e7fb567964.jpg)

3. Glue 6mm core gear to 6mm tube, teeth at the end of the tube. One drop should do it.
4. Glue 5mm core gear to 5mm tube, teeth at the end of the tube
5. Glue 4mm core gear to 4mm tube, teeth 38mm from the end of the tube (picture shows it not at the end, but it should be)
6. Glue 3mm core gear to 3mm tube, teeth 28mm from the end of the tube
7. Glue 3mm ID, 6mm OD bush to end of 3mm tube nearest the gear
8. Fit 4 remaining 5mm gears to 67x5mm OD tubes, teeth about 10mm in from end. Glue later once meshed.

![IMG_3620](https://user-images.githubusercontent.com/989243/139240961-993bb6ae-3e17-44f7-9272-a1d5d9b7b31f.jpg)

9. Motors are fitted with couplings and connected to rear plate, as are standoffs (countersink holes a bit) and 6mm ID flanged bush

![IMG_3622](https://user-images.githubusercontent.com/989243/139241802-a4616bb3-5aca-411e-a6f6-ba4394c11024.jpg)
![IMG_3624](https://user-images.githubusercontent.com/989243/139242307-9f6aa309-f32a-4ef9-b3ee-1208a9cd43fd.jpg)


10. 4 brass tubes are nested, and put into rear plate
 
![IMG_3621](https://user-images.githubusercontent.com/989243/139241392-25023725-bc8d-491c-83ac-027767bd02ce.jpg)


11. Four 5mm brass tubes are fitted to motor couplings. The marked hole meshes with the central 5mm OD tube, the others can mesh in any order.
12. Fit the bearing and 4 x 5mm ID bushes into the front plate, countersink the screw holes so they're completely recessed and screw to standoffs.


![IMG_3628](https://user-images.githubusercontent.com/989243/139242984-a512ed80-e819-4cc8-8c04-6ac6882e9372.jpg)
![IMG_3629](https://user-images.githubusercontent.com/989243/139243390-ad537e79-1708-4b59-bd8b-e1f4a7eff4e7.jpg)


## Assembly
Less photos here. We cut a round clockface out of 18mm MDF, painted it, drilled an overlarge (10mm or more) hole in the middle, so friction on the tubes is easily avoided. We designed a clock face, *flipped it horizontally* (important) and printed it out onto a monochrome laser. We then transferred the laser toner to the wood by covering the wood in PVA glue and glueing the paper, face down, and leaving it overnight. The next day we carefully remove the paper by soaking it with water and rubbing it.

![IMG_3667](https://user-images.githubusercontent.com/989243/139256974-677df55e-4ed0-4a55-b666-feaf939b26a8.jpg)

The mechanism can be screwed to the back side of this clock face (holes 74mm apart) with the tubes poking through. The clock hands should press fit on, no glue required. If you're going to glue a photo or some way to identify each hand, do it before this step!

Fit the motors to the motor driver board, fit that to the Raspberry Pi, and be sure to power the Pi via the USB port _on the motor board_, not on the Pi itself. The Motors use a bit of power, and the Pi has a polyfuse on its USB input which can trip when too much power is drawn. Power both boards via the motor board and you won't have this issue.


https://user-images.githubusercontent.com/989243/139246527-b8acf82c-0bef-4004-a101-bafe20a1f79c.mp4


