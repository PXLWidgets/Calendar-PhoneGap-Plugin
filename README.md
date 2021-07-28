# PhoneGap Calendar plugin (without requiring calendar permission on Android (iOS still does))

1. [Description](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#1-description)
2. [Installation](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#2-installation)
	2. [Automatically](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#automatically)
	2. [Manually](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#manually)
	2. [PhoneGap Build](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#phonegap-build)
3. [Usage](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#3-usage)
4. [Promises](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#4-promises)
5. [Credits](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#5-credits)
6. [License](https://github.com/PXLWidgets/cordova-plugin-calendar-intent#6-license)

## 1. Description

This plugin allows you to add events to the Calendar of the mobile device.
This fork only allows creating events 'interatively', without calendar read/write permission.

* Works with PhoneGap >= 3.0.
* For PhoneGap 2.x, see [the pre-3.0 branch](https://github.com/PXLWidgets/cordova-plugin-calendar-intent/tree/pre-3.0).
* Compatible with [Cordova Plugman](https://github.com/apache/cordova-plugman).
* [Officially supported by PhoneGap Build](https://build.phonegap.com/plugins).

### iOS specifics
* All methods work without showing the native calendar. Your app never loses control.
* Tested on iOS 6+.
* On iOS 10+ you need to provide a reason to the user for Calendar access. This plugin adds an empty `NSCalendarsUsageDescription` key to the /platforms/ios/*-Info.plist file which you can override with your custom string. To do so, pass the following variable when installing the plugin:

```
cordova plugin add cordova-plugin-calendar --variable CALENDAR_USAGE_DESCRIPTION="This app uses your calendar"
```

## 2. Installation

### Automatically
```
$ cordova plugin add https://github.com/PXLWidgets/cordova-plugin-calendar-intent.git
```

### Manually

#### iOS

1\. Add the following xml to your `config.xml`:
```xml
<!-- for iOS -->
<feature name="Calendar">
	<param name="ios-package" value="Calendar" />
</feature>
```

2\. Grab a copy of Calendar.js, add it to your project and reference it in `index.html`:
```html
<script type="text/javascript" src="js/Calendar.js"></script>
```

3\. Download the source files for iOS and copy them to your project.

Copy `Calendar.h` and `Calendar.m` to `platforms/ios/<ProjectName>/Plugins`

4\. Click your project in XCode, Build Phases, Link Binary With Libraries, search for and add `EventKit.framework` and `EventKitUI.framework`.

#### Android

1\. Add the following xml to your `config.xml`:
```xml
<!-- for Android -->
<feature name="Calendar">
  <param name="android-package" value="nl.xservices.plugins.Calendar" />
</feature>
```

2\. Grab a copy of Calendar.js, add it to your project and reference it in `index.html`:
```html
<script type="text/javascript" src="js/Calendar.js"></script>
```

3\. Download the source files for Android and copy them to your project.

Android: Copy `Calendar.java` to `platforms/android/src/nl/xservices/plugins` (create the folders/packages).
Then create a package called `accessor` and copy other 3 java Classes into it.

Note that if you don't want your app to ask for these permissions, you can leave them out, but you'll only be able to
use one function of this plugin: `createEventInteractively`.


### PhoneGap Build

Add the following xml to your `config.xml` to always use the latest npm version of this plugin:
```xml
<plugin name="cordova-plugin-calendar" />
```

Also, make sure you're building with Gradle by adding this to your `config.xml` file:
```xml
<preference name="android-build-tool" value="gradle" />
```

## 3. Usage

The table gives an overview of basic operation compatibility:

Operation                           | Comment     | iOS | Android |
----------------------------------- | ----------- | --- | ------- |
createEventInteractively            | interactive | yes | yes     |
createEventInteractivelyWithOptions | interactive | yes | yes     |
openCalendar                        |             | yes | yes     |

* \* on Android < 4 dialog is shown

Basic operations, you'll want to copy-paste this for testing purposes:
```js
  // prep some variables
  var startDate = new Date(2015,2,15,18,30,0,0,0); // beware: month 0 = january, 11 = december
  var endDate = new Date(2015,2,15,19,30,0,0,0);
  var title = "My nice event";
  var eventLocation = "Home";
  var notes = "Some notes about this event.";
  var success = function(message) { alert("Success: " + JSON.stringify(message)); };
  var error = function(message) { alert("Error: " + message); };

  // create an event silently (on Android < 4 an interactive dialog is shown which doesn't use this options) with options:
  var calOptions = window.plugins.calendar.getCalendarOptions(); // grab the defaults
  calOptions.firstReminderMinutes = 120; // default is 60, pass in null for no reminder (alarm)
  calOptions.secondReminderMinutes = 5;

  // Added these options in version 4.2.4:
  calOptions.recurrence = "monthly"; // supported are: daily, weekly, monthly, yearly
  calOptions.recurrenceEndDate = new Date(2016,10,1,0,0,0,0,0); // leave null to add events into infinity and beyond

  // This is new since 4.2.7:
  calOptions.recurrenceInterval = 2; // once every 2 months in this case, default: 1

  // And the URL can be passed since 4.3.2 (will be appended to the notes on Android as there doesn't seem to be a sep field)
  calOptions.url = "https://www.google.com";

  // create an event interactively
  window.plugins.calendar.createEventInteractively(title,eventLocation,notes,startDate,endDate,success,error);

  // create an event interactively with the calOptions object as shown above
  window.plugins.calendar.createEventInteractivelyWithOptions(title,eventLocation,notes,startDate,endDate,calOptions,success,error);

  // open the calendar app (added in 4.2.8):
  // - open it at 'today'
  window.plugins.calendar.openCalendar();
  // - open at a specific date, here today + 3 days
  var d = new Date(new Date().getTime() + 3*24*60*60*1000);
  window.plugins.calendar.openCalendar(d, success, error); // callbacks are optional
```

Creating an all day event:
```js
  // set the startdate to midnight and set the enddate to midnight the next day
  var startDate = new Date(2014,2,15,0,0,0,0,0);
  var endDate = new Date(2014,2,16,0,0,0,0,0);
```

Creating an event for 3 full days
```js
  // set the startdate to midnight and set the enddate to midnight 3 days later
  var startDate = new Date(2014,2,24,0,0,0,0,0);
  var endDate = new Date(2014,2,27,0,0,0,0,0);
```

Example Response IOS getCalendarOptions
```js
{
calendarId: null,
calendarName: "calendar",
firstReminderMinutes: 60,
recurrence: null,
recurrenceEndDate: null,
recurrenceInterval: 1,
secondReminderMinutes: null,
url: null
}
```

## 4. Promises
If you like to use promises instead of callbacks, or struggle to create a lot of
events asynchronously with this plugin then I encourage you to take a look at
[this awesome wrapper](https://github.com/poetic-labs/native-calender-api) for
this plugin. Kudos to [John Rodney](https://github.com/JohnRodney) for this piece of art!

## 5. Credits

This plugin was enhanced for Plugman / PhoneGap Build by [Eddy Verbruggen](http://www.x-services.nl). I fixed some issues in the native code (mainly for iOS) and changed the JS-Native functions a little in order to make a universal JS API for both platforms.
* Inspired by [this nice blog of Devgirl](http://devgirl.org/2013/07/17/tutorial-how-to-write-a-phonegap-plugin-for-android/).
* Credits for the original iOS code go to [Felix Montanez](https://github.com/felixactv8/Phonegap-Calendar-Plugin-ios).
* Credits for the original Android code go to [Ten Forward Consulting](https://github.com/tenforwardconsulting/Phonegap-Calendar-Plugin-android) and [twistandshout](https://github.com/twistandshout/phonegap-calendar-plugin).
* Special thanks to [four32c.com](http://four32c.com) for sponsoring part of the implementation, while keeping the plugin opensource.

## 6. License

[The MIT License (MIT)](http://www.opensource.org/licenses/mit-license.html)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
