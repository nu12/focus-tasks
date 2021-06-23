.PHONY: build android res

build:
	ionic build --verbose

android:
	ionic cordova build android --verbose

res:
	cordova-res --skip-config --copy

browser:
	ionic cordova run browser