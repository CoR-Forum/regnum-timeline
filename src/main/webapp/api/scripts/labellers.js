/*==================================================
 *  Gregorian Date Labeller
 *==================================================
 */

Timeline.GregorianDateLabeller = new Object();

Timeline.GregorianDateLabeller.create = function(locale, timeZone) {
    return new Timeline.GregorianDateLabeller._Impl(locale, timeZone);
};

Timeline.GregorianDateLabeller.monthNames = [];
Timeline.GregorianDateLabeller.labelFunctions = [];

Timeline.GregorianDateLabeller.getMonthName = function(month, locale) {
    return Timeline.GregorianDateLabeller.monthNames[locale][month];
};

Timeline.GregorianDateLabeller._Impl = function(locale, timeZone) {
    this._locale = locale;
    this._timeZone = timeZone;
};

Timeline.GregorianDateLabeller._Impl.prototype.label = function(date, intervalUnit) {
    var f = Timeline.GregorianDateLabeller.labelFunctions[this._locale];
    if (f == null) {
        f = Timeline.GregorianDateLabeller._Impl.prototype.defaultLabel;
    }
    return f.call(this, date, intervalUnit);
};

Timeline.GregorianDateLabeller._Impl.prototype.defaultLabel = function(date, intervalUnit) {
    var text;
    var emphasized = false;
    
    date = Timeline.DateTime.removeTimeZoneOffset(date, this._timeZone);
    
    switch(intervalUnit) {
    case Timeline.DateTime.MILLISECOND:
        text = date.getUTCMilliseconds();
        break;
    case Timeline.DateTime.SECOND:
        text = date.getUTCSeconds();
        break;
    case Timeline.DateTime.MINUTE:
        var m = date.getUTCMinutes();
        if (m == 0) {
            text = date.getUTCHours() + ":00";
            emphasized = true;
        } else {
            text = m;
        }
        break;
    case Timeline.DateTime.HOUR:
        text = date.getUTCHours() + "hr";
        break;
    case Timeline.DateTime.DAY:
        text = Timeline.GregorianDateLabeller.getMonthName(date.getUTCMonth(), this._locale) + " " + date.getUTCDate();
        break;
    case Timeline.DateTime.WEEK:
        text = Timeline.GregorianDateLabeller.getMonthName(date.getUTCMonth(), this._locale) + " " + date.getUTCDate();
        break;
    case Timeline.DateTime.MONTH:
        var m = date.getUTCMonth();
        if (m == 0) {
            text = this.label(date, Timeline.DateTime.YEAR).text;
            emphasized = true;
        } else {
            text = Timeline.GregorianDateLabeller.getMonthName(m, this._locale);
        }
        break;
    case Timeline.DateTime.YEAR:
    case Timeline.DateTime.DECADE:
    case Timeline.DateTime.CENTURY:
    case Timeline.DateTime.MILLENNIUM:
        var y = date.getUTCFullYear();
        if (y > 0) {
            text = date.getUTCFullYear();
        } else {
            text = (1 - y) + "BC";
        }
        break;
    default:
        text = date.toUTCString();
    }
    return { text: text, emphasized: emphasized };
}
