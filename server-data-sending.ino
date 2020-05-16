
#include <SPI.h>
#include <WiFiNINA.h>
#include "arduino_secrets.h" 
#define sensorPin 2

char ssid[] = SECRET_SSID;        
char pass[] = SECRET_PASS; 
char user[] = SECRET_USER;

int status = WL_IDLE_STATUS;
char server[] = "143.89.130.87";
String postData;
String postVariable = "current=";
int analogPin = A0;
float reading = 0;
float currentValue = 0;
int offset = 0.34;
WiFiClient client;
byte mac[6];
String mystring;

void setup() {
  Serial.begin(9600);
  pinMode(2, OUTPUT);
    while (status != WL_CONNECTED) {
      Serial.print("Attempting to connect to Network named: ");
      Serial.println(ssid);
      status = WiFi.beginEnterprise(ssid, user, pass);
      delay(5000);
    }
  Serial.print("SSID: ");
  Serial.println(WiFi.SSID());
  IPAddress ip = WiFi.localIP();
  IPAddress gateway = WiFi.gatewayIP();
  Serial.print("IP Address: ");
  Serial.println(ip);
  WiFi.macAddress(mac);
  mystring = printMacAddress(mac);
  Serial.println(mystring);
    while(client.connect(server, 5000)) {
      Serial.println("connected to server");
      client.println("GET /matching/?mac="+mystring+" HTTP/1.1");
      client.println("Content-Type: application/x-www-form-urlencoded"); 
      client.print("Content-Length: ");
      client.println("3");
      client.println();
      client.print("try");
      //client.println(currentValue);
      delay(2000);
      String testtest;
        while(client.available()){
          client.flush();
          testtest = client.readStringUntil('\n');
          Serial.println(testtest);
            if(testtest == "matched"){
              break;
            }
        }     
      delay(2000);
        if(testtest == "matched"){
          break;
        } 
    }   
}
  
void loop() {
  String n="Michael";
  float volt; 
  float v=100;
  String vol=String(v);
  String test="";
  String jsonStr = "{\"name\":Michael,\"voltage\":100}";
  String request= "/read/?mac="+ mystring + "&current=";
  Serial.print(request);
  if (client.connect(server, 5000)) {
    Serial.println("connected to server");
    volt = updateCurrent();
    request += volt;
    client.println("GET " + request + " HTTP/1.1");
    client.println("Content-Type: application/x-www-form-urlencoded"); 
    client.print("Content-Length: ");
    client.println("3");
    client.println();
    client.print("try");
    delay(2000);
    while(client.available()){
      //for(int i=0; i < 10; i++){
      client.flush();
      test = client.readStringUntil('\n');
      Serial.println(test);
        if(test == "ON"){
          digitalWrite(2, HIGH);
          Serial.println("turn on");
          break;
        }
        if(test == "OFF"){
          digitalWrite(2, LOW);
          Serial.println("turn off");
          break;
        }
    }    
  }else{
    Serial.println("failed to connect to server");
  }if (client.connected()) {
    client.stop();
  }
  delay(100);
}

float updateCurrent() {
  float average = 0;
  reading = analogRead(analogPin); //Raw data reading
    for(int i = 0; i< 1000; i++)
  {
    average = average +(.0264 * analogRead(A0)-11)/1000;
    delay(1);
  }
  Serial.println(average);
  return average;
}

String printMacAddress(byte mac[]) {
  String test;
  for (int i = 5; i >= 0; i--) {
    if (mac[i] < 16) {
      Serial.print("0");
      test+="0";
    }
    Serial.print(mac[i], HEX);
    test+=String(mac[i],HEX);
    if (i > 0) {
      Serial.print(":");
      test+=":";
    }
  }
  Serial.println();
  return test;
}
