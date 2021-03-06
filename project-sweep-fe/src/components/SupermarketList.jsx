import React, { Component } from 'react'
import { Link } from '@reach/router'
import Loader from './Loader'
import * as api from '../utils/api'
import distance from '../utils/distance'
import { Button } from '@material-ui/core'
import Switch from '@material-ui/core/Switch'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import SupermarketsMap from './SupermarketsMap'

export default class SupermarketList extends Component {
    state = {
        isLoading: true,
        supermarkets: [],
        showMap: false,
    }

    componentDidMount() {
        api.getSupermarkets().then(({ supermarkets }) => {
            this.setState({ supermarkets, isLoading: false })
        })
    }

    handleClick = (supermarket) => {
        this.props.setSupermarket(supermarket)
    }

    handleViewChange = () => {
        this.setState((currState) => {
            return { showMap: !currState.showMap }
        })
    }

    render() {
        const { userLocation, listItems } = this.props
        const { supermarkets, isLoading, showMap } = this.state
        if (isLoading) return <Loader />
        return (
            <div className="notepad">
                <FormControlLabel
                    control={<Switch />}
                    label="Change View"
                    onClick={this.handleViewChange}
                />
                <h2>Choose your supermarket:</h2>
                {showMap ? (
                    <SupermarketsMap
                        supermarkets={supermarkets}
                        handleClick={this.handleClick}
                        listItems={listItems}
                        userLocation={userLocation}
                    />
                ) : (
                    supermarkets
                        .sort((a, b) => {
                            a = distance(
                                userLocation[0],
                                userLocation[1],
                                a.location[0],
                                a.location[1],
                                'K'
                            )
                            b = distance(
                                userLocation[0],
                                userLocation[1],
                                b.location[0],
                                b.location[1],
                                'K'
                            )
                            return a - b
                        })
                        .map((supermarket) => {
                            const missingCategoryItems = listItems.filter(
                                (item) => {
                                    return (
                                        Object.keys(
                                            supermarket.categoryLookup
                                        ).indexOf(item.category.name) === -1
                                    )
                                }
                            )
                            const nextLink = missingCategoryItems.length
                                ? '/itemcheck'
                                : '/shopmap'
                            return (
                                <div
                                    className="button supermarketButton"
                                    key={supermarket._id}
                                >
                                    <Link
                                        onClick={() =>
                                            this.handleClick(supermarket)
                                        }
                                        key={supermarket._id}
                                        to={nextLink}
                                    >
                                        <Button
                                            className="button"
                                            variant="contained"
                                            color="primary"
                                        >
                                            <div className="supermarketcard">
                                                <div className="superMarketName">
                                                    {supermarket.name}
                                                </div>
                                                <div>
                                                    {`Distance: ${distance(
                                                        userLocation[0],
                                                        userLocation[1],
                                                        supermarket.location[0],
                                                        supermarket.location[1],
                                                        'K'
                                                    ).toFixed(2)}km`}
                                                </div>
                                            </div>
                                        </Button>
                                    </Link>
                                </div>
                            )
                        })
                )}
                <div className="button">
                    <Link to="/createSupermarket">
                        <Button variant="contained" color="secondary">
                            Add New Supermarket
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }
}
