import fs from 'fs-extra'
import glob from 'fast-glob'
import mustache from 'mustache'
import chokidar from 'chokidar'
import sortBy from 'lodash/sortBy'
import filepath from './utils/filepath'

type Route = {
  file: string
  depth: number
  pattern: string
  component: string
}

function getPaths() {
  return glob.sync('./pages/**/*.{tsx,jsx}')
}

function getMainJS() {
  return `${process.cwd()}/.nexus/main.js`
}

function getTemplate() {
  return fs.readFileSync(`${__dirname}/files/nexus.mustache`, 'utf-8')
}

function outputNexusJS(routes: Route[]) {
  const data = mustache.render(getTemplate(), { routes })
  fs.outputFileSync(getMainJS(), data)
}

function copyNexusPage(path: string) {
  const file = filepath.getFile(path)
  fs.copyFileSync(path, `.nexus/${file}`)
}

class Page {
  private _routes: Route[]

  constructor() {
    for (const path of getPaths()) {
      this.addRoute(path)
    }
  }

  paths() {
    return getPaths()
  }

  routes() {
    return sortBy(this._routes, ['depth', 'file']).filter(
      ({ file }) => !/[404|app]\.js$/.test(file)
    )
  }

  watch() {
    chokidar
      .watch('pages/**/*.{tsx,jsx}')
      .on('add', (path) => {
        copyNexusPage(path)
        this.addRoute(path)
        outputNexusJS(this.routes())
      })
      .on('change', (path) => {
        copyNexusPage(path)
      })
      .on('unlink', (path) => {
        this.removeRoute(path)
        outputNexusJS(this.routes())
      })
  }

  private addRoute(path: string) {
    this._routes.push({
      file: filepath.getFile(path),
      depth: path.split('/').length,
      pattern: filepath.getPattern(path),
      component: filepath.getComponent(path)
    })
  }

  private removeRoute(path: string) {
    const file = filepath.getFile(path)
    this._routes = this._routes.filter((route) => route.file != file)
  }
}

export default new Page()
