import React from 'react'
import { Typography } from '@material-ui/core';
import { GetUser } from '../DataProvider'

class MealHeader extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            username : "",
            date: "",
        }
    }

    componentDidMount() {
        var d = new Date();

        GetUser.then(res => {
            this.setState({ username: res.data.username, date: `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`});
        })

        
    }

    render () {
        return (
            <div>
                <Typography variant="h4">Hola {this.state.username}</Typography>
                <Typography variant="body1">{this.state.date}</Typography>
            </div>
        );
    }
}

export default MealHeader;