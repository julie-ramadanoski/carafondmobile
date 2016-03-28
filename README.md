
##Configuration du serveur ionic

	$ ionic serve --address=139.124.142.105 --port=8100 --serverlogs --consolelogs
	$ ionic serve --address=192.168.1.31 --port=8100 --serverlogs --consolelogs
	$ ionic run browser
	$ ionic run android --device (--target=IDduMobile)
	$ adb devices # liste des mobiles et emulateurs disponibles
	$ adb logcat pour voir les traces du device


Sur android

##La case est prise en compte

les fichiers sources doivent être en minuscules. sinon ils ne seront pas trouvés.

## config.xml

Les autorisations d'envoi et de réception de données totale se font ouvertement tel que :
	<content src="index.html"/>
	<allow-navigation href="*" />
	<allow-intent href="*" />
	<access origin="*"/>
A changer en prod bien sur
  
Les versions sont à changer également dans myApp/plateforms/android/res/xml/config.xml
	<preference name="android-minSdkVersion" value="10"/>
	<preference name="android-maxSdkVersion" value="23"/>
	<preference name="android-targetSdkVersion" value="10"/>

## Plugin whitelist
le fichier index.html doit contenir la meta suivante qui contien les instruction de validation ou de refus des données
	<meta http-equiv="Content-Security-Policy" content="default-src 'self' http://* data: gap: https://ssl.gstatic.com ; script-src 'self'">
  
## Compatibilité ancienne versions

	JSON.originalParse = JSON.parse;
	JSON.parse = function (text) {
	  if (text) {
	    return JSON.originalParse(text);
	  } else {
	    console.log('no longer crashing on null value but just returning null');
	    return null;
	  }
	}