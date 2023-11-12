# Search Console Indexer
[PORTFOLIO](PORTFOLIO.md)

## Table of Contents
- [Search Console Indexer](#search-console-indexer)
	- [Table of Contents](#table-of-contents)
	- [Dependencies](#dependencies)
	- [Installation](#installation)
	- [Basic usage](#basic-usage)
	- [API](#api)
		- [Class](#class)
		- [Class Methods](#class-methods)
			- [`login()`](#login)
			- [`index.singleUrl()`](#indexsingleurl)
				- [Usage](#usage)
				- [Request](#request)
				- [Response](#response)
			- [`index.bulkUrl()`](#indexbulkurl)
				- [Usage](#usage-1)
				- [Request](#request-1)
				- [Response](#response-1)
			- [`index.sitemap()`](#indexsitemap)
				- [Usage](#usage-2)
				- [Request](#request-2)
				- [Response](#response-2)

## Dependencies
- [googleapis](https://www.npmjs.com/package/googleapis)
- [google-auth-library](https://www.npmjs.com/package/google-auth-library)
- [Zod](https://zod.dev/)

## Installation
```
npm install https://github.com/secondphantom/search-console-indexer
```
## Basic usage
```ts
	const indexer = new SearchConsoleIndexer({
		userId:"userId",
		clientSecretFilePath: "./client_secret.json",
		dataDirPath: "./",
	});

	await indexer.login();

	const response = await indexer.index.singleUrl({
		url: "https://example.com/example-docs"
	});
```

## API
### Class
```ts
type SearchConsoleIndexerConstructorInput = {
  userId: string;
  clientSecretFilePath: string;
  dataDirPath: string;
  options?: {
    //default true
    saveUser?: boolean;
    //default true
    saveData?: boolean;
    //default 3005
    port?: number;
  };
};

const indexer = new SearchConsoleIndexer(input:SearchConsoleIndexerConstructorInput);
```
### Class Methods
#### `login()`
If OAuth token is not existed, Console show Url for OAuth
```ts
await indexer.login();
```
#### `index.singleUrl()`
##### Usage
```ts
await indexer.index.singleUrl(
	{url:"https://example.com/1"}
)
```
##### Request
```ts
export type IndexSingeUrlRequest = {
  url: string;
  ignoreIsIndexingOrNot?: boolean;
};
```
##### Response
```ts
type IndexSingeUrlResponse = {
  url: string;
  requestedDate: string;
  isIndexing: boolean;
  request: {
    success: boolean;
    message: string;
  };
};
```
#### `index.bulkUrl()`
##### Usage
```ts
await indexer.index.bulkUrl([
	{url:"https://example.com/1"},
	{url:"https://example.com/2"}
])
```
##### Request
```ts
type IndexBulkUrlRequest = IndexSingeUrlRequest[];
```
##### Response
```ts
type IndexBulkRulResponse = IndexSingeUrlResponse[];
```
#### `index.sitemap()`
##### Usage
```ts
await indexer.index.sitemap(
	{sitemapUrl:"https://example.com/sitemap.xml"}
)
```
##### Request
```ts
type IndexSitemapRequest = {
  sitemapUrl: string;
  ignoreIsIndexingOrNot?: boolean;
};
```
##### Response
```ts
type IndexSitemapResponse = IndexSingeUrlResponse[];
```

