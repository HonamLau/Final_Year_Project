#include "arduino_secret.h"
#include <WiFiNINA.h>
char ssid[] = "Mok";
char pass[] = "1234567890";
int status = WL_IDLE_STATUS;

void setup(){
    pinMode(13,OUTPUT);
    while (status != WL_AP_CONNECTED)
    {
        /* code *///wekuHEJKH
        //ASDFADSFDSAFDSAFADSFDASFDASFDSAFDASFADSF
        status=WiFi.begin(ssid,pass);
       

    }
    //WiFi.begin(ssid,pass);
}

void loop(){

digitalWrite(13,HIGH);
delay(1000);
digitalWrite(13,LOW);
delay(1000);

}