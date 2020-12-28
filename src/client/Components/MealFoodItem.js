import React from 'react'
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { GetImage } from '../GetImage'

class MealFoodItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            src: GetImage(),
            errored: false,
        }
    }

    componentDidMount() {
        this.setState({
            src: GetImage(this.props.food.image)
        });
    }

    onError = () => {
        if (!this.state.errored) {
            this.setState({
            src: GetImage(),
            errored: true,
            });
        }
    }

    render () {
        return (
            <TableRow key={this.props.food.id}>
                <TableCell align="left">
                    <img src={this.state.src} onError={this.onError} alt={this.props.food.description} height='50'/>
                </TableCell>
                <TableCell align="left">{this.props.food.description}</TableCell>
                <TableCell align="left">{this.props.food.calories}</TableCell>
                <TableCell align="left">{this.props.food.servingSize}</TableCell>
                <TableCell align="left">Edit Remove</TableCell>
            </TableRow>
        );
    }
}

export default MealFoodItem;