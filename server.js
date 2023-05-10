const path = require("path");
const http = require("http");
const fs = require("fs");

// PART 1
// Import EventEmitter from the events module
const EventEmitter = require("events");

// Using the EventEmitter class, create a new EventEmitter instance called NewsLetter
const NewsLetter = new EventEmitter();

// Instantiate a new server instance with createServer
const server = http.createServer((req, res) => {
  // Create an array to hold request chunks
  let chunks = [];

  // Listen for the data event to be emitted, and push each chunk into the chunks array
  req.on("data", (chunk) => {
    chunks.push(chunk);
  });

  // Listen for the request ReadStream end event
  req.on("end", () => {
    // Create a conditional statement to check the request method and url
    if (req.method === "POST" && req.url === "/newsletter_signup") {
      // Decode the chunks array and use JSON.parse() to access request body values
      let data = Buffer.concat(chunks).toString();
      let { name, email } = JSON.parse(data);

      // Emit a signup event and pass in the value to be used by your event listener callback
      NewsLetter.emit("signup", { name, email });

      // Write and end the response to the client
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Signup successful!");
    } else {
      // Account for any method or url that is not “POST” + /newsletter_signup
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
    }
  });
});

// PART 2
// Outside of the server request handler, add an event listener for a signup event on the NewsLetter EventEmitter
NewsLetter.on("signup", (contact) => {
  // Pass in a callback that takes in a contact as a parameter
  let csv = `${contact.name},${contact.email}\n`;

  // This function should use fs.appendFile() to add the contact to a csv file in your project directory
  fs.appendFile(path.join(__dirname, "contacts.csv"), csv, (err) => {
    if (err) throw err;
    console.log("Contact added to csv file.");
  });
});

// Account for errors
server.on("error", (err) => {
  console.error(err);
});

// Start listening for requests on port 3000
server.listen(3000, () => {
  console.log("Server running on port 3000");
});

// const { createServer } = require("http");
// const { appendFile } = require("fs");
// const path = require("path");
// const { EventEmitter } = require("events");

// const NewsLetter= new EventEmitter();
// const chunks=[];
// const {url,method}=req;
// const server = createServer((req, res) => {
//   req.on("data", (chunk) => {
//     chunks.push(chunk);
//   });
//   req.on("end", () => {
//     if (url === "/newsletter_signup" && method === "POST") {
//       const body = JSON.parse(Buffer.concat(chunks).toString());
//       const newContact= `${body.name},${body.email}\n`
//      NewsLetter.emit("signup",newContact);
//      res.setHeader("Content-Type", "application/json")
//     }else{

//     }
//   });
// });

// server.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });
