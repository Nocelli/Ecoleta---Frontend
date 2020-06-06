import React from 'react'
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import CreatePoint from './pages/CreatePoint'
import Home from './pages/Home'

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/cadastro' component={CreatePoint} />
            </Switch>
        </Router>
    )
}

export default Routes