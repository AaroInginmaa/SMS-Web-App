# SMS Web App
## Kuvaus
Node.js sovellus SMS viestien lähettämiseen käyttämällä [SMS Server Tools 3:a](http://smstools3.kekekasvi.com/).
## Asennus
1. Asenna [Node.js](https://nodejs.org/en/download)
2. Kloonaa github projekti
```
$ mkdir kansio
$ cd kansio
$ git clone https://github.com/AaroInginmaa/SMS-Web-App.git
```
 3. Asenna Express.js kloonaamaasi projektiin
```
$ cd kansio/SMS-Web-App
$ npm i express
```
Voit käynnistää sovelluksen, käyttämällä seuraavan node komennon sovelluksen kansiossa
```
$ node ./index.js
```
Jos haluat että sovellus toimii taustaprosessina, lue tämä [StackOverflow kysymys](https://stackoverflow.com/questions/4018154/how-do-i-run-a-node-js-app-as-a-background-service)
## Käyttö
Lähettääksesi viestin, syötä lomakkelle puhelinnumero ja haluamasi viesti, ja lopuksi paina lähetä nappia.
Viestin lähettämisessä voi mennä hetki, vältä lähettämästä useampaa viestiä kerrallaan, saat ilmoituksen, jos viestisi on lähetetty.
