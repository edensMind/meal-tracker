import React from 'react'
import { Typography } from '@material-ui/core';
import { GetUser } from '../DataProvider'

class MealHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            username : "",
        }
    }

    componentDidMount() {
        GetUser.then(res => {
            this.setState({ username: res.data.username });
        })
    }

    render () {
        return (
            <div>
                <Typography variant="h4">Hola {this.state.username}</Typography>
            </div>
        );
    }
}

export default MealHeader;