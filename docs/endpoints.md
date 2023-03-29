# Documentation of REST api endpoints

## POST /users/login
- login for a user

### Request
Body:
```
{
    email: <user_email>,
    password: <user_password>,
}
```
### Response
```
{
    success: boolean
    profileId: String
}
```

## GET /users/verify
- verify that account is valid    

### Request
Headers: Authorization token   
 
### Response
```
{
    success: boolean
}
```

## POST /users/register
- create a new account

### Request
Body:
```
{
    firstName: string,
    lastName: string,
    password: string,
    email: string,
    phoneNumber: string
}
```   
 
### Response
```
{
    success: boolean
}
```

## GET /users/portfolio/{:portfolioId}
- get the portfolio information for dashboard   

### Request
Params: 
- portfolioId: the portfolio id

Body: 
- n/a
 
### Response
```
{
    balance: number,
    stocks: [
        { symbol: 'aapl', percentChange: 1.32, delisted: false }
        ...
    ],
    history: [
        { balance: 23423, time: Date }
        ...
    ]
}
```

## GET /stock/current
- returns the current stock listing 

## GET /stock/current
- gets the historical stock listing 


## GET /stock/{:symbol}
- get detailed info on a stock relative to a portfolio

### Request
Params:
- symbol: the stock symbol for example 'aapl'

Body:
```
{
    portfolioId: string
}
```   
 
### Response
- the amountInvested is useful for determine the profit from this stock
- e.g. amountInvested - price_per_share * numShares = $$$ profit (or loss)
```
{
    numShares: 30,
    amountInvested: 6847.23,
    details: {
        language: 'en-US',
        region: 'US',
        quoteType: 'EQUITY',
        typeDisp: 'Equity',
        quoteSourceName: 'Nasdaq Real Time Price',
        triggerable: true,
        customPriceAlertConfidence: 'HIGH',
        currency: 'USD',
        regularMarketChangePercent: 0.83055896,
        regularMarketPrice: 160.25,
        exchange: 'NMS',
        shortName: 'Apple Inc.',
        longName: 'Apple Inc.',
        messageBoardId: 'finmb_24937',
        exchangeTimezoneName: 'America/New_York',
        exchangeTimezoneShortName: 'EDT',
        gmtOffSetMilliseconds: -14400000,
        market: 'us_market',
        esgPopulated: false,
        marketState: 'CLOSED',
        firstTradeDateMilliseconds: 1980-12-12T14:30:00.000Z,
        priceHint: 2,
        postMarketChangePercent: -0.0124832,
        postMarketTime: 2023-03-24T23:59:58.000Z,
        postMarketPrice: 160.23,
        postMarketChange: -0.0200043,
        regularMarketChange: 1.3200073,
        regularMarketTime: 2023-03-24T20:00:05.000Z,
        regularMarketDayHigh: 160.34,
        regularMarketDayRange: { low: 157.85, high: 160.34 },
        regularMarketDayLow: 157.85,
        regularMarketVolume: 59256343,
        regularMarketPreviousClose: 158.93,
        bid: 160.2,
        ask: 160.03,
        bidSize: 8,
        askSize: 8,
        fullExchangeName: 'NasdaqGS',
        financialCurrency: 'USD',
        regularMarketOpen: 158.86,
        averageDailyVolume3Month: 70658500,
        averageDailyVolume10Day: 76044460,
        fiftyTwoWeekLowChange: 36.08,
        fiftyTwoWeekLowChangePercent: 0.2905694,
        fiftyTwoWeekRange: { low: 124.17, high: 179.61 },
        fiftyTwoWeekHighChange: -19.36,
        fiftyTwoWeekHighChangePercent: -0.1077891,
        fiftyTwoWeekLow: 124.17,
        fiftyTwoWeekHigh: 179.61,
        dividendDate: 2023-02-16T00:00:00.000Z,
        earningsTimestamp: 2023-02-02T22:00:00.000Z,
        earningsTimestampStart: 2023-04-26T10:59:00.000Z,
        earningsTimestampEnd: 2023-05-01T12:00:00.000Z,
        trailingAnnualDividendRate: 0.91,
        trailingPE: 26.752922,
        trailingAnnualDividendYield: 0.0057257917,
        epsTrailingTwelveMonths: 5.99,
        epsForward: 6.61,
        epsCurrentYear: 5.96,
        priceEpsCurrentYear: 26.887583,
        sharesOutstanding: 15821899776,
        bookValue: 3.581,
        fiftyDayAverage: 148.8754,
        fiftyDayAverageChange: 11.374603,
        fiftyDayAverageChangePercent: 0.07640351,
        twoHundredDayAverage: 147.9403,
        twoHundredDayAverageChange: 12.309692,
        twoHundredDayAverageChangePercent: 0.08320716,
        marketCap: 2535459389440,
        forwardPE: 24.24357,
        priceToBook: 44.75007,
        sourceInterval: 15,
        exchangeDataDelayedBy: 0,
        averageAnalystRating: '2.0 - Buy',
        tradeable: false,
        cryptoTradeable: false,
        displayName: 'Apple',
        symbol: 'AAPL'
    }
}
```

## GET /stock/all
- get all available stocks on our system

### Request
Body: 
- n/a
 
### Response
```
{
    stocks: [
        { symbol: 'aapl', percentChange: 1.32, delisted: false }
        ...
    ]
}
```

## POST /stock/buy/{:symbol}
- make a purchase transaction for a stock

### Request
Params: 
- symbol: the symbol of the stock e.g. 'aapl'

Body: 
```
{
    portfolioId: string,
    numShares: number
}
```
 
### Response
201 response on success
404 on error


## POST /stock/sell/{:symbol}
- make a selling transaction for a stock

### Request
Params: 
- symbol: the symbol of the stock e.g. 'aapl'

Body: 
```
{
    portfolioId: string,
    numShares: number
}
```
 
### Response
201 response on success
404 on error


## GET /competition/all
- get a list of all competitions. this is every single competition that was ever created on
 the database so its gonna be a lot

### Request
Body: 
- n/a
 
### Response
```
{
    competitions: [
        { 
            competitionStart: Date,
            competitionEnd: Date,
        }
        ...
    ]
}
```

## GET /personal/all
- get a list of all competitions that a user is or was a part of

### Request
Body: 
```
{
    profileId: string
}
```
 
### Response
```
{
    competitions: [
        { 
            uuid: string,
            competitionStart: Date,
            competitionEnd: Date,
        }
        ...
    ]
}
```

## GET /competition/{:competitionId}
- get detailed info on a competition

### Request
Params:
- competitionId: the competition id

Body: 
- n/a
 
### Response
- the rankings are sorted in ascending order where the last element of the list is first place and
the first element of the list is in last place

```
{
    requirements: {
        maxParticipants: number,
        entryPoints: number
    },
    competitionStart: Date,
    competitionEnd: Date,
    startingBalance: number,
    rankings: [
        {
            portfolioId: string,
            balance: number,
            profits: number,
        }
        ...
    ]
}
```

## POST /competition/join/{:competitionId}
- join a competition

### Request
Params:
- competitionId: the competition id

Body: 
```
{
    profileId: string
}
```
 
### Response
- 201 on success
- 404 on error


## POST /competition/create
- create a competition

### Request
Body: 
```
{
    profileId: string,
    requirements: {
        balance: number,
        start: Date,
        end: Date,
        entry: number,
        maxPlayers: number
    }
}
```
 
### Response
```
{
    competitionId: string
}
```