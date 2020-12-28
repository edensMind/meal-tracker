import React from 'react'
import { Typography } from '@material-ui/core'
import { GetMealsForTime } from '../DataProvider'
import Meal from './Meal'

class Today extends React.Component {
    constructor(props) {
        super(props)
        this.state = { 
            meals: [],
        }
    }

    componentDidMount() {
        // Retireve Meals for today's date range
        let startDate = "2020-12-25";
        let endDate = "2020-12-28";
        GetMealsForTime(startDate, endDate).then(res => {
            if(res.status === 200) {
                console.log("GET GetMealsForTime 200: ", res);
                this.setState({ 
                    meals: res.data
                });
            }
        });
    }

    render () {

        const refreshCallback = () => {
            this.componentDidMount();
        };


        // map array of meals to Meal component
        var i = 0;
        let tc = 0;
        let mealObjects = this.state.meals.map(function(meal){
            meal.food.forEach(food => {
                tc += food.calories;
            });
            return <Meal
                mealData={meal} 
                key={i++}
                refreshTrigger={refreshCallback}
            />
        });

        return (
            <div>
                <Typography variant="h4">Today's Meals</Typography>
                <Typography variant="h4">Today's Calories: {tc}</Typography>
                {mealObjects}
            </div>
        );
    }
}

export default Today;