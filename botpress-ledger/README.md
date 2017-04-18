## botpress-ledger

botpress-ledger is a bot that help freelancer to get rip of is outgo manager.
> Alpha Alpha testing for the moment

## TO-DO

- [X] Helper Menu
- [X] Starter button
- [X] Simple case
- [ ] Groupe conversation
- [ ] RiveScript
- [ ] Add Delay in the callback
- [ ] Devise ?


## Parse Request

Our systems have everything to build simple and humain request. This guide show you what you can do and what you should not do.

### Date

We are using a library call chrono for handling data format in your request.

**What you can do**

```javascript
Today date // 18 april 2017

"Trip to new York 1,000.10 yesterday"

// => yestarday will be convert to 17/04/2017

"Tim hortons snacks 23.13 10/03/2017"

// => 10/03/2017 will be convert to a data object
```

**What you should not do**

```javascript
"Trip to Monaco 1,000,000.00"

// => It will not found the date
// You must give a date to the request

"A request with 2 different Date 10/03/2017 09/03/2017"

// He will take the first one
```


### amount

A regular expression is use for handling the parsing of the amound

**What you can do**

```javascript
// With dot
0.00 // true
.00 // false
10.00 // true
100.0 // true
1 000.0 // true
10,000.00 // true

// With comma
0,00
10,00 // true
100,0 // true
1 000,00 // true
1 000,000.00 // true
1 000 000 000,00 // true
0,00
```

> Use the dot for separating the number and the decimal.

**What you should not do**

```javascript
// Don't use only comma

1,000,000,00 // Please no
```

This case is pretty difficult to handle. Don't use this donation. Put a dot instant a of comma for separating the decimal.

## Description

For the moment the description is the dumpers parser. He only take the rest of the string and make a Concatenation with all the rest. Will change soon.

**What you can do**

```javascript
"You can past everything in the description. Be conside."
```  

**What you should not do**

```javascript
"Don't tweaker !. Your are a freelancer"
```
