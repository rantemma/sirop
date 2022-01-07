<div align="center">
  <a href="https://www.npmjs.com/package/sirop"><img src="https://img.shields.io/npm/v/sirop?style=flat" alt="Version" /></a>  
  <a href="https://www.npmjs.com/package/sirop"><img src="https://img.shields.io/npm/dm/sirop?style=flat" alt="Downloads" /></a>
  <a href="https://github.com/rantemma/sirop/actions/workflows/npm.yml"><img src="https://img.shields.io/github/workflow/status/rantemma/sirop/Npm%20Publish" alt="Downloads" /></a>
</div>

<br>

Sirop is a very simple to use framework to create any kind of parser in a few minutes.

## Getting Started

Expression are made of words which contains figure.

Let's see how can I write a basic expression for integer.

`<num:$number>`

I wanna add a sign to my integer.

`<sign:+|-> <num:$number>`

But here I'm obligate to add a sign to my number, so let's turn 'sign' key to optional.

`[sign:+|-] <num:$number>`

So there is my expression to parse integer.

Now, I can create a parser:

```ts
import { Parser } from "sirop";

const intParser = new Parser();

intParser.root({
    expression: "[sign:+|-] <num:$number>",
    validate: resolved => {

      console.log(resolved.sign)
      console.log(resolved.num)

      // by returning false the parser will stop his process.
      return true;

    }
})

``` 

## Multiple Figure Word

Figures is a kind of sub word, so I can add optional figure to my 'num' key, to support float.

`[sign:+|-] <num:<$number>[.][$number]>` <br>
*When words have multiple figures, all figures need to have enclosure*

Here 'num' key can have up to three tokens, we'll need a little bit logic (a maximum of 5 lines) to correctly understand the parser result.

***

There's an exemple of [math parsing](https://github.com/rantemma/sirop/blob/main/exemple/parseMath.js) (can be optimized don't use it as wrote)

That print: 
```
time: 0.43ms
10 ** 3 + 150 + 3700 * 4 -> 15950
From Eval -> 15950 
 

time: 0.08ms
10 + 25 * 150 - 1 -> 3759
From Eval -> 3759
```

*time value should change*

***

Written with 💖 by Camille Bakkali 