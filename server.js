const express = require('express')
const port = process.env.PORT || 5000
const nodeHtmlToImage = require('node-html-to-image')
const app = express()
const path = require('path')

//to get two value from one route=/:dimension
//to set optional route we have to use ?,example=/:age?

app.get('/images/:dimension/:background?/:color?', async (req, res) => {
  const { dimension, background = "black", color = "white" } = req.params
  const [width, height = width] = dimension.split("x")
  // res.send('hello world')
  const { text = `${width}x${height}` } = req.query
  console.log(width, height, background, color)

  const image = await nodeHtmlToImage({
    // output: './image.png',
    html: `<html>
          <head>
            <style>
              body {
                width: ${width};
                height: ${height};
                background:${background};
                color:${color};
                display:flex;
                align-items:center;
                justify-content:center;
                font-size:1.5rem;
              }
            </style>
          </head>
          <body>${text}</body>
        </html>`,
    puppeteerArgs: { args: ["--no-sandbox", "--disable-setuid-sandbox"] },
  })
  res.contentType('image/jpeg')

  res.send(image)
})


if (process.env.NODE_ENV === 'production') {
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}


app.listen(port, () => console.log(`server is running on ${port}`))