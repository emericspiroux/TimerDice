## TIMER DICE

Timerdice is a timetracker dice like [Timeular](https://timeular.com/) do, but in open source !


### Supported platforms

Current supported platform : macOS 10.15.7

### Print your Dice and connect wire

Print STL file will come sooner as possible (Not really yet finished), contact me if you want Fusion360 files or current STL files.

Will your dice is printed you will need :

- 1x ESP32 WEMOS Mini D1
- 1x Batterie shield
- 1x Batterie 720mAh (Normally for drone)
- 1x MPU6050
- Wires !

Connection Schema available soon but :

- MPU6050 -> ESP32
  - INT -> IO4
  - SCL -> IO22
  - SDA -> IO21


### Create your own TimerDice distribution

You need to have Xcode >= 12.2 installed for [@abandonware/noble](https://www.npmjs.com/package/@abandonware/noble) module. (Thanks to the team for this awesome work)

Now you just need to launch `npm run build` on root folder.

Distribution will be available into `back/out`






