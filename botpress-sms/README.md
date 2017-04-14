# botpress-SMS

Étude de développement pour déterminer quelle méthode est la meilleure pour créer un module SMS dans Botpress.  

## SMS Gateway

Le gateway est une passerelle entre un numéro de téléphone et un protocole internet (~~http~~, ~~smtp~~,SSMP). Une compagnie peut délivrer ou ne pas délivrer de gateway à ses clients. Au Québec, seulement Vidéotron ne délivre pas de gateway pour ses clients.  

Aux États-Unis, certaines compagnies offrent le gateway. Voici un petit tableau résumant ceux qui n’offrent ou n'offrent pas de gateway.

|Mobile carrier|SMS gateway domain|	MMS gateway domain|
|---|---|---|
|Alltel|sms.alltelwireless.com|mms.alltelwireless.com|
|AT&T|txt.att.net|mms.att.net|
|Boost Mobile|sms.myboostmobile.com|myboostmobile.com|
|Cricket Wireless|:-1:|mms.cricketwireless.net|
|Project Fi|:-1:|msg.fi.google.com|
|Republic Wireless|:-1:|:-1:|
|Sprint|messaging.sprintpcs.com|pm.sprint.com|
|T-Mobile|tmomail.net|tmomail.net|
|U.S. Cellular|email.uscc.net|mms.uscc.net|
|Verizon Wireless|vtext.com|vzwpix.com|
|Virgin Mobile|vmobl.com|vmpix.com|

J'avais déjà implémenté ce genre de système à l'école. Je crois que ce système pourrait être implémenter dans botpress. De plus, cette méthode est gratuite.  

Par contre, il n'y a pas tous les distributeurs qui offre ce service :-1:.

Un projet openSource [textbelt](https://github.com/typpo/textbelt)


## Twilio

Twilio est surement l'API la plus connue pour envoyer des SMS via internet. L'application est robuste, puisque Uber notifie ses conducteurs. Par contre, l'application est payante. $$0.0075$$$ par message envoyer (États-Unis). Voici la liste de [prix par pays](https://www.twilio.com/sms/pricing/ca). 

Les utilisateurs devrait déjà avoir un compte Twilio pour pouvoir profiter de ce module.

## SMPP API

En fait, gatewaySMS utilise le protocole SMPP(Short message Peer-to-peer). J'ai trouver de la documentation sur l'implémentation d'un système sous nodeJs. 

Tutorial : [Here](http://kalapun.com/posts/working-with-sms-via-smpp-in-nodejs/)

Projet : [SMPP](https://github.com/farhadi/node-smpp)


Cette avenu pourrait potentiellement être la meilleur solution

## From scratch ? 

Je ne pense inventé la roue. 


