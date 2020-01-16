
#include <SPI.h>
#include <WiFiNINA.h>

#include "arduino_secrets.h" 
char ssid[] = SECRET_SSID;        
char pass[] = SECRET_PASS; 
char user[] = SECRET_USER;

<<<<<<< HEAD
int status = WL_IDLE_STATUS;    
=======
int status = WL_IDLE_STATUS;     
>>>>>>> 541665bc9f08d7eb9cd6c9cbd46cb18407ee60ee


//IPAddress server(74,125,232,128);  // numeric IP for Google (no DNS)
char server[] = "143.89.130.87/";    // name address for Google (using DNS)t pingResult;
WiFiClient client;
void setup() {
  
  Serial.begin(9600);
  while (!Serial) {
    ; 
  }
  
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    while (true);
  }

  while ( status != WL_CONNECTED) {
    Serial.print("Attempting to connect to WPA SSID: ");
    Serial.println(ssid);
   
    status = WiFi.beginEnterprise(ssid, user, pass);  
    delay(5000);
  }

  Serial.println("You're connected to the network");
  printCurrentNet();
  printWiFiData();
}

void loop() {
<<<<<<< HEAD
  //Serial.print("Hello");
  //Serial.print("Hellohihi");
=======
  Serial.print("Hello");
  Serial.print("Hellohihi");
>>>>>>> 541665bc9f08d7eb9cd6c9cbd46cb18407ee60ee
  delay(5000);
  WebClient();

}

void WebClient(){
if (client.connect(server, 5000)) {
    Serial.println("connected to server");
    // Make a HTTP request:
    //client.println("GET /search?q=arduino HTTP/1.1");
    //client.println("Host: www.google.com");
    //client.println("Connection: close");
    client.println();
  }

}

void printWiFiData() {
  // print your board's IP address:
  IPAddress ip = WiFi.localIP();
  Serial.print("IP address : ");
  Serial.println(ip);

  Serial.print("Subnet mask: ");
  Serial.println((IPAddress)WiFi.subnetMask());

  Serial.print("Gateway IP : ");
  Serial.println((IPAddress)WiFi.gatewayIP());

  // print your MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  Serial.print("MAC address: ");
  printMacAddress(mac);
}

void printCurrentNet() {
  // print the SSID of the network you're attached to:
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());

  // print the MAC address of the router you're attached to:
  byte bssid[6];
  WiFi.BSSID(bssid);
  Serial.print("BSSID: ");
  printMacAddress(bssid);
  // print the received signal strength:
  long rssi = WiFi.RSSI();
  Serial.print("signal strength (RSSI): ");
  Serial.println(rssi);

  // print the encryption type:
  byte encryption = WiFi.encryptionType();
  Serial.print("Encryption Type: ");
  Serial.println(encryption, HEX);
  Serial.println();
}

void printMacAddress(byte mac[]) {
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) {
      Serial.print("0");
    }
    Serial.print(mac[i], HEX);
    if (i > 0) {
      Serial.print(":");
    }
  }
  Serial.println();

}