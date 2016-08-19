#!/usr/bin/env node
'use strict'

const program = require('commander');
const wiki = require('wikipedia-js');
const fs = require('fs');
const http = require('http');
const PORT = 8080

const processWord = (word) => {
  const option = {
    query: word,
    format: "html"
  };
  wiki.searchArticle(option, (err, response) => {
    if (err) {
      console.log("Our system is currently down");
    }
    fs.writeFile(`output/${word}.html`, response, (err) => {
      if (err) {
        console.log("Our system is currently down");
      }
      console.log(`Results saved at: output/${word}.html`);
      http.createServer(function(request, response) {
        fs.readFile(`output/${word}.html`, (err, data) => {
          response.writeHead(200, {'Content-Type': 'text/html'});
          response.write(data);
          response.end();
        });
      }).listen(PORT);
    });
  });
}

program
  .command('search [words...]')
  .action((words) => {
    if (!words) {
      throw new Error("No query provided")
    }

    words.forEach((word) => {
      processWord(word);
    });
  });

program.parse(process.argv);
console.log("Displaying results on port: ",PORT);