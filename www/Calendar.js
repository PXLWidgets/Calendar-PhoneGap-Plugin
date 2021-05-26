"use strict";
function Calendar() {
}

Calendar.prototype.getCreateCalendarOptions = function () {
  return {
    calendarName: null,
    calendarColor: null // optional, the OS will choose one if left empty, example: pass "#FF0000" for red
  };
};

Calendar.prototype.openCalendar = function (date, successCallback, errorCallback) {
  // default: today
  if (!(date instanceof Date)) {
    date = new Date();
  }
  cordova.exec(successCallback, errorCallback, "Calendar", "openCalendar", [{
    "date": date.getTime()
  }]);
};

Calendar.prototype.getCalendarOptions = function () {
  return {
    firstReminderMinutes: 60,
    secondReminderMinutes: null,
    recurrence: null, // options are: 'daily', 'weekly', 'monthly', 'yearly'
    recurrenceInterval: 1, // only used when recurrence is set
    recurrenceWeekstart: "MO",
    recurrenceByDay: null,
    recurrenceByMonthDay: null,
    recurrenceEndDate: null,
    recurrenceCount: null,
    calendarName: null,
    calendarId: null,
    url: null
  };
};

Calendar.prototype.createEventInteractively = function (title, location, notes, startDate, endDate, successCallback, errorCallback) {
  Calendar.prototype.createEventInteractivelyWithOptions(title, location, notes, startDate, endDate, {}, successCallback, errorCallback);
};

Calendar.prototype.createEventInteractivelyWithOptions = function (title, location, notes, startDate, endDate, options, successCallback, errorCallback) {
  // merge passed options with defaults
  var mergedOptions = Calendar.prototype.getCalendarOptions();
  for (var val in options) {
    if (options.hasOwnProperty(val)) {
      mergedOptions[val] = options[val];
    }
  }
  if (options.recurrenceEndDate != null) {
    mergedOptions.recurrenceEndTime = options.recurrenceEndDate.getTime();
  }
  cordova.exec(successCallback, errorCallback, "Calendar", "createEventInteractively", [{
    "title": title,
    "location": location,
    "notes": notes,
    "startTime": startDate instanceof Date ? startDate.getTime() : null,
    "endTime": endDate instanceof Date ? endDate.getTime() : null,
    "options": mergedOptions
  }])
};

Calendar.prototype.parseEventDate = function (dateStr) {
  // Handle yyyyMMddTHHmmssZ iCalendar UTC format
  var icalRegExp = /\b(\d{4})(\d{2})(\d{2}T\d{2})(\d{2})(\d{2}Z)\b/;
  if (icalRegExp.test(dateStr))
    return new Date(String(dateStr).replace(icalRegExp, '$1-$2-$3:$4:$5'));

  var spl;
  // Handle yyyy-MM-dd HH:mm:ss format returned by AbstractCalendarAccessor.java L66 and Calendar.m L378, and yyyyMMddTHHmmss iCalendar local format, and similar
  return (spl = /^\s*(\d{4})\D?(\d{2})\D?(\d{2})\D?(\d{2})\D?(\d{2})\D?(\d{2})\s*$/.exec(dateStr))
    && new Date(spl[1], spl[2] - 1, spl[3], spl[4], spl[5], spl[6])
    || new Date(dateStr);
};

Calendar.install = function () {
  if (!window.plugins) {
    window.plugins = {};
  }

  window.plugins.calendar = new Calendar();
  return window.plugins.calendar;
};

cordova.addConstructor(Calendar.install);
