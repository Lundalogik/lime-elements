/* flatpickr v4.5.2, @license MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.flatpickr = factory());
}(this, (function () { 'use strict';

  const pad = (number) => `0${number}`.slice(-2);
  const int = (bool) => (bool === true ? 1 : 0);
  function debounce(func, wait, immediate = false) {
      let timeout;
      return function () {
          let context = this, args = arguments;
          timeout !== null && clearTimeout(timeout);
          timeout = window.setTimeout(function () {
              timeout = null;
              if (!immediate)
                  func.apply(context, args);
          }, wait);
          if (immediate && !timeout)
              func.apply(context, args);
      };
  }
  const arrayify = (obj) => obj instanceof Array ? obj : [obj];

  const do_nothing = () => undefined;
  const monthToStr = (monthNumber, shorthand, locale) => locale.months[shorthand ? "shorthand" : "longhand"][monthNumber];
  const revFormat = {
      D: do_nothing,
      F: function (dateObj, monthName, locale) {
          dateObj.setMonth(locale.months.longhand.indexOf(monthName));
      },
      G: (dateObj, hour) => {
          dateObj.setHours(parseFloat(hour));
      },
      H: (dateObj, hour) => {
          dateObj.setHours(parseFloat(hour));
      },
      J: (dateObj, day) => {
          dateObj.setDate(parseFloat(day));
      },
      K: (dateObj, amPM, locale) => {
          dateObj.setHours((dateObj.getHours() % 12) +
              12 * int(new RegExp(locale.amPM[1], "i").test(amPM)));
      },
      M: function (dateObj, shortMonth, locale) {
          dateObj.setMonth(locale.months.shorthand.indexOf(shortMonth));
      },
      S: (dateObj, seconds) => {
          dateObj.setSeconds(parseFloat(seconds));
      },
      U: (_, unixSeconds) => new Date(parseFloat(unixSeconds) * 1000),
      W: function (dateObj, weekNum) {
          const weekNumber = parseInt(weekNum);
          return new Date(dateObj.getFullYear(), 0, 2 + (weekNumber - 1) * 7, 0, 0, 0, 0);
      },
      Y: (dateObj, year) => {
          dateObj.setFullYear(parseFloat(year));
      },
      Z: (_, ISODate) => new Date(ISODate),
      d: (dateObj, day) => {
          dateObj.setDate(parseFloat(day));
      },
      h: (dateObj, hour) => {
          dateObj.setHours(parseFloat(hour));
      },
      i: (dateObj, minutes) => {
          dateObj.setMinutes(parseFloat(minutes));
      },
      j: (dateObj, day) => {
          dateObj.setDate(parseFloat(day));
      },
      l: do_nothing,
      m: (dateObj, month) => {
          dateObj.setMonth(parseFloat(month) - 1);
      },
      n: (dateObj, month) => {
          dateObj.setMonth(parseFloat(month) - 1);
      },
      s: (dateObj, seconds) => {
          dateObj.setSeconds(parseFloat(seconds));
      },
      u: (_, unixMillSeconds) => new Date(parseFloat(unixMillSeconds)),
      w: do_nothing,
      y: (dateObj, year) => {
          dateObj.setFullYear(2000 + parseFloat(year));
      },
  };
  const tokenRegex = {
      D: "(\\w+)",
      F: "(\\w+)",
      G: "(\\d\\d|\\d)",
      H: "(\\d\\d|\\d)",
      J: "(\\d\\d|\\d)\\w+",
      K: "",
      M: "(\\w+)",
      S: "(\\d\\d|\\d)",
      U: "(.+)",
      W: "(\\d\\d|\\d)",
      Y: "(\\d{4})",
      Z: "(.+)",
      d: "(\\d\\d|\\d)",
      h: "(\\d\\d|\\d)",
      i: "(\\d\\d|\\d)",
      j: "(\\d\\d|\\d)",
      l: "(\\w+)",
      m: "(\\d\\d|\\d)",
      n: "(\\d\\d|\\d)",
      s: "(\\d\\d|\\d)",
      u: "(.+)",
      w: "(\\d\\d|\\d)",
      y: "(\\d{2})",
  };
  const formats = {
      Z: (date) => date.toISOString(),
      D: function (date, locale, options) {
          return locale.weekdays.shorthand[formats.w(date, locale, options)];
      },
      F: function (date, locale, options) {
          return monthToStr(formats.n(date, locale, options) - 1, false, locale);
      },
      G: function (date, locale, options) {
          return pad(formats.h(date, locale, options));
      },
      H: (date) => pad(date.getHours()),
      J: function (date, locale) {
          return locale.ordinal !== undefined
              ? date.getDate() + locale.ordinal(date.getDate())
              : date.getDate();
      },
      K: (date, locale) => locale.amPM[int(date.getHours() > 11)],
      M: function (date, locale) {
          return monthToStr(date.getMonth(), true, locale);
      },
      S: (date) => pad(date.getSeconds()),
      U: (date) => date.getTime() / 1000,
      W: function (date, _, options) {
          return options.getWeek(date);
      },
      Y: (date) => date.getFullYear(),
      d: (date) => pad(date.getDate()),
      h: (date) => (date.getHours() % 12 ? date.getHours() % 12 : 12),
      i: (date) => pad(date.getMinutes()),
      j: (date) => date.getDate(),
      l: function (date, locale) {
          return locale.weekdays.longhand[date.getDay()];
      },
      m: (date) => pad(date.getMonth() + 1),
      n: (date) => date.getMonth() + 1,
      s: (date) => date.getSeconds(),
      u: (date) => date.getTime(),
      w: (date) => date.getDay(),
      y: (date) => String(date.getFullYear()).substring(2),
  };

  const english = {
      weekdays: {
          shorthand: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          longhand: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
          ],
      },
      months: {
          shorthand: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
          ],
          longhand: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
          ],
      },
      daysInMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      firstDayOfWeek: 0,
      ordinal: (nth) => {
          const s = nth % 100;
          if (s > 3 && s < 21)
              return "th";
          switch (s % 10) {
              case 1:
                  return "st";
              case 2:
                  return "nd";
              case 3:
                  return "rd";
              default:
                  return "th";
          }
      },
      rangeSeparator: " to ",
      weekAbbreviation: "Wk",
      scrollTitle: "Scroll to increment",
      toggleTitle: "Click to toggle",
      amPM: ["AM", "PM"],
      yearAriaLabel: "Year",
  };

  const createDateFormatter = ({ config = defaults, l10n = english, }) => (dateObj, frmt, overrideLocale) => {
      const locale = overrideLocale || l10n;
      if (config.formatDate !== undefined) {
          return config.formatDate(dateObj, frmt, locale);
      }
      return frmt
          .split("")
          .map((c, i, arr) => formats[c] && arr[i - 1] !== "\\"
          ? formats[c](dateObj, locale, config)
          : c !== "\\"
              ? c
              : "")
          .join("");
  };
  const createDateParser = ({ config = defaults, l10n = english }) => (date, givenFormat, timeless, customLocale) => {
      if (date !== 0 && !date)
          return undefined;
      const locale = customLocale || l10n;
      let parsedDate;
      const date_orig = date;
      if (date instanceof Date)
          parsedDate = new Date(date.getTime());
      else if (typeof date !== "string" &&
          date.toFixed !== undefined)
          parsedDate = new Date(date);
      else if (typeof date === "string") {
          const format = givenFormat || (config || defaults).dateFormat;
          const datestr = String(date).trim();
          if (datestr === "today") {
              parsedDate = new Date();
              timeless = true;
          }
          else if (/Z$/.test(datestr) ||
              /GMT$/.test(datestr))
              parsedDate = new Date(date);
          else if (config && config.parseDate)
              parsedDate = config.parseDate(date, format);
          else {
              parsedDate =
                  !config || !config.noCalendar
                      ? new Date(new Date().getFullYear(), 0, 1, 0, 0, 0, 0)
                      : new Date(new Date().setHours(0, 0, 0, 0));
              let matched, ops = [];
              for (let i = 0, matchIndex = 0, regexStr = ""; i < format.length; i++) {
                  const token = format[i];
                  const isBackSlash = token === "\\";
                  const escaped = format[i - 1] === "\\" || isBackSlash;
                  if (tokenRegex[token] && !escaped) {
                      regexStr += tokenRegex[token];
                      const match = new RegExp(regexStr).exec(date);
                      if (match && (matched = true)) {
                          ops[token !== "Y" ? "push" : "unshift"]({
                              fn: revFormat[token],
                              val: match[++matchIndex],
                          });
                      }
                  }
                  else if (!isBackSlash)
                      regexStr += ".";
                  ops.forEach(({ fn, val }) => (parsedDate = fn(parsedDate, val, locale) || parsedDate));
              }
              parsedDate = matched ? parsedDate : undefined;
          }
      }
      if (!(parsedDate instanceof Date && !isNaN(parsedDate.getTime()))) {
          config.errorHandler(new Error(`Invalid date provided: ${date_orig}`));
          return undefined;
      }
      if (timeless === true)
          parsedDate.setHours(0, 0, 0, 0);
      return parsedDate;
  };
  function compareDates(date1, date2, timeless = true) {
      if (timeless !== false) {
          return (new Date(date1.getTime()).setHours(0, 0, 0, 0) -
              new Date(date2.getTime()).setHours(0, 0, 0, 0));
      }
      return date1.getTime() - date2.getTime();
  }
  const getWeek = (givenDate) => {
      const date = new Date(givenDate.getTime());
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7));
      var week1 = new Date(date.getFullYear(), 0, 4);
      return (1 +
          Math.round(((date.getTime() - week1.getTime()) / 86400000 -
              3 +
              ((week1.getDay() + 6) % 7)) /
              7));
  };
  const isBetween = (ts, ts1, ts2) => {
      return ts > Math.min(ts1, ts2) && ts < Math.max(ts1, ts2);
  };
  const duration = {
      DAY: 86400000,
  };

  const HOOKS = [
      "onChange",
      "onClose",
      "onDayCreate",
      "onDestroy",
      "onKeyDown",
      "onMonthChange",
      "onOpen",
      "onParseConfig",
      "onReady",
      "onValueUpdate",
      "onYearChange",
      "onPreCalendarPosition",
  ];
  const defaults = {
      _disable: [],
      _enable: [],
      allowInput: false,
      altFormat: "F j, Y",
      altInput: false,
      altInputClass: "form-control input",
      animate: typeof window === "object" &&
          window.navigator.userAgent.indexOf("MSIE") === -1,
      ariaDateFormat: "F j, Y",
      clickOpens: true,
      closeOnSelect: true,
      conjunction: ", ",
      dateFormat: "Y-m-d",
      defaultHour: 12,
      defaultMinute: 0,
      defaultSeconds: 0,
      disable: [],
      disableMobile: false,
      enable: [],
      enableSeconds: false,
      enableTime: false,
      errorHandler: (err) => typeof console !== "undefined" && console.warn(err),
      getWeek,
      hourIncrement: 1,
      ignoredFocusElements: [],
      inline: false,
      locale: "default",
      minuteIncrement: 5,
      mode: "single",
      nextArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M13.207 8.472l-7.854 7.854-0.707-0.707 7.146-7.146-7.146-7.148 0.707-0.707 7.854 7.854z' /></svg>",
      noCalendar: false,
      now: new Date(),
      onChange: [],
      onClose: [],
      onDayCreate: [],
      onDestroy: [],
      onKeyDown: [],
      onMonthChange: [],
      onOpen: [],
      onParseConfig: [],
      onReady: [],
      onValueUpdate: [],
      onYearChange: [],
      onPreCalendarPosition: [],
      plugins: [],
      position: "auto",
      positionElement: undefined,
      prevArrow: "<svg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 17 17'><g></g><path d='M5.207 8.471l7.146 7.147-0.707 0.707-7.853-7.854 7.854-7.853 0.707 0.707-7.147 7.146z' /></svg>",
      shorthandCurrentMonth: false,
      showMonths: 1,
      static: false,
      time_24hr: false,
      weekNumbers: false,
      wrap: false,
  };

  function toggleClass(elem, className, bool) {
      if (bool === true)
          return elem.classList.add(className);
      elem.classList.remove(className);
  }
  function createElement(tag, className, content) {
      const e = window.document.createElement(tag);
      className = className || "";
      content = content || "";
      e.className = className;
      if (content !== undefined)
          e.textContent = content;
      return e;
  }
  function clearNode(node) {
      while (node.firstChild)
          node.removeChild(node.firstChild);
  }
  function findParent(node, condition) {
      if (condition(node))
          return node;
      else if (node.parentNode)
          return findParent(node.parentNode, condition);
      return undefined;
  }
  function createNumberInput(inputClassName, opts) {
      const wrapper = createElement("div", "numInputWrapper"), numInput = createElement("input", "numInput " + inputClassName), arrowUp = createElement("span", "arrowUp"), arrowDown = createElement("span", "arrowDown");
      numInput.type = "text";
      numInput.pattern = "\\d*";
      if (opts !== undefined)
          for (const key in opts)
              numInput.setAttribute(key, opts[key]);
      wrapper.appendChild(numInput);
      wrapper.appendChild(arrowUp);
      wrapper.appendChild(arrowDown);
      return wrapper;
  }
  function getEventTarget(event) {
      if (typeof event.composedPath === "function") {
          const path = event.composedPath();
          return path[0];
      }
      return event.target;
  }

  if (typeof Object.assign !== "function") {
      Object.assign = function (target, ...args) {
          if (!target) {
              throw TypeError("Cannot convert undefined or null to object");
          }
          for (const source of args) {
              if (source) {
                  Object.keys(source).forEach(key => (target[key] = source[key]));
              }
          }
          return target;
      };
  }

  const DEBOUNCED_CHANGE_MS = 300;
  function FlatpickrInstance(element, instanceConfig) {
      const self = {
          config: Object.assign({}, flatpickr.defaultConfig),
          l10n: english,
      };
      self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
      self._handlers = [];
      self._bind = bind;
      self._setHoursFromDate = setHoursFromDate;
      self._positionCalendar = positionCalendar;
      self.changeMonth = changeMonth;
      self.changeYear = changeYear;
      self.clear = clear;
      self.close = close;
      self._createElement = createElement;
      self.destroy = destroy;
      self.isEnabled = isEnabled;
      self.jumpToDate = jumpToDate;
      self.open = open;
      self.redraw = redraw;
      self.set = set;
      self.setDate = setDate;
      self.toggle = toggle;
      function setupHelperFunctions() {
          self.utils = {
              getDaysInMonth(month = self.currentMonth, yr = self.currentYear) {
                  if (month === 1 && ((yr % 4 === 0 && yr % 100 !== 0) || yr % 400 === 0))
                      return 29;
                  return self.l10n.daysInMonth[month];
              },
          };
      }
      function init() {
          self.element = self.input = element;
          self.isOpen = false;
          parseConfig();
          setupLocale();
          setupInputs();
          setupDates();
          setupHelperFunctions();
          if (!self.isMobile)
              build();
          bindEvents();
          if (self.selectedDates.length || self.config.noCalendar) {
              if (self.config.enableTime) {
                  setHoursFromDate(self.config.noCalendar
                      ? self.latestSelectedDateObj || self.config.minDate
                      : undefined);
              }
              updateValue(false);
          }
          setCalendarWidth();
          self.showTimeInput =
              self.selectedDates.length > 0 || self.config.noCalendar;
          const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
          if (!self.isMobile && isSafari) {
              positionCalendar();
          }
          triggerEvent("onReady");
      }
      function bindToInstance(fn) {
          return fn.bind(self);
      }
      function setCalendarWidth() {
          const config = self.config;
          if (config.weekNumbers === false && config.showMonths === 1)
              return;
          else if (config.noCalendar !== true) {
              window.requestAnimationFrame(function () {
                  if (self.calendarContainer !== undefined) {
                      self.calendarContainer.style.visibility = "hidden";
                      self.calendarContainer.style.display = "block";
                  }
                  if (self.daysContainer !== undefined) {
                      const daysWidth = (self.days.offsetWidth + 1) * config.showMonths;
                      self.daysContainer.style.width = daysWidth + "px";
                      self.calendarContainer.style.width =
                          daysWidth +
                              (self.weekWrapper !== undefined
                                  ? self.weekWrapper.offsetWidth
                                  : 0) +
                              "px";
                      self.calendarContainer.style.removeProperty("visibility");
                      self.calendarContainer.style.removeProperty("display");
                  }
              });
          }
      }
      function updateTime(e) {
          if (self.selectedDates.length === 0)
              return;
          if (e !== undefined && e.type !== "blur") {
              timeWrapper(e);
          }
          const prevValue = self._input.value;
          setHoursFromInputs();
          updateValue();
          if (self._input.value !== prevValue) {
              self._debouncedChange();
          }
      }
      function ampm2military(hour, amPM) {
          return (hour % 12) + 12 * int(amPM === self.l10n.amPM[1]);
      }
      function military2ampm(hour) {
          switch (hour % 24) {
              case 0:
              case 12:
                  return 12;
              default:
                  return hour % 12;
          }
      }
      function setHoursFromInputs() {
          if (self.hourElement === undefined || self.minuteElement === undefined)
              return;
          let hours = (parseInt(self.hourElement.value.slice(-2), 10) || 0) % 24, minutes = (parseInt(self.minuteElement.value, 10) || 0) % 60, seconds = self.secondElement !== undefined
              ? (parseInt(self.secondElement.value, 10) || 0) % 60
              : 0;
          if (self.amPM !== undefined) {
              hours = ampm2military(hours, self.amPM.textContent);
          }
          const limitMinHours = self.config.minTime !== undefined ||
              (self.config.minDate &&
                  self.minDateHasTime &&
                  self.latestSelectedDateObj &&
                  compareDates(self.latestSelectedDateObj, self.config.minDate, true) ===
                      0);
          const limitMaxHours = self.config.maxTime !== undefined ||
              (self.config.maxDate &&
                  self.maxDateHasTime &&
                  self.latestSelectedDateObj &&
                  compareDates(self.latestSelectedDateObj, self.config.maxDate, true) ===
                      0);
          if (limitMaxHours) {
              const maxTime = self.config.maxTime !== undefined
                  ? self.config.maxTime
                  : self.config.maxDate;
              hours = Math.min(hours, maxTime.getHours());
              if (hours === maxTime.getHours())
                  minutes = Math.min(minutes, maxTime.getMinutes());
              if (minutes === maxTime.getMinutes())
                  seconds = Math.min(seconds, maxTime.getSeconds());
          }
          if (limitMinHours) {
              const minTime = self.config.minTime !== undefined
                  ? self.config.minTime
                  : self.config.minDate;
              hours = Math.max(hours, minTime.getHours());
              if (hours === minTime.getHours())
                  minutes = Math.max(minutes, minTime.getMinutes());
              if (minutes === minTime.getMinutes())
                  seconds = Math.max(seconds, minTime.getSeconds());
          }
          setHours(hours, minutes, seconds);
      }
      function setHoursFromDate(dateObj) {
          const date = dateObj || self.latestSelectedDateObj;
          if (date)
              setHours(date.getHours(), date.getMinutes(), date.getSeconds());
      }
      function setDefaultHours() {
          let hours = self.config.defaultHour;
          let minutes = self.config.defaultMinute;
          let seconds = self.config.defaultSeconds;
          if (self.config.minDate !== undefined) {
              const min_hr = self.config.minDate.getHours();
              const min_minutes = self.config.minDate.getMinutes();
              hours = Math.max(hours, min_hr);
              if (hours === min_hr)
                  minutes = Math.max(min_minutes, minutes);
              if (hours === min_hr && minutes === min_minutes)
                  seconds = self.config.minDate.getSeconds();
          }
          if (self.config.maxDate !== undefined) {
              const max_hr = self.config.maxDate.getHours();
              const max_minutes = self.config.maxDate.getMinutes();
              hours = Math.min(hours, max_hr);
              if (hours === max_hr)
                  minutes = Math.min(max_minutes, minutes);
              if (hours === max_hr && minutes === max_minutes)
                  seconds = self.config.maxDate.getSeconds();
          }
          setHours(hours, minutes, seconds);
      }
      function setHours(hours, minutes, seconds) {
          if (self.latestSelectedDateObj !== undefined) {
              self.latestSelectedDateObj.setHours(hours % 24, minutes, seconds || 0, 0);
          }
          if (!self.hourElement || !self.minuteElement || self.isMobile)
              return;
          self.hourElement.value = pad(!self.config.time_24hr
              ? ((12 + hours) % 12) + 12 * int(hours % 12 === 0)
              : hours);
          self.minuteElement.value = pad(minutes);
          if (self.amPM !== undefined)
              self.amPM.textContent = self.l10n.amPM[int(hours >= 12)];
          if (self.secondElement !== undefined)
              self.secondElement.value = pad(seconds);
      }
      function onYearInput(event) {
          const year = parseInt(event.target.value) + (event.delta || 0);
          if (year / 1000 > 1 ||
              (event.key === "Enter" && !/[^\d]/.test(year.toString()))) {
              changeYear(year);
          }
      }
      function bind(element, event, handler, options) {
          if (event instanceof Array)
              return event.forEach(ev => bind(element, ev, handler, options));
          if (element instanceof Array)
              return element.forEach(el => bind(el, event, handler, options));
          element.addEventListener(event, handler, options);
          self._handlers.push({
              element: element,
              event,
              handler,
              options,
          });
      }
      function onClick(handler) {
          return evt => {
              evt.which === 1 && handler(evt);
          };
      }
      function triggerChange() {
          triggerEvent("onChange");
      }
      function bindEvents() {
          if (self.config.wrap) {
              ["open", "close", "toggle", "clear"].forEach(evt => {
                  Array.prototype.forEach.call(self.element.querySelectorAll(`[data-${evt}]`), (el) => bind(el, "click", self[evt]));
              });
          }
          if (self.isMobile) {
              setupMobile();
              return;
          }
          const debouncedResize = debounce(onResize, 50);
          self._debouncedChange = debounce(triggerChange, DEBOUNCED_CHANGE_MS);
          if (self.daysContainer && !/iPhone|iPad|iPod/i.test(navigator.userAgent))
              bind(self.daysContainer, "mouseover", (e) => {
                  if (self.config.mode === "range")
                      onMouseOver(e.target);
              });
          bind(window.document.body, "keydown", onKeyDown);
          if (!self.config.static)
              bind(self._input, "keydown", onKeyDown);
          if (!self.config.inline && !self.config.static)
              bind(window, "resize", debouncedResize);
          if (window.ontouchstart !== undefined)
              bind(window.document, "click", documentClick);
          else
              bind(window.document, "mousedown", onClick(documentClick));
          bind(window.document, "focus", documentClick, { capture: true });
          if (self.config.clickOpens === true) {
              bind(self._input, "focus", self.open);
              bind(self._input, "mousedown", onClick(self.open));
          }
          if (self.daysContainer !== undefined) {
              bind(self.monthNav, "mousedown", onClick(onMonthNavClick));
              bind(self.monthNav, ["keyup", "increment"], onYearInput);
              bind(self.daysContainer, "mousedown", onClick(selectDate));
          }
          if (self.timeContainer !== undefined &&
              self.minuteElement !== undefined &&
              self.hourElement !== undefined) {
              const selText = (e) => e.target.select();
              bind(self.timeContainer, ["increment"], updateTime);
              bind(self.timeContainer, "blur", updateTime, { capture: true });
              bind(self.timeContainer, "mousedown", onClick(timeIncrement));
              bind([self.hourElement, self.minuteElement], ["focus", "click"], selText);
              if (self.secondElement !== undefined)
                  bind(self.secondElement, "focus", () => self.secondElement && self.secondElement.select());
              if (self.amPM !== undefined) {
                  bind(self.amPM, "mousedown", onClick(e => {
                      updateTime(e);
                      triggerChange();
                  }));
              }
          }
      }
      function jumpToDate(jumpDate) {
          const jumpTo = jumpDate !== undefined
              ? self.parseDate(jumpDate)
              : self.latestSelectedDateObj ||
                  (self.config.minDate && self.config.minDate > self.now
                      ? self.config.minDate
                      : self.config.maxDate && self.config.maxDate < self.now
                          ? self.config.maxDate
                          : self.now);
          try {
              if (jumpTo !== undefined) {
                  self.currentYear = jumpTo.getFullYear();
                  self.currentMonth = jumpTo.getMonth();
              }
          }
          catch (e) {
              e.message = "Invalid date supplied: " + jumpTo;
              self.config.errorHandler(e);
          }
          self.redraw();
      }
      function timeIncrement(e) {
          if (~e.target.className.indexOf("arrow"))
              incrementNumInput(e, e.target.classList.contains("arrowUp") ? 1 : -1);
      }
      function incrementNumInput(e, delta, inputElem) {
          const target = e && e.target;
          const input = inputElem ||
              (target && target.parentNode && target.parentNode.firstChild);
          const event = createEvent("increment");
          event.delta = delta;
          input && input.dispatchEvent(event);
      }
      function build() {
          const fragment = window.document.createDocumentFragment();
          self.calendarContainer = createElement("div", "flatpickr-calendar");
          self.calendarContainer.tabIndex = -1;
          if (!self.config.noCalendar) {
              fragment.appendChild(buildMonthNav());
              self.innerContainer = createElement("div", "flatpickr-innerContainer");
              if (self.config.weekNumbers) {
                  const { weekWrapper, weekNumbers } = buildWeeks();
                  self.innerContainer.appendChild(weekWrapper);
                  self.weekNumbers = weekNumbers;
                  self.weekWrapper = weekWrapper;
              }
              self.rContainer = createElement("div", "flatpickr-rContainer");
              self.rContainer.appendChild(buildWeekdays());
              if (!self.daysContainer) {
                  self.daysContainer = createElement("div", "flatpickr-days");
                  self.daysContainer.tabIndex = -1;
              }
              buildDays();
              self.rContainer.appendChild(self.daysContainer);
              self.innerContainer.appendChild(self.rContainer);
              fragment.appendChild(self.innerContainer);
          }
          if (self.config.enableTime) {
              fragment.appendChild(buildTime());
          }
          toggleClass(self.calendarContainer, "rangeMode", self.config.mode === "range");
          toggleClass(self.calendarContainer, "animate", self.config.animate === true);
          toggleClass(self.calendarContainer, "multiMonth", self.config.showMonths > 1);
          self.calendarContainer.appendChild(fragment);
          const customAppend = self.config.appendTo !== undefined &&
              self.config.appendTo.nodeType !== undefined;
          if (self.config.inline || self.config.static) {
              self.calendarContainer.classList.add(self.config.inline ? "inline" : "static");
              if (self.config.inline) {
                  if (!customAppend && self.element.parentNode)
                      self.element.parentNode.insertBefore(self.calendarContainer, self._input.nextSibling);
                  else if (self.config.appendTo !== undefined)
                      self.config.appendTo.appendChild(self.calendarContainer);
              }
              if (self.config.static) {
                  const wrapper = createElement("div", "flatpickr-wrapper");
                  if (self.element.parentNode)
                      self.element.parentNode.insertBefore(wrapper, self.element);
                  wrapper.appendChild(self.element);
                  if (self.altInput)
                      wrapper.appendChild(self.altInput);
                  wrapper.appendChild(self.calendarContainer);
              }
          }
          if (!self.config.static && !self.config.inline)
              (self.config.appendTo !== undefined
                  ? self.config.appendTo
                  : window.document.body).appendChild(self.calendarContainer);
      }
      function createDay(className, date, dayNumber, i) {
          const dateIsEnabled = isEnabled(date, true), dayElement = createElement("span", "flatpickr-day " + className, date.getDate().toString());
          dayElement.dateObj = date;
          dayElement.$i = i;
          dayElement.setAttribute("aria-label", self.formatDate(date, self.config.ariaDateFormat));
          if (className.indexOf("hidden") === -1 &&
              compareDates(date, self.now) === 0) {
              self.todayDateElem = dayElement;
              dayElement.classList.add("today");
              dayElement.setAttribute("aria-current", "date");
          }
          if (dateIsEnabled) {
              dayElement.tabIndex = -1;
              if (isDateSelected(date)) {
                  dayElement.classList.add("selected");
                  self.selectedDateElem = dayElement;
                  if (self.config.mode === "range") {
                      toggleClass(dayElement, "startRange", self.selectedDates[0] &&
                          compareDates(date, self.selectedDates[0], true) === 0);
                      toggleClass(dayElement, "endRange", self.selectedDates[1] &&
                          compareDates(date, self.selectedDates[1], true) === 0);
                      if (className === "nextMonthDay")
                          dayElement.classList.add("inRange");
                  }
              }
          }
          else {
              dayElement.classList.add("disabled");
          }
          if (self.config.mode === "range") {
              if (isDateInRange(date) && !isDateSelected(date))
                  dayElement.classList.add("inRange");
          }
          if (self.weekNumbers &&
              self.config.showMonths === 1 &&
              className !== "prevMonthDay" &&
              dayNumber % 7 === 1) {
              self.weekNumbers.insertAdjacentHTML("beforeend", "<span class='flatpickr-day'>" + self.config.getWeek(date) + "</span>");
          }
          triggerEvent("onDayCreate", dayElement);
          return dayElement;
      }
      function focusOnDayElem(targetNode) {
          targetNode.focus();
          if (self.config.mode === "range")
              onMouseOver(targetNode);
      }
      function getFirstAvailableDay(delta) {
          const startMonth = delta > 0 ? 0 : self.config.showMonths - 1;
          const endMonth = delta > 0 ? self.config.showMonths : -1;
          for (let m = startMonth; m != endMonth; m += delta) {
              const month = self.daysContainer.children[m];
              const startIndex = delta > 0 ? 0 : month.children.length - 1;
              const endIndex = delta > 0 ? month.children.length : -1;
              for (let i = startIndex; i != endIndex; i += delta) {
                  const c = month.children[i];
                  if (c.className.indexOf("hidden") === -1 && isEnabled(c.dateObj))
                      return c;
              }
          }
          return undefined;
      }
      function getNextAvailableDay(current, delta) {
          const givenMonth = current.className.indexOf("Month") === -1
              ? current.dateObj.getMonth()
              : self.currentMonth;
          const endMonth = delta > 0 ? self.config.showMonths : -1;
          const loopDelta = delta > 0 ? 1 : -1;
          for (let m = givenMonth - self.currentMonth; m != endMonth; m += loopDelta) {
              const month = self.daysContainer.children[m];
              const startIndex = givenMonth - self.currentMonth === m
                  ? current.$i + delta
                  : delta < 0
                      ? month.children.length - 1
                      : 0;
              const numMonthDays = month.children.length;
              for (let i = startIndex; i >= 0 && i < numMonthDays && i != (delta > 0 ? numMonthDays : -1); i += loopDelta) {
                  const c = month.children[i];
                  if (c.className.indexOf("hidden") === -1 &&
                      isEnabled(c.dateObj) &&
                      Math.abs(current.$i - i) >= Math.abs(delta))
                      return focusOnDayElem(c);
              }
          }
          self.changeMonth(loopDelta);
          focusOnDay(getFirstAvailableDay(loopDelta), 0);
          return undefined;
      }
      function focusOnDay(current, offset) {
          const dayFocused = isInView(document.activeElement || document.body);
          const startElem = current !== undefined
              ? current
              : dayFocused
                  ? document.activeElement
                  : self.selectedDateElem !== undefined && isInView(self.selectedDateElem)
                      ? self.selectedDateElem
                      : self.todayDateElem !== undefined && isInView(self.todayDateElem)
                          ? self.todayDateElem
                          : getFirstAvailableDay(offset > 0 ? 1 : -1);
          if (startElem === undefined)
              return self._input.focus();
          if (!dayFocused)
              return focusOnDayElem(startElem);
          getNextAvailableDay(startElem, offset);
      }
      function buildMonthDays(year, month) {
          const firstOfMonth = (new Date(year, month, 1).getDay() - self.l10n.firstDayOfWeek + 7) % 7;
          const prevMonthDays = self.utils.getDaysInMonth((month - 1 + 12) % 12);
          const daysInMonth = self.utils.getDaysInMonth(month), days = window.document.createDocumentFragment(), isMultiMonth = self.config.showMonths > 1, prevMonthDayClass = isMultiMonth ? "prevMonthDay hidden" : "prevMonthDay", nextMonthDayClass = isMultiMonth ? "nextMonthDay hidden" : "nextMonthDay";
          let dayNumber = prevMonthDays + 1 - firstOfMonth, dayIndex = 0;
          for (; dayNumber <= prevMonthDays; dayNumber++, dayIndex++) {
              days.appendChild(createDay(prevMonthDayClass, new Date(year, month - 1, dayNumber), dayNumber, dayIndex));
          }
          for (dayNumber = 1; dayNumber <= daysInMonth; dayNumber++, dayIndex++) {
              days.appendChild(createDay("", new Date(year, month, dayNumber), dayNumber, dayIndex));
          }
          for (let dayNum = daysInMonth + 1; dayNum <= 42 - firstOfMonth &&
              (self.config.showMonths === 1 || dayIndex % 7 !== 0); dayNum++, dayIndex++) {
              days.appendChild(createDay(nextMonthDayClass, new Date(year, month + 1, dayNum % daysInMonth), dayNum, dayIndex));
          }
          const dayContainer = createElement("div", "dayContainer");
          dayContainer.appendChild(days);
          return dayContainer;
      }
      function buildDays() {
          if (self.daysContainer === undefined) {
              return;
          }
          clearNode(self.daysContainer);
          if (self.weekNumbers)
              clearNode(self.weekNumbers);
          const frag = document.createDocumentFragment();
          for (let i = 0; i < self.config.showMonths; i++) {
              const d = new Date(self.currentYear, self.currentMonth, 1);
              d.setMonth(self.currentMonth + i);
              frag.appendChild(buildMonthDays(d.getFullYear(), d.getMonth()));
          }
          self.daysContainer.appendChild(frag);
          self.days = self.daysContainer.firstChild;
          if (self.config.mode === "range" && self.selectedDates.length === 1) {
              onMouseOver();
          }
      }
      function buildMonth() {
          const container = createElement("div", "flatpickr-month");
          const monthNavFragment = window.document.createDocumentFragment();
          const monthElement = createElement("span", "cur-month");
          const yearInput = createNumberInput("cur-year", { tabindex: "-1" });
          const yearElement = yearInput.getElementsByTagName("input")[0];
          yearElement.setAttribute("aria-label", self.l10n.yearAriaLabel);
          if (self.config.minDate)
              yearElement.setAttribute("data-min", self.config.minDate.getFullYear().toString());
          if (self.config.maxDate) {
              yearElement.setAttribute("data-max", self.config.maxDate.getFullYear().toString());
              yearElement.disabled =
                  !!self.config.minDate &&
                      self.config.minDate.getFullYear() === self.config.maxDate.getFullYear();
          }
          const currentMonth = createElement("div", "flatpickr-current-month");
          currentMonth.appendChild(monthElement);
          currentMonth.appendChild(yearInput);
          monthNavFragment.appendChild(currentMonth);
          container.appendChild(monthNavFragment);
          return {
              container,
              yearElement,
              monthElement,
          };
      }
      function buildMonths() {
          clearNode(self.monthNav);
          self.monthNav.appendChild(self.prevMonthNav);
          if (self.config.showMonths) {
              self.yearElements = [];
              self.monthElements = [];
          }
          for (let m = self.config.showMonths; m--;) {
              const month = buildMonth();
              self.yearElements.push(month.yearElement);
              self.monthElements.push(month.monthElement);
              self.monthNav.appendChild(month.container);
          }
          self.monthNav.appendChild(self.nextMonthNav);
      }
      function buildMonthNav() {
          self.monthNav = createElement("div", "flatpickr-months");
          self.yearElements = [];
          self.monthElements = [];
          self.prevMonthNav = createElement("span", "flatpickr-prev-month");
          self.prevMonthNav.innerHTML = self.config.prevArrow;
          self.nextMonthNav = createElement("span", "flatpickr-next-month");
          self.nextMonthNav.innerHTML = self.config.nextArrow;
          buildMonths();
          Object.defineProperty(self, "_hidePrevMonthArrow", {
              get: () => self.__hidePrevMonthArrow,
              set(bool) {
                  if (self.__hidePrevMonthArrow !== bool) {
                      toggleClass(self.prevMonthNav, "disabled", bool);
                      self.__hidePrevMonthArrow = bool;
                  }
              },
          });
          Object.defineProperty(self, "_hideNextMonthArrow", {
              get: () => self.__hideNextMonthArrow,
              set(bool) {
                  if (self.__hideNextMonthArrow !== bool) {
                      toggleClass(self.nextMonthNav, "disabled", bool);
                      self.__hideNextMonthArrow = bool;
                  }
              },
          });
          self.currentYearElement = self.yearElements[0];
          updateNavigationCurrentMonth();
          return self.monthNav;
      }
      function buildTime() {
          self.calendarContainer.classList.add("hasTime");
          if (self.config.noCalendar)
              self.calendarContainer.classList.add("noCalendar");
          self.timeContainer = createElement("div", "flatpickr-time");
          self.timeContainer.tabIndex = -1;
          const separator = createElement("span", "flatpickr-time-separator", ":");
          const hourInput = createNumberInput("flatpickr-hour");
          self.hourElement = hourInput.getElementsByTagName("input")[0];
          const minuteInput = createNumberInput("flatpickr-minute");
          self.minuteElement = minuteInput.getElementsByTagName("input")[0];
          self.hourElement.tabIndex = self.minuteElement.tabIndex = -1;
          self.hourElement.value = pad(self.latestSelectedDateObj
              ? self.latestSelectedDateObj.getHours()
              : self.config.time_24hr
                  ? self.config.defaultHour
                  : military2ampm(self.config.defaultHour));
          self.minuteElement.value = pad(self.latestSelectedDateObj
              ? self.latestSelectedDateObj.getMinutes()
              : self.config.defaultMinute);
          self.hourElement.setAttribute("data-step", self.config.hourIncrement.toString());
          self.minuteElement.setAttribute("data-step", self.config.minuteIncrement.toString());
          self.hourElement.setAttribute("data-min", self.config.time_24hr ? "0" : "1");
          self.hourElement.setAttribute("data-max", self.config.time_24hr ? "23" : "12");
          self.minuteElement.setAttribute("data-min", "0");
          self.minuteElement.setAttribute("data-max", "59");
          self.timeContainer.appendChild(hourInput);
          self.timeContainer.appendChild(separator);
          self.timeContainer.appendChild(minuteInput);
          if (self.config.time_24hr)
              self.timeContainer.classList.add("time24hr");
          if (self.config.enableSeconds) {
              self.timeContainer.classList.add("hasSeconds");
              const secondInput = createNumberInput("flatpickr-second");
              self.secondElement = secondInput.getElementsByTagName("input")[0];
              self.secondElement.value = pad(self.latestSelectedDateObj
                  ? self.latestSelectedDateObj.getSeconds()
                  : self.config.defaultSeconds);
              self.secondElement.setAttribute("data-step", self.minuteElement.getAttribute("data-step"));
              self.secondElement.setAttribute("data-min", self.minuteElement.getAttribute("data-min"));
              self.secondElement.setAttribute("data-max", self.minuteElement.getAttribute("data-max"));
              self.timeContainer.appendChild(createElement("span", "flatpickr-time-separator", ":"));
              self.timeContainer.appendChild(secondInput);
          }
          if (!self.config.time_24hr) {
              self.amPM = createElement("span", "flatpickr-am-pm", self.l10n.amPM[int((self.latestSelectedDateObj
                  ? self.hourElement.value
                  : self.config.defaultHour) > 11)]);
              self.amPM.title = self.l10n.toggleTitle;
              self.amPM.tabIndex = -1;
              self.timeContainer.appendChild(self.amPM);
          }
          return self.timeContainer;
      }
      function buildWeekdays() {
          if (!self.weekdayContainer)
              self.weekdayContainer = createElement("div", "flatpickr-weekdays");
          else
              clearNode(self.weekdayContainer);
          for (let i = self.config.showMonths; i--;) {
              const container = createElement("div", "flatpickr-weekdaycontainer");
              self.weekdayContainer.appendChild(container);
          }
          updateWeekdays();
          return self.weekdayContainer;
      }
      function updateWeekdays() {
          const firstDayOfWeek = self.l10n.firstDayOfWeek;
          let weekdays = [...self.l10n.weekdays.shorthand];
          if (firstDayOfWeek > 0 && firstDayOfWeek < weekdays.length) {
              weekdays = [
                  ...weekdays.splice(firstDayOfWeek, weekdays.length),
                  ...weekdays.splice(0, firstDayOfWeek),
              ];
          }
          for (let i = self.config.showMonths; i--;) {
              self.weekdayContainer.children[i].innerHTML = `
      <span class=flatpickr-weekday>
        ${weekdays.join("</span><span class=flatpickr-weekday>")}
      </span>
      `;
          }
      }
      function buildWeeks() {
          self.calendarContainer.classList.add("hasWeeks");
          const weekWrapper = createElement("div", "flatpickr-weekwrapper");
          weekWrapper.appendChild(createElement("span", "flatpickr-weekday", self.l10n.weekAbbreviation));
          const weekNumbers = createElement("div", "flatpickr-weeks");
          weekWrapper.appendChild(weekNumbers);
          return {
              weekWrapper,
              weekNumbers,
          };
      }
      function changeMonth(value, is_offset = true) {
          const delta = is_offset ? value : value - self.currentMonth;
          if ((delta < 0 && self._hidePrevMonthArrow === true) ||
              (delta > 0 && self._hideNextMonthArrow === true))
              return;
          self.currentMonth += delta;
          if (self.currentMonth < 0 || self.currentMonth > 11) {
              self.currentYear += self.currentMonth > 11 ? 1 : -1;
              self.currentMonth = (self.currentMonth + 12) % 12;
              triggerEvent("onYearChange");
          }
          buildDays();
          triggerEvent("onMonthChange");
          updateNavigationCurrentMonth();
      }
      function clear(triggerChangeEvent = true) {
          self.input.value = "";
          if (self.altInput !== undefined)
              self.altInput.value = "";
          if (self.mobileInput !== undefined)
              self.mobileInput.value = "";
          self.selectedDates = [];
          self.latestSelectedDateObj = undefined;
          self.showTimeInput = false;
          if (self.config.enableTime === true) {
              setDefaultHours();
          }
          self.redraw();
          if (triggerChangeEvent)
              triggerEvent("onChange");
      }
      function close() {
          self.isOpen = false;
          if (!self.isMobile) {
              self.calendarContainer.classList.remove("open");
              self._input.classList.remove("active");
          }
          triggerEvent("onClose");
      }
      function destroy() {
          if (self.config !== undefined)
              triggerEvent("onDestroy");
          for (let i = self._handlers.length; i--;) {
              const h = self._handlers[i];
              h.element.removeEventListener(h.event, h.handler, h.options);
          }
          self._handlers = [];
          if (self.mobileInput) {
              if (self.mobileInput.parentNode)
                  self.mobileInput.parentNode.removeChild(self.mobileInput);
              self.mobileInput = undefined;
          }
          else if (self.calendarContainer && self.calendarContainer.parentNode) {
              if (self.config.static && self.calendarContainer.parentNode) {
                  const wrapper = self.calendarContainer.parentNode;
                  wrapper.lastChild && wrapper.removeChild(wrapper.lastChild);
                  if (wrapper.parentNode) {
                      while (wrapper.firstChild)
                          wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
                      wrapper.parentNode.removeChild(wrapper);
                  }
              }
              else
                  self.calendarContainer.parentNode.removeChild(self.calendarContainer);
          }
          if (self.altInput) {
              self.input.type = "text";
              if (self.altInput.parentNode)
                  self.altInput.parentNode.removeChild(self.altInput);
              delete self.altInput;
          }
          if (self.input) {
              self.input.type = self.input._type;
              self.input.classList.remove("flatpickr-input");
              self.input.removeAttribute("readonly");
              self.input.value = "";
          }
          [
              "_showTimeInput",
              "latestSelectedDateObj",
              "_hideNextMonthArrow",
              "_hidePrevMonthArrow",
              "__hideNextMonthArrow",
              "__hidePrevMonthArrow",
              "isMobile",
              "isOpen",
              "selectedDateElem",
              "minDateHasTime",
              "maxDateHasTime",
              "days",
              "daysContainer",
              "_input",
              "_positionElement",
              "innerContainer",
              "rContainer",
              "monthNav",
              "todayDateElem",
              "calendarContainer",
              "weekdayContainer",
              "prevMonthNav",
              "nextMonthNav",
              "currentMonthElement",
              "currentYearElement",
              "navigationCurrentMonth",
              "selectedDateElem",
              "config",
          ].forEach(k => {
              try {
                  delete self[k];
              }
              catch (_) { }
          });
      }
      function isCalendarElem(elem) {
          if (self.config.appendTo && self.config.appendTo.contains(elem))
              return true;
          return self.calendarContainer.contains(elem);
      }
      function documentClick(e) {
          if (self.isOpen && !self.config.inline) {
              const eventTarget = getEventTarget(e);
              const isCalendarElement = isCalendarElem(eventTarget);
              const isInput = eventTarget === self.input ||
                  eventTarget === self.altInput ||
                  self.element.contains(eventTarget) ||
                  (e.path &&
                      e.path.indexOf &&
                      (~e.path.indexOf(self.input) ||
                          ~e.path.indexOf(self.altInput)));
              const lostFocus = e.type === "blur"
                  ? isInput &&
                      e.relatedTarget &&
                      !isCalendarElem(e.relatedTarget)
                  : !isInput &&
                      !isCalendarElement &&
                      !isCalendarElem(e.relatedTarget);
              const isIgnored = !self.config.ignoredFocusElements.some(elem => elem.contains(eventTarget));
              if (lostFocus && isIgnored) {
                  self.close();
                  if (self.config.mode === "range" && self.selectedDates.length === 1) {
                      self.clear(false);
                      self.redraw();
                  }
              }
          }
      }
      function changeYear(newYear) {
          if (!newYear ||
              (self.config.minDate && newYear < self.config.minDate.getFullYear()) ||
              (self.config.maxDate && newYear > self.config.maxDate.getFullYear()))
              return;
          const newYearNum = newYear, isNewYear = self.currentYear !== newYearNum;
          self.currentYear = newYearNum || self.currentYear;
          if (self.config.maxDate &&
              self.currentYear === self.config.maxDate.getFullYear()) {
              self.currentMonth = Math.min(self.config.maxDate.getMonth(), self.currentMonth);
          }
          else if (self.config.minDate &&
              self.currentYear === self.config.minDate.getFullYear()) {
              self.currentMonth = Math.max(self.config.minDate.getMonth(), self.currentMonth);
          }
          if (isNewYear) {
              self.redraw();
              triggerEvent("onYearChange");
          }
      }
      function isEnabled(date, timeless = true) {
          const dateToCheck = self.parseDate(date, undefined, timeless);
          if ((self.config.minDate &&
              dateToCheck &&
              compareDates(dateToCheck, self.config.minDate, timeless !== undefined ? timeless : !self.minDateHasTime) < 0) ||
              (self.config.maxDate &&
                  dateToCheck &&
                  compareDates(dateToCheck, self.config.maxDate, timeless !== undefined ? timeless : !self.maxDateHasTime) > 0))
              return false;
          if (self.config.enable.length === 0 && self.config.disable.length === 0)
              return true;
          if (dateToCheck === undefined)
              return false;
          const bool = self.config.enable.length > 0, array = bool ? self.config.enable : self.config.disable;
          for (let i = 0, d; i < array.length; i++) {
              d = array[i];
              if (typeof d === "function" &&
                  d(dateToCheck))
                  return bool;
              else if (d instanceof Date &&
                  dateToCheck !== undefined &&
                  d.getTime() === dateToCheck.getTime())
                  return bool;
              else if (typeof d === "string" && dateToCheck !== undefined) {
                  const parsed = self.parseDate(d, undefined, true);
                  return parsed && parsed.getTime() === dateToCheck.getTime()
                      ? bool
                      : !bool;
              }
              else if (typeof d === "object" &&
                  dateToCheck !== undefined &&
                  d.from &&
                  d.to &&
                  dateToCheck.getTime() >= d.from.getTime() &&
                  dateToCheck.getTime() <= d.to.getTime())
                  return bool;
          }
          return !bool;
      }
      function isInView(elem) {
          if (self.daysContainer !== undefined)
              return (elem.className.indexOf("hidden") === -1 &&
                  self.daysContainer.contains(elem));
          return false;
      }
      function onKeyDown(e) {
          const isInput = e.target === self._input;
          const allowInput = self.config.allowInput;
          const allowKeydown = self.isOpen && (!allowInput || !isInput);
          const allowInlineKeydown = self.config.inline && isInput && !allowInput;
          if (e.keyCode === 13 && isInput) {
              if (allowInput) {
                  self.setDate(self._input.value, true, e.target === self.altInput
                      ? self.config.altFormat
                      : self.config.dateFormat);
                  return e.target.blur();
              }
              else
                  self.open();
          }
          else if (isCalendarElem(e.target) ||
              allowKeydown ||
              allowInlineKeydown) {
              const isTimeObj = !!self.timeContainer &&
                  self.timeContainer.contains(e.target);
              switch (e.keyCode) {
                  case 13:
                      if (isTimeObj)
                          updateTime();
                      else
                          selectDate(e);
                      break;
                  case 27:
                      e.preventDefault();
                      focusAndClose();
                      break;
                  case 8:
                  case 46:
                      if (isInput && !self.config.allowInput) {
                          e.preventDefault();
                          self.clear();
                      }
                      break;
                  case 37:
                  case 39:
                      if (!isTimeObj) {
                          e.preventDefault();
                          if (self.daysContainer !== undefined &&
                              (allowInput === false ||
                                  (document.activeElement && isInView(document.activeElement)))) {
                              const delta = e.keyCode === 39 ? 1 : -1;
                              if (!e.ctrlKey)
                                  focusOnDay(undefined, delta);
                              else {
                                  e.stopPropagation();
                                  changeMonth(delta);
                                  focusOnDay(getFirstAvailableDay(1), 0);
                              }
                          }
                      }
                      else if (self.hourElement)
                          self.hourElement.focus();
                      break;
                  case 38:
                  case 40:
                      e.preventDefault();
                      const delta = e.keyCode === 40 ? 1 : -1;
                      if ((self.daysContainer && e.target.$i !== undefined) ||
                          e.target === self.input) {
                          if (e.ctrlKey) {
                              e.stopPropagation();
                              changeYear(self.currentYear - delta);
                              focusOnDay(getFirstAvailableDay(1), 0);
                          }
                          else if (!isTimeObj)
                              focusOnDay(undefined, delta * 7);
                      }
                      else if (self.config.enableTime) {
                          if (!isTimeObj && self.hourElement)
                              self.hourElement.focus();
                          updateTime(e);
                          self._debouncedChange();
                      }
                      break;
                  case 9:
                      if (!isTimeObj) {
                          self.element.focus();
                          break;
                      }
                      const elems = [
                          self.hourElement,
                          self.minuteElement,
                          self.secondElement,
                          self.amPM,
                      ].filter(x => x);
                      const i = elems.indexOf(e.target);
                      if (i !== -1) {
                          const target = elems[i + (e.shiftKey ? -1 : 1)];
                          if (target !== undefined) {
                              e.preventDefault();
                              target.focus();
                          }
                          else {
                              self.element.focus();
                          }
                      }
                      break;
                  default:
                      break;
              }
          }
          if (self.amPM !== undefined && e.target === self.amPM) {
              switch (e.key) {
                  case self.l10n.amPM[0].charAt(0):
                  case self.l10n.amPM[0].charAt(0).toLowerCase():
                      self.amPM.textContent = self.l10n.amPM[0];
                      setHoursFromInputs();
                      updateValue();
                      break;
                  case self.l10n.amPM[1].charAt(0):
                  case self.l10n.amPM[1].charAt(0).toLowerCase():
                      self.amPM.textContent = self.l10n.amPM[1];
                      setHoursFromInputs();
                      updateValue();
                      break;
              }
          }
          triggerEvent("onKeyDown", e);
      }
      function onMouseOver(elem) {
          if (self.selectedDates.length !== 1 ||
              (elem &&
                  (!elem.classList.contains("flatpickr-day") ||
                      elem.classList.contains("disabled"))))
              return;
          const hoverDate = elem
              ? elem.dateObj.getTime()
              : self.days.firstElementChild.dateObj.getTime(), initialDate = self.parseDate(self.selectedDates[0], undefined, true).getTime(), rangeStartDate = Math.min(hoverDate, self.selectedDates[0].getTime()), rangeEndDate = Math.max(hoverDate, self.selectedDates[0].getTime()), lastDate = self.daysContainer.lastChild
              .lastChild.dateObj.getTime();
          let containsDisabled = false;
          let minRange = 0, maxRange = 0;
          for (let t = rangeStartDate; t < lastDate; t += duration.DAY) {
              if (!isEnabled(new Date(t), true)) {
                  containsDisabled =
                      containsDisabled || (t > rangeStartDate && t < rangeEndDate);
                  if (t < initialDate && (!minRange || t > minRange))
                      minRange = t;
                  else if (t > initialDate && (!maxRange || t < maxRange))
                      maxRange = t;
              }
          }
          for (let m = 0; m < self.config.showMonths; m++) {
              const month = self.daysContainer.children[m];
              const prevMonth = self.daysContainer.children[m - 1];
              for (let i = 0, l = month.children.length; i < l; i++) {
                  const dayElem = month.children[i], date = dayElem.dateObj;
                  const timestamp = date.getTime();
                  const outOfRange = (minRange > 0 && timestamp < minRange) ||
                      (maxRange > 0 && timestamp > maxRange);
                  if (outOfRange) {
                      dayElem.classList.add("notAllowed");
                      ["inRange", "startRange", "endRange"].forEach(c => {
                          dayElem.classList.remove(c);
                      });
                      continue;
                  }
                  else if (containsDisabled && !outOfRange)
                      continue;
                  ["startRange", "inRange", "endRange", "notAllowed"].forEach(c => {
                      dayElem.classList.remove(c);
                  });
                  if (elem !== undefined) {
                      elem.classList.add(hoverDate < self.selectedDates[0].getTime()
                          ? "startRange"
                          : "endRange");
                      if (month.contains(elem) ||
                          !(m > 0 &&
                              prevMonth &&
                              prevMonth.lastChild.dateObj.getTime() >= timestamp)) {
                          if (initialDate < hoverDate && timestamp === initialDate)
                              dayElem.classList.add("startRange");
                          else if (initialDate > hoverDate && timestamp === initialDate)
                              dayElem.classList.add("endRange");
                          if (timestamp >= minRange &&
                              (maxRange === 0 || timestamp <= maxRange) &&
                              isBetween(timestamp, initialDate, hoverDate))
                              dayElem.classList.add("inRange");
                      }
                  }
              }
          }
      }
      function onResize() {
          if (self.isOpen && !self.config.static && !self.config.inline)
              positionCalendar();
      }
      function open(e, positionElement = self._positionElement) {
          if (self.isMobile === true) {
              if (e) {
                  e.preventDefault();
                  e.target && e.target.blur();
              }
              if (self.mobileInput !== undefined) {
                  self.mobileInput.focus();
                  self.mobileInput.click();
              }
              triggerEvent("onOpen");
              return;
          }
          if (self._input.disabled || self.config.inline)
              return;
          const wasOpen = self.isOpen;
          self.isOpen = true;
          if (!wasOpen) {
              self.calendarContainer.classList.add("open");
              self._input.classList.add("active");
              triggerEvent("onOpen");
              positionCalendar(positionElement);
              self.calendarContainer.focus();
              if (self.config.noCalendar === false) {
                  focusOnDay(undefined, 0);
              }
          }
          if (self.config.enableTime === true && self.config.noCalendar === true) {
              if (self.selectedDates.length === 0) {
                  self.setDate(self.config.minDate !== undefined
                      ? new Date(self.config.minDate.getTime())
                      : new Date(), false);
                  setDefaultHours();
                  updateValue();
              }
              if (self.config.allowInput === false &&
                  (e === undefined ||
                      !self.timeContainer.contains(e.relatedTarget))) {
                  setTimeout(() => self.hourElement.select(), 50);
              }
          }
      }
      function minMaxDateSetter(type) {
          return (date) => {
              const dateObj = (self.config[`_${type}Date`] = self.parseDate(date, self.config.dateFormat));
              const inverseDateObj = self.config[`_${type === "min" ? "max" : "min"}Date`];
              if (dateObj !== undefined) {
                  self[type === "min" ? "minDateHasTime" : "maxDateHasTime"] =
                      dateObj.getHours() > 0 ||
                          dateObj.getMinutes() > 0 ||
                          dateObj.getSeconds() > 0;
              }
              if (self.selectedDates) {
                  self.selectedDates = self.selectedDates.filter(d => isEnabled(d));
                  if (!self.selectedDates.length && type === "min")
                      setHoursFromDate(dateObj);
                  updateValue();
              }
              if (self.daysContainer) {
                  redraw();
                  if (dateObj !== undefined)
                      self.currentYearElement[type] = dateObj.getFullYear().toString();
                  else
                      self.currentYearElement.removeAttribute(type);
                  self.currentYearElement.disabled =
                      !!inverseDateObj &&
                          dateObj !== undefined &&
                          inverseDateObj.getFullYear() === dateObj.getFullYear();
              }
          };
      }
      function parseConfig() {
          const boolOpts = [
              "wrap",
              "weekNumbers",
              "allowInput",
              "clickOpens",
              "time_24hr",
              "enableTime",
              "noCalendar",
              "altInput",
              "shorthandCurrentMonth",
              "inline",
              "static",
              "enableSeconds",
              "disableMobile",
          ];
          const userConfig = Object.assign({}, instanceConfig, JSON.parse(JSON.stringify(element.dataset || {})));
          const formats$$1 = {};
          self.config.parseDate = userConfig.parseDate;
          self.config.formatDate = userConfig.formatDate;
          Object.defineProperty(self.config, "enable", {
              get: () => self.config._enable,
              set: dates => {
                  self.config._enable = parseDateRules(dates);
              },
          });
          Object.defineProperty(self.config, "disable", {
              get: () => self.config._disable,
              set: dates => {
                  self.config._disable = parseDateRules(dates);
              },
          });
          const timeMode = userConfig.mode === "time";
          if (!userConfig.dateFormat && (userConfig.enableTime || timeMode)) {
              formats$$1.dateFormat =
                  userConfig.noCalendar || timeMode
                      ? "H:i" + (userConfig.enableSeconds ? ":S" : "")
                      : flatpickr.defaultConfig.dateFormat +
                          " H:i" +
                          (userConfig.enableSeconds ? ":S" : "");
          }
          if (userConfig.altInput &&
              (userConfig.enableTime || timeMode) &&
              !userConfig.altFormat) {
              formats$$1.altFormat =
                  userConfig.noCalendar || timeMode
                      ? "h:i" + (userConfig.enableSeconds ? ":S K" : " K")
                      : flatpickr.defaultConfig.altFormat +
                          ` h:i${userConfig.enableSeconds ? ":S" : ""} K`;
          }
          Object.defineProperty(self.config, "minDate", {
              get: () => self.config._minDate,
              set: minMaxDateSetter("min"),
          });
          Object.defineProperty(self.config, "maxDate", {
              get: () => self.config._maxDate,
              set: minMaxDateSetter("max"),
          });
          const minMaxTimeSetter = (type) => (val) => {
              self.config[type === "min" ? "_minTime" : "_maxTime"] = self.parseDate(val, "H:i");
          };
          Object.defineProperty(self.config, "minTime", {
              get: () => self.config._minTime,
              set: minMaxTimeSetter("min"),
          });
          Object.defineProperty(self.config, "maxTime", {
              get: () => self.config._maxTime,
              set: minMaxTimeSetter("max"),
          });
          if (userConfig.mode === "time") {
              self.config.noCalendar = true;
              self.config.enableTime = true;
          }
          Object.assign(self.config, formats$$1, userConfig);
          for (let i = 0; i < boolOpts.length; i++)
              self.config[boolOpts[i]] =
                  self.config[boolOpts[i]] === true ||
                      self.config[boolOpts[i]] === "true";
          HOOKS.filter(hook => self.config[hook] !== undefined).forEach(hook => {
              self.config[hook] = arrayify(self.config[hook] || []).map(bindToInstance);
          });
          self.isMobile =
              !self.config.disableMobile &&
                  !self.config.inline &&
                  self.config.mode === "single" &&
                  !self.config.disable.length &&
                  !self.config.enable.length &&
                  !self.config.weekNumbers &&
                  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
          for (let i = 0; i < self.config.plugins.length; i++) {
              const pluginConf = self.config.plugins[i](self) || {};
              for (const key in pluginConf) {
                  if (HOOKS.indexOf(key) > -1) {
                      self.config[key] = arrayify(pluginConf[key])
                          .map(bindToInstance)
                          .concat(self.config[key]);
                  }
                  else if (typeof userConfig[key] === "undefined")
                      self.config[key] = pluginConf[key];
              }
          }
          triggerEvent("onParseConfig");
      }
      function setupLocale() {
          if (typeof self.config.locale !== "object" &&
              typeof flatpickr.l10ns[self.config.locale] === "undefined")
              self.config.errorHandler(new Error(`flatpickr: invalid locale ${self.config.locale}`));
          self.l10n = Object.assign({}, flatpickr.l10ns.default, (typeof self.config.locale === "object"
              ? self.config.locale
              : self.config.locale !== "default"
                  ? flatpickr.l10ns[self.config.locale]
                  : undefined));
          tokenRegex.K = `(${self.l10n.amPM[0]}|${self.l10n.amPM[1]}|${self.l10n.amPM[0].toLowerCase()}|${self.l10n.amPM[1].toLowerCase()})`;
          self.formatDate = createDateFormatter(self);
          self.parseDate = createDateParser({ config: self.config, l10n: self.l10n });
      }
      function positionCalendar(customPositionElement) {
          if (self.calendarContainer === undefined)
              return;
          triggerEvent("onPreCalendarPosition");
          const positionElement = customPositionElement || self._positionElement;
          const calendarHeight = Array.prototype.reduce.call(self.calendarContainer.children, (acc, child) => acc + child.offsetHeight, 0), calendarWidth = self.calendarContainer.offsetWidth, configPos = self.config.position.split(" "), configPosVertical = configPos[0], configPosHorizontal = configPos.length > 1 ? configPos[1] : null, inputBounds = positionElement.getBoundingClientRect(), distanceFromBottom = window.innerHeight - inputBounds.bottom, showOnTop = configPosVertical === "above" ||
              (configPosVertical !== "below" &&
                  distanceFromBottom < calendarHeight &&
                  inputBounds.top > calendarHeight);
          let top = window.pageYOffset +
              inputBounds.top +
              (!showOnTop ? positionElement.offsetHeight + 2 : -calendarHeight - 2);
          toggleClass(self.calendarContainer, "arrowTop", !showOnTop);
          toggleClass(self.calendarContainer, "arrowBottom", showOnTop);
          if (self.config.inline)
              return;
          const left = window.pageXOffset +
              inputBounds.left -
              (configPosHorizontal != null && configPosHorizontal === "center"
                  ? (calendarWidth - inputBounds.width) / 2
                  : 0);
          const right = window.document.body.offsetWidth - inputBounds.right;
          const rightMost = left + calendarWidth > window.document.body.offsetWidth;
          const centerMost = right + calendarWidth > window.document.body.offsetWidth;
          toggleClass(self.calendarContainer, "rightMost", rightMost);
          if (self.config.static)
              return;
          self.calendarContainer.style.top = `${top}px`;
          if (!rightMost) {
              self.calendarContainer.style.left = `${left}px`;
              self.calendarContainer.style.right = "auto";
          }
          else if (!centerMost) {
              self.calendarContainer.style.left = "auto";
              self.calendarContainer.style.right = `${right}px`;
          }
          else {
              const doc = document.styleSheets[0];
              const bodyWidth = window.document.body.offsetWidth;
              const centerLeft = Math.max(0, bodyWidth / 2 - calendarWidth / 2);
              const centerBefore = ".flatpickr-calendar.centerMost:before";
              const centerAfter = ".flatpickr-calendar.centerMost:after";
              const centerIndex = doc.cssRules.length;
              const centerStyle = `{left:${inputBounds.left}px;right:auto;}`;
              toggleClass(self.calendarContainer, "rightMost", false);
              toggleClass(self.calendarContainer, "centerMost", true);
              doc.insertRule(`${centerBefore},${centerAfter}${centerStyle}`, centerIndex);
              self.calendarContainer.style.left = `${centerLeft}px`;
              self.calendarContainer.style.right = "auto";
          }
      }
      function redraw() {
          if (self.config.noCalendar || self.isMobile)
              return;
          updateNavigationCurrentMonth();
          buildDays();
      }
      function focusAndClose() {
          self._input.focus();
          if (window.navigator.userAgent.indexOf("MSIE") !== -1 ||
              navigator.msMaxTouchPoints !== undefined) {
              setTimeout(self.close, 0);
          }
          else {
              self.close();
          }
      }
      function selectDate(e) {
          e.preventDefault();
          e.stopPropagation();
          const isSelectable = (day) => day.classList &&
              day.classList.contains("flatpickr-day") &&
              !day.classList.contains("disabled") &&
              !day.classList.contains("notAllowed");
          const t = findParent(e.target, isSelectable);
          if (t === undefined)
              return;
          const target = t;
          const selectedDate = (self.latestSelectedDateObj = new Date(target.dateObj.getTime()));
          const shouldChangeMonth = (selectedDate.getMonth() < self.currentMonth ||
              selectedDate.getMonth() >
                  self.currentMonth + self.config.showMonths - 1) &&
              self.config.mode !== "range";
          self.selectedDateElem = target;
          if (self.config.mode === "single")
              self.selectedDates = [selectedDate];
          else if (self.config.mode === "multiple") {
              const selectedIndex = isDateSelected(selectedDate);
              if (selectedIndex)
                  self.selectedDates.splice(parseInt(selectedIndex), 1);
              else
                  self.selectedDates.push(selectedDate);
          }
          else if (self.config.mode === "range") {
              if (self.selectedDates.length === 2)
                  self.clear(false);
              self.latestSelectedDateObj = selectedDate;
              self.selectedDates.push(selectedDate);
              if (compareDates(selectedDate, self.selectedDates[0], true) !== 0)
                  self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
          }
          setHoursFromInputs();
          if (shouldChangeMonth) {
              const isNewYear = self.currentYear !== selectedDate.getFullYear();
              self.currentYear = selectedDate.getFullYear();
              self.currentMonth = selectedDate.getMonth();
              if (isNewYear)
                  triggerEvent("onYearChange");
              triggerEvent("onMonthChange");
          }
          updateNavigationCurrentMonth();
          buildDays();
          updateValue();
          if (self.config.enableTime)
              setTimeout(() => (self.showTimeInput = true), 50);
          if (!shouldChangeMonth &&
              self.config.mode !== "range" &&
              self.config.showMonths === 1)
              focusOnDayElem(target);
          else if (self.selectedDateElem !== undefined &&
              self.hourElement === undefined) {
              self.selectedDateElem && self.selectedDateElem.focus();
          }
          if (self.hourElement !== undefined)
              self.hourElement !== undefined && self.hourElement.focus();
          if (self.config.closeOnSelect) {
              const single = self.config.mode === "single" && !self.config.enableTime;
              const range = self.config.mode === "range" &&
                  self.selectedDates.length === 2 &&
                  !self.config.enableTime;
              if (single || range) {
                  focusAndClose();
              }
          }
          triggerChange();
      }
      const CALLBACKS = {
          locale: [setupLocale, updateWeekdays],
          showMonths: [buildMonths, setCalendarWidth, buildWeekdays],
      };
      function set(option, value) {
          if (option !== null && typeof option === "object")
              Object.assign(self.config, option);
          else {
              self.config[option] = value;
              if (CALLBACKS[option] !== undefined)
                  CALLBACKS[option].forEach(x => x());
              else if (HOOKS.indexOf(option) > -1)
                  self.config[option] = arrayify(value);
          }
          self.redraw();
          jumpToDate();
          updateValue(false);
      }
      function setSelectedDate(inputDate, format) {
          let dates = [];
          if (inputDate instanceof Array)
              dates = inputDate.map(d => self.parseDate(d, format));
          else if (inputDate instanceof Date || typeof inputDate === "number")
              dates = [self.parseDate(inputDate, format)];
          else if (typeof inputDate === "string") {
              switch (self.config.mode) {
                  case "single":
                  case "time":
                      dates = [self.parseDate(inputDate, format)];
                      break;
                  case "multiple":
                      dates = inputDate
                          .split(self.config.conjunction)
                          .map(date => self.parseDate(date, format));
                      break;
                  case "range":
                      dates = inputDate
                          .split(self.l10n.rangeSeparator)
                          .map(date => self.parseDate(date, format));
                      break;
                  default:
                      break;
              }
          }
          else
              self.config.errorHandler(new Error(`Invalid date supplied: ${JSON.stringify(inputDate)}`));
          self.selectedDates = dates.filter(d => d instanceof Date && isEnabled(d, false));
          if (self.config.mode === "range")
              self.selectedDates.sort((a, b) => a.getTime() - b.getTime());
      }
      function setDate(date, triggerChange = false, format = self.config.dateFormat) {
          if ((date !== 0 && !date) || (date instanceof Array && date.length === 0))
              return self.clear(triggerChange);
          setSelectedDate(date, format);
          self.showTimeInput = self.selectedDates.length > 0;
          self.latestSelectedDateObj = self.selectedDates[0];
          self.redraw();
          jumpToDate();
          setHoursFromDate();
          updateValue(triggerChange);
          if (triggerChange)
              triggerEvent("onChange");
      }
      function parseDateRules(arr) {
          return arr
              .slice()
              .map(rule => {
              if (typeof rule === "string" ||
                  typeof rule === "number" ||
                  rule instanceof Date) {
                  return self.parseDate(rule, undefined, true);
              }
              else if (rule &&
                  typeof rule === "object" &&
                  rule.from &&
                  rule.to)
                  return {
                      from: self.parseDate(rule.from, undefined),
                      to: self.parseDate(rule.to, undefined),
                  };
              return rule;
          })
              .filter(x => x);
      }
      function setupDates() {
          self.selectedDates = [];
          self.now = self.parseDate(self.config.now) || new Date();
          const preloadedDate = self.config.defaultDate ||
              ((self.input.nodeName === "INPUT" ||
                  self.input.nodeName === "TEXTAREA") &&
                  self.input.placeholder &&
                  self.input.value === self.input.placeholder
                  ? null
                  : self.input.value);
          if (preloadedDate)
              setSelectedDate(preloadedDate, self.config.dateFormat);
          const initialDate = self.selectedDates.length > 0
              ? self.selectedDates[0]
              : self.config.minDate &&
                  self.config.minDate.getTime() > self.now.getTime()
                  ? self.config.minDate
                  : self.config.maxDate &&
                      self.config.maxDate.getTime() < self.now.getTime()
                      ? self.config.maxDate
                      : self.now;
          self.currentYear = initialDate.getFullYear();
          self.currentMonth = initialDate.getMonth();
          if (self.selectedDates.length > 0)
              self.latestSelectedDateObj = self.selectedDates[0];
          if (self.config.minTime !== undefined)
              self.config.minTime = self.parseDate(self.config.minTime, "H:i");
          if (self.config.maxTime !== undefined)
              self.config.maxTime = self.parseDate(self.config.maxTime, "H:i");
          self.minDateHasTime =
              !!self.config.minDate &&
                  (self.config.minDate.getHours() > 0 ||
                      self.config.minDate.getMinutes() > 0 ||
                      self.config.minDate.getSeconds() > 0);
          self.maxDateHasTime =
              !!self.config.maxDate &&
                  (self.config.maxDate.getHours() > 0 ||
                      self.config.maxDate.getMinutes() > 0 ||
                      self.config.maxDate.getSeconds() > 0);
          Object.defineProperty(self, "showTimeInput", {
              get: () => self._showTimeInput,
              set(bool) {
                  self._showTimeInput = bool;
                  if (self.calendarContainer)
                      toggleClass(self.calendarContainer, "showTimeInput", bool);
                  self.isOpen && positionCalendar();
              },
          });
      }
      function setupInputs() {
          self.input = self.config.wrap
              ? element.querySelector("[data-input]")
              : element;
          if (!self.input) {
              self.config.errorHandler(new Error("Invalid input element specified"));
              return;
          }
          self.input._type = self.input.type;
          self.input.type = "text";
          self.input.classList.add("flatpickr-input");
          self._input = self.input;
          if (self.config.altInput) {
              self.altInput = createElement(self.input.nodeName, self.input.className + " " + self.config.altInputClass);
              self._input = self.altInput;
              self.altInput.placeholder = self.input.placeholder;
              self.altInput.disabled = self.input.disabled;
              self.altInput.required = self.input.required;
              self.altInput.tabIndex = self.input.tabIndex;
              self.altInput.type = "text";
              self.input.setAttribute("type", "hidden");
              if (!self.config.static && self.input.parentNode)
                  self.input.parentNode.insertBefore(self.altInput, self.input.nextSibling);
          }
          if (!self.config.allowInput)
              self._input.setAttribute("readonly", "readonly");
          self._positionElement = self.config.positionElement || self._input;
      }
      function setupMobile() {
          const inputType = self.config.enableTime
              ? self.config.noCalendar
                  ? "time"
                  : "datetime-local"
              : "date";
          self.mobileInput = createElement("input", self.input.className + " flatpickr-mobile");
          self.mobileInput.step = self.input.getAttribute("step") || "any";
          self.mobileInput.tabIndex = 1;
          self.mobileInput.type = inputType;
          self.mobileInput.disabled = self.input.disabled;
          self.mobileInput.required = self.input.required;
          self.mobileInput.placeholder = self.input.placeholder;
          self.mobileFormatStr =
              inputType === "datetime-local"
                  ? "Y-m-d\\TH:i:S"
                  : inputType === "date"
                      ? "Y-m-d"
                      : "H:i:S";
          if (self.selectedDates.length > 0) {
              self.mobileInput.defaultValue = self.mobileInput.value = self.formatDate(self.selectedDates[0], self.mobileFormatStr);
          }
          if (self.config.minDate)
              self.mobileInput.min = self.formatDate(self.config.minDate, "Y-m-d");
          if (self.config.maxDate)
              self.mobileInput.max = self.formatDate(self.config.maxDate, "Y-m-d");
          self.input.type = "hidden";
          if (self.altInput !== undefined)
              self.altInput.type = "hidden";
          try {
              if (self.input.parentNode)
                  self.input.parentNode.insertBefore(self.mobileInput, self.input.nextSibling);
          }
          catch (_a) { }
          bind(self.mobileInput, "change", (e) => {
              self.setDate(e.target.value, false, self.mobileFormatStr);
              triggerEvent("onChange");
              triggerEvent("onClose");
          });
      }
      function toggle(e) {
          if (self.isOpen === true)
              return self.close();
          self.open(e);
      }
      function triggerEvent(event, data) {
          if (self.config === undefined)
              return;
          const hooks = self.config[event];
          if (hooks !== undefined && hooks.length > 0) {
              for (let i = 0; hooks[i] && i < hooks.length; i++)
                  hooks[i](self.selectedDates, self.input.value, self, data);
          }
          if (event === "onChange") {
              self.input.dispatchEvent(createEvent("change"));
              self.input.dispatchEvent(createEvent("input"));
          }
      }
      function createEvent(name) {
          const e = document.createEvent("Event");
          e.initEvent(name, true, true);
          return e;
      }
      function isDateSelected(date) {
          for (let i = 0; i < self.selectedDates.length; i++) {
              if (compareDates(self.selectedDates[i], date) === 0)
                  return "" + i;
          }
          return false;
      }
      function isDateInRange(date) {
          if (self.config.mode !== "range" || self.selectedDates.length < 2)
              return false;
          return (compareDates(date, self.selectedDates[0]) >= 0 &&
              compareDates(date, self.selectedDates[1]) <= 0);
      }
      function updateNavigationCurrentMonth() {
          if (self.config.noCalendar || self.isMobile || !self.monthNav)
              return;
          self.yearElements.forEach((yearElement, i) => {
              const d = new Date(self.currentYear, self.currentMonth, 1);
              d.setMonth(self.currentMonth + i);
              self.monthElements[i].textContent =
                  monthToStr(d.getMonth(), self.config.shorthandCurrentMonth, self.l10n) +
                      " ";
              yearElement.value = d.getFullYear().toString();
          });
          self._hidePrevMonthArrow =
              self.config.minDate !== undefined &&
                  (self.currentYear === self.config.minDate.getFullYear()
                      ? self.currentMonth <= self.config.minDate.getMonth()
                      : self.currentYear < self.config.minDate.getFullYear());
          self._hideNextMonthArrow =
              self.config.maxDate !== undefined &&
                  (self.currentYear === self.config.maxDate.getFullYear()
                      ? self.currentMonth + 1 > self.config.maxDate.getMonth()
                      : self.currentYear > self.config.maxDate.getFullYear());
      }
      function getDateStr(format) {
          return self.selectedDates
              .map(dObj => self.formatDate(dObj, format))
              .filter((d, i, arr) => self.config.mode !== "range" ||
              self.config.enableTime ||
              arr.indexOf(d) === i)
              .join(self.config.mode !== "range"
              ? self.config.conjunction
              : self.l10n.rangeSeparator);
      }
      function updateValue(triggerChange = true) {
          if (self.selectedDates.length === 0)
              return self.clear(triggerChange);
          if (self.mobileInput !== undefined && self.mobileFormatStr) {
              self.mobileInput.value =
                  self.latestSelectedDateObj !== undefined
                      ? self.formatDate(self.latestSelectedDateObj, self.mobileFormatStr)
                      : "";
          }
          self.input.value = getDateStr(self.config.dateFormat);
          if (self.altInput !== undefined) {
              self.altInput.value = getDateStr(self.config.altFormat);
          }
          if (triggerChange !== false)
              triggerEvent("onValueUpdate");
      }
      function onMonthNavClick(e) {
          e.preventDefault();
          const isPrevMonth = self.prevMonthNav.contains(e.target);
          const isNextMonth = self.nextMonthNav.contains(e.target);
          if (isPrevMonth || isNextMonth) {
              changeMonth(isPrevMonth ? -1 : 1);
          }
          else if (self.yearElements.indexOf(e.target) >= 0) {
              e.target.select();
          }
          else if (e.target.classList.contains("arrowUp")) {
              self.changeYear(self.currentYear + 1);
          }
          else if (e.target.classList.contains("arrowDown")) {
              self.changeYear(self.currentYear - 1);
          }
      }
      function timeWrapper(e) {
          e.preventDefault();
          const isKeyDown = e.type === "keydown", input = e.target;
          if (self.amPM !== undefined && e.target === self.amPM) {
              self.amPM.textContent =
                  self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
          }
          const min = parseFloat(input.getAttribute("data-min")), max = parseFloat(input.getAttribute("data-max")), step = parseFloat(input.getAttribute("data-step")), curValue = parseInt(input.value, 10), delta = e.delta ||
              (isKeyDown ? (e.which === 38 ? 1 : -1) : 0);
          let newValue = curValue + step * delta;
          if (typeof input.value !== "undefined" && input.value.length === 2) {
              const isHourElem = input === self.hourElement, isMinuteElem = input === self.minuteElement;
              if (newValue < min) {
                  newValue =
                      max +
                          newValue +
                          int(!isHourElem) +
                          (int(isHourElem) && int(!self.amPM));
                  if (isMinuteElem)
                      incrementNumInput(undefined, -1, self.hourElement);
              }
              else if (newValue > max) {
                  newValue =
                      input === self.hourElement ? newValue - max - int(!self.amPM) : min;
                  if (isMinuteElem)
                      incrementNumInput(undefined, 1, self.hourElement);
              }
              if (self.amPM &&
                  isHourElem &&
                  (step === 1
                      ? newValue + curValue === 23
                      : Math.abs(newValue - curValue) > step)) {
                  self.amPM.textContent =
                      self.l10n.amPM[int(self.amPM.textContent === self.l10n.amPM[0])];
              }
              input.value = pad(newValue);
          }
      }
      init();
      return self;
  }
  function _flatpickr(nodeList, config) {
      const nodes = Array.prototype.slice.call(nodeList);
      let instances = [];
      for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          try {
              if (node.getAttribute("data-fp-omit") !== null)
                  continue;
              if (node._flatpickr !== undefined) {
                  node._flatpickr.destroy();
                  node._flatpickr = undefined;
              }
              node._flatpickr = FlatpickrInstance(node, config || {});
              instances.push(node._flatpickr);
          }
          catch (e) {
              console.error(e);
          }
      }
      return instances.length === 1 ? instances[0] : instances;
  }
  if (typeof HTMLElement !== "undefined") {
      HTMLCollection.prototype.flatpickr = NodeList.prototype.flatpickr = function (config) {
          return _flatpickr(this, config);
      };
      HTMLElement.prototype.flatpickr = function (config) {
          return _flatpickr([this], config);
      };
  }
  var flatpickr = function (selector, config) {
      if (selector instanceof NodeList)
          return _flatpickr(selector, config);
      else if (typeof selector === "string")
          return _flatpickr(window.document.querySelectorAll(selector), config);
      return _flatpickr([selector], config);
  };
  flatpickr.defaultConfig = defaults;
  flatpickr.l10ns = {
      en: Object.assign({}, english),
      default: Object.assign({}, english),
  };
  flatpickr.localize = (l10n) => {
      flatpickr.l10ns.default = Object.assign({}, flatpickr.l10ns.default, l10n);
  };
  flatpickr.setDefaults = (config) => {
      flatpickr.defaultConfig = Object.assign({}, flatpickr.defaultConfig, config);
  };
  flatpickr.parseDate = createDateParser({});
  flatpickr.formatDate = createDateFormatter({});
  flatpickr.compareDates = compareDates;
  if (typeof jQuery !== "undefined") {
      jQuery.fn.flatpickr = function (config) {
          return _flatpickr(this, config);
      };
  }
  Date.prototype.fp_incr = function (days) {
      return new Date(this.getFullYear(), this.getMonth(), this.getDate() + (typeof days === "string" ? parseInt(days, 10) : days));
  };
  if (typeof window !== "undefined") {
      window.flatpickr = flatpickr;
  }

  return flatpickr;

})));
