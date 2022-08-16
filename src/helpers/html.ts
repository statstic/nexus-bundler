import mustache from 'mustache'
import { outputFileSync } from 'fs-extra'

const template = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{nexus}}</title>
  </head>
  <body>
    <div id="nexus"></div>
    <script type="module" src="./.nexus/main.js"></script>
  </body>
</html>`

export function outputHtml() {
  const data = mustache.render(template, {})
  outputFileSync(`${process.cwd()}/index.html`, data)
}