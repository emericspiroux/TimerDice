#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <Wire.h>
#include <string>
#include "driver/rtc_io.h"
#include "MPU6050_6Axis_MotionApps20.h"
// Gyro 
#include <MPU6050.h>
int16_t GyX,GyY,GyZ;

MPU6050 mpu;

// Bluetooth
BLEServer* pServer = NULL;
BLECharacteristic* pCharacteristic = NULL;
bool deviceConnected = false;
bool oldDeviceConnected = false;

// See the following for generating UUIDs:
// https://www.uuidgenerator.net/

#define SERVICE_UUID        "a6389dd3-9009-4b21-902d-72a1dc8c579d"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define INTERRUPT_PIN       
#define MOVED_LOOP_LIMIT 5

class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
      deviceConnected = true;
    };

    void onDisconnect(BLEServer* pServer) {
      deviceConnected = false;
    }
};

bool moved = true;
uint8_t movedLoop = 0;

void IRAM_ATTR Motion() {
  Serial.println("MOTION DETECTED!!!");
  moved = true;
  movedLoop = 0;
}

void setup() {
  uint8_t dmpStatus;
  
  Serial.begin(115200);
//  while (!Serial); // wait for Leonardo enumeration, others continue immediately

  // NOTE: 8MHz or slower host processors, like the Teensy @ 3.3V or Arduino
  // Pro Mini running at 3.3V, cannot handle this baud rate reliably due to
  // the baud timing being too misaligned with processor ticks. You must use
  // 38400 or slower in these cases, or use some kind of external separate
  // crystal solution for the UART timer.

  // initialize device
  Serial.println(F("Initializing I2C devices..."));
  Wire.begin();
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println(F("pas de MPU"));
    while (true);
  }
  mpu.setIntMotionEnabled(true); // INT_ENABLE register enable interrupt source  motion detection
  mpu.setMotionDetectionThreshold(3); // 1mg/LSB
  mpu.setMotionDetectionDuration(2); // number of consecutive samples above threshold to trigger int
  attachInterrupt(digitalPinToInterrupt(GPIO_NUM_4), Motion, RISING);
  
  // Create the BLE Device
  BLEDevice::init("TimerDice");

  // Create the BLE Server
  pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());

  // Create the BLE Service
  BLEService *pService = pServer->createService(SERVICE_UUID);

  // Create a BLE Characteristic
  pCharacteristic = pService->createCharacteristic(
                      CHARACTERISTIC_UUID,
                      BLECharacteristic::PROPERTY_READ   |
                      BLECharacteristic::PROPERTY_WRITE  |
                      BLECharacteristic::PROPERTY_NOTIFY |
                      BLECharacteristic::PROPERTY_INDICATE
                    );

  // https://www.bluetooth.com/specifications/gatt/viewer?attributeXmlFile=org.bluetooth.descriptor.gatt.client_characteristic_configuration.xml
  // Create a BLE Descriptor
  pCharacteristic->addDescriptor(new BLE2902());

  // Start the service
  pService->start();

  // Start advertising
  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->setScanResponse(false);
  pAdvertising->setMinPreferred(0x0);  // set value to 0x00 to not advertise this parameter
  BLEDevice::startAdvertising();
  Serial.println("Waiting a client connection to notify...");
//  delay(1500);
//  while(!deviceConnected) {
//    Serial.println("Going to deepsleep");
//    esp_sleep_enable_timer_wakeup(5000);
//    return esp_deep_sleep_start();
//  }
//
//  Serial.println("Device connected ! Sent !");
//  mpu.getRotation(&GyX, &GyY, &GyZ);
//  Serial.println("\n\nGyroscope Values:");
//  String strValue = String(GyX) + ":" + String(GyY) + ":" + String(GyZ);
//  Serial.println(strValue);
//  pCharacteristic->setValue(strValue.c_str());
//  pCharacteristic->notify();
//  Serial.println("Waiting for message send");
//  delay(1500);
//  pinMode(LED_BUILTIN, OUTPUT);
//  digitalWrite(LED_BUILTIN, LOW);
//  Serial.println("Going to deepsleep after notify");

}

int minVal=265;
int maxVal=402;
double x;
double y;
double z;

void loop() {

  mpu.getAcceleration(&GyX, &GyY, &GyZ);
  
  int xAng = map(GyX,minVal,maxVal,-90,90);
    int yAng = map(GyY,minVal,maxVal,-90,90);
    int zAng = map(GyZ,minVal,maxVal,-90,90);

     x= RAD_TO_DEG * (atan2(-yAng, -zAng)+PI);
     y= RAD_TO_DEG * (atan2(-xAng, -zAng)+PI);
     z= RAD_TO_DEG * (atan2(-yAng, -xAng)+PI);

   Serial.print("AngleX= ");
   Serial.println(x);

   Serial.print("AngleY= ");
   Serial.println(y);

   Serial.print("AngleZ= ");
   Serial.println(z);

   Serial.print("hasMoved : ");
   Serial.println(moved);

   Serial.println("-----------------------------------------");

  if (deviceConnected) {
    String strValue = String(x) + ":" + String(y) + ":" + String(z);
    Serial.print("Send Value to BLE:");
    Serial.println(strValue.c_str());
    pCharacteristic->setValue(strValue.c_str());
    pCharacteristic->notify();
  }

   if (moved) {
    movedLoop++;
    Serial.print("Moved Loop : ");
    Serial.println(movedLoop);
    if (movedLoop > MOVED_LOOP_LIMIT) {
       esp_sleep_enable_ext0_wakeup(GPIO_NUM_4,1);
       esp_deep_sleep_start();
    }
   }

   Serial.println("-----------------------------------------");
   
   delay(500);
}
