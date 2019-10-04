<H1> Comparison & Small Notes on mySQL Data Types </H1>

## Bit
BIT(n);
- Default value for n is 1.
- Will be automatically converted to integer when queried, therefore needs "bin(attrib.)" in SELECT statement
- Unused bits will be padded at left.

## Boolean
BOOLEAN = TINYINT(1)

## Char
CHAR(0-255)
- If data length is fixed size, recommended CHAR instead of VARCHAR
- It will auto add spaces to the back if inserted value is not as long as defined CHAR

## Date, Time

Select statements
| Name    | Syntax | Description
| --- | --- | ---
| Now | NOW() | To get the current date and time
| | CURRENT_DATE() | Gets curent system date.
| | CURRENT_TIME() | Gets current system time.
| | UTC_TIME() | Gets current UTC time.
| Difference | DATEDIFF(\<date1\>, \<date2\>) | To calculate the number of days between two dates/times/datetimes
|   | TIMEDIFF(\<endTime\>, \<startTime\>) | To calculate the time difference between 2 times.
| Addition | DATE_ADD(\<date\>, INTERVAL X SECOND/MINUTE/HOUR/DAY/WEEK/MONTH/YEAR) | To add a number of days, weeks, months, years, etc., to a date value
| | ADDTIME(\<time\>, \<time\>) | Add time2 to time1.
| Substraction | DATE_SUB(\<date\>, INTERVAL X SECOND/MINUTE/HOUR/DAY/WEEK/MONTH/YEAR) | To substract a number of days, weeks, months, years, etc., to a date value
| | SUBTIME(\<time1\>, \<time2\>) | Substract time1 by time2.
| DAY, MONTH, QUARTER, YEAR ETC. | X(\<date\>) | To get the day, month, quarter, and year of a date value
| WEEKDAY, WEEK, WEEKOFYEAR | X(\<date\>) | Returns weekday index (Monday = 0), week number and calendar week number.
| Formatting | DATE_FORMAT(\<date\>, *format) | To format a date/time/datetime value.
| | TIME_FORMAT(\<time\>, *format) | To format a time value.


__Date, time function comparisons__
| Description | Symbol | Sample
| --- | --- | ---
| Year | y | 19
| | Y/X/x | 2019
| Month | c/m | 10
| | b | Oct
| | M | October
| Day | d | 04
| | D | 4th
| Hour | I/H/h | 02
| Minute | i | 16
| Second | s / S | 11
| AM/PM | p | AM
| Day of week | w | 5
| | W | Friday
| | a | Fri
| Day of month | e | 4
| Time | r | 02:14:28 AM
| | T | 02:14:58
| Actual Week Number | u/v | 40
| Calendar Week Number| U/V | 39
| ? | f | 000000
| | j | 277
| | k/l | 2



### **DATE**
- Stores YYYY-MM-DD
- Ranges 1000-01-01 to 9999-12-31
- Invalid dates are converted to 0000-00-00 in non-strict mode

### **TIME**
- TIME ( [fraction] );
- Stores HH:MM:SS[.fraction(6)]
- Ranges -838:59:59 to 838:59:59
- When insertion, allow for 'HH:MM:SS', 'HHMMSS', 'MMSS', 'SS', 'D HH:MM:SS', 'HH:MM', 'D HH:MM', 'D HH' or 'SS' format

### **DATETIME**
- Stores YYYY-MM-DD HH:MM:SS[.fraction(6)]
- Ranges 1000-01-01 00:00:00.000000 to 9999-12-31 23:59:59.999999

### **TIMESTAMP**
- attrib TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  - By _default_ will set _insertion time_ into the attribute
  - During _update_ will also update the timestamp according to update time.
- Ranges 1970-01-01 00:00:01 UTC to 2038-01-19 03:14:07 UTC
- Gets actual time, converts and saves as UTC time, then converts to with respect time zone when queried
  - For example, assuming current set time zone is UTC +8 
  - INSERT('2019-10-04 08:00:00');
  - Saved as '2019-10-04 00:00:00' (UTC)
  - When queried respond '2019-10-04 08:00:00' (UTC+8)
- Use "SET time_zone = '+08:00';" to set timezone


## Decimal
DECIMAL(\<precision 1-65\>, \<noOfDecimal 0-30>) =
- DEC(X)
- FIXED(X)
- NUMERIC(X)

E.g. DECIMAL(6,2) = XXXX.XX
- If not specified, precision = 10
- ZEROFILL pads values from front

## Enum
ENUM('\<value1\>', '\<value2\>, '\<value3\>, ...)
- Values are assigned numbers according to sequence.
- Changing enum members requires rebuilding entire table using ALTER TABLE
- Not universally compatible

## Integer
- attrib INT AUTO_INCREMENT 
  - Auto increments the integer by one from previous if is not specified during insertion.
- SERIAL = BIGINT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE

|Type | Storage | MinVal | MaxVal
|---|---|---|---
| TINYINT | 1 | -128 | 127
| | | 0 | 255
| SMALLINT | 2 | -32,768 | 32,767
| | | 0 | 65,535
| MEDIUMINT | 3 | -8,388,608 | 8,338,607
| | | 0 | 16,777,215
| INT | 4 | -2,147,483,648 | 2,147,483,647
| | | 0 | 4,294,967,295
| BIGINT | 8 | -9,223,372,036,854,775,808 | 9,223,372,036,854,775,807
| | | 0 | 18,446,744,073,709,551,615


## Varchar
VARCHAR( 1 - 65535 ) ; 

\* Subject to row size, as one VARCHAR can theoratically occupy the whole row
- Unlike CHAR, it will retain trailing spaces and truncate spaces if string is too large.

## Text
attrib TEXT ;

| Type | Storage | Characters
|---|---|---
TINYTEXT | 255 Bytes | 255
TEXT | 64 KB | 65,535
MEDIUMTEXT | 16 MB | 16,777,215
LONGTEXT | 4 GB | 4,294,967,295