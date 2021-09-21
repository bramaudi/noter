import { Component } from 'solid-js'
import { render } from 'solid-js/web'
import { Router, useRoutes, RouteDefinition } from 'solid-app-router'
import App from './App'
import generatedRoutes from 'virtual:generated-pages';
import rsort from '@helper/sort-route-paths'
import { lazy } from 'solid-js';
import './index.css'

interface GeneratedRoute {
  path: string
  component: () => Promise<{ default: Component<{}> }>
}

const sortedRoutes: RouteDefinition[] = generatedRoutes.map((route: GeneratedRoute) => {
  return {...route, component: lazy(route.component)}
})

const Routes = useRoutes(
  rsort(sortedRoutes, (route: GeneratedRoute) => route.path)
)

render(
  () => (
    <Router>
      <App Routes={Routes} />
    </Router>
  ),
  document.getElementById('root')!
)