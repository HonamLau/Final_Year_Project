#include "arduino_secret.h"
#include <WiFiNINA.h>
char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
int status = WL_IDLE_STATUS;

void setup(){
    while (status != WL_AP_CONNECTED)
    {
        /* code */
    }
    
}