import React, { Component } from 'react'
import * as api from '../utils/api'
import CategoryAisleSelectCard from './CategoryAisleSelectCard'
import Button from '@material-ui/core/Button'
const typeAssigner = require('../utils/typeAssigner')

export class SupermarketCreator extends Component {
    state = {
        currentCategory: '',
        currentAisle: null,
        categories: [],
        isLoading: true,
        name: '',
        location: '',
        layout: [
            [1, 2, 3],
            [4, 5, 6],
        ],

        categoryLookup: {},
        aisleInfo: {
            1: { type: 'tl', x: 0, y: 0, num: 1 },
            2: { type: 'tm', x: 1, y: 0, num: 2 },
            3: { type: 'tr', x: 2, y: 0, num: 3 },
            4: { type: 'cl', x: 3, y: 0, num: 4 },
            5: { type: 'cm', x: 4, y: 0, num: 5 },
            6: { type: 'cr', x: 5, y: 0, num: 6 },
        },
    }
    componentDidMount() {
        api.getCategories().then(({ categories }) => {
            const newCats = categories.sort((a, b) => {
                return a.name > b.name ? 1 : -1
            })

            this.setState({ categories: newCats, isLoading: false })
        })
    }

    render() {
        const {
            layout,
            name,
            location,
            aisleInfo,
            categories,
            currentAisle,
            currentCategory,
            categoryLookup,
        } = this.state
        let categoryLookupArr = Object.entries(categoryLookup)
        return (
            <main className="supermarketCreatorContainer">
                <form
                    className="newSupermarket-form"
                    onSubmit={(event) => {
                        event.preventDefault()
                    }}
                >
                    <label className="shopName-input">
                        Supermarket Name:
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={name}
                            name="name"
                            required
                        ></input>
                    </label>
                    <label className="shopPostcode-input">
                        Supermarket Postcode:
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={location}
                            name="postcode"
                            required
                        ></input>
                    </label>

                    <section className="layout-change-container">
                        <p>
                            Supermarket Aisle Layout {layout.length}x
                            {layout[0].length}
                        </p>
                        <label htmlFor="increment-rows">
                            Change Rows
                            <section id="increment-layout">
                                <button
                                    disabled={layout.length === 2}
                                    onClick={() => {
                                        this.incrementDimensions(-1, 'row')
                                    }}
                                    className="increment-button down"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => {
                                        this.incrementDimensions(1, 'row')
                                    }}
                                    className="increment-button up"
                                >
                                    +
                                </button>
                            </section>
                        </label>

                        <label htmlFor="increment-columns">
                            Change columns
                            <section className="increment-layout">
                                <button
                                    disabled={layout[0].length === 3}
                                    onClick={() => {
                                        this.incrementDimensions(-1, 'column')
                                    }}
                                    className="increment-button down"
                                >
                                    -
                                </button>
                                <button
                                    onClick={() => {
                                        this.incrementDimensions(1, 'column')
                                    }}
                                    className="increment-button up"
                                >
                                    +
                                </button>
                            </section>
                        </label>
                    </section>
                    <section className="category-lookup-input-container">
                        <h4>Assign Categories To Aisles</h4>
                        <CategoryAisleSelectCard
                            className="aisle-category-dropdown"
                            categories={categories}
                            updateCurrent={this.updateCurrent}
                            currentCategory={this.state.currentCategory}
                        />
                        <CategoryAisleSelectCard
                            className="aisle-category-dropdown"
                            aisles={Object.keys(aisleInfo)}
                            updateCurrent={this.updateCurrent}
                            currentCategory={this.state.currentAisle}
                        />
                        <Button
                            className="add-to-lookup-button"
                            variant="contained"
                            color="primary"
                            onClick={() =>
                                this.updateCategoryLookup(
                                    currentAisle,
                                    currentCategory
                                )
                            }
                        >
                            Add
                        </Button>
                    </section>

                    <Button
                        id="newSupermarket-submit-button"
                        variant="contained"
                        color="primary"
                        onClick={this.handleSubmit}
                    >
                        Submit
                    </Button>
                    <Button
                        id="newSupermarket-clear-button"
                        variant="contained"
                        color="secondary"
                        onClick={() =>
                            this.updateCategoryLookup(
                                currentAisle,
                                currentCategory
                            )
                        }
                    >
                        Clear
                    </Button>
                </form>
                <ul className="category/aisle-assignment-list">
                    {categoryLookupArr.map((entry) => {
                        return (
                            <li>
                                <strong>Aisle</strong> {entry[1]},{' '}
                                <strong>Category:</strong> {entry[0]}
                            </li>
                        )
                    })}
                </ul>
            </main>
        )
    }
    handleSubmit = (event) => {
        event.preventDefault()
        const { name, aisleInfo, categoryLookup, layout, location } = this.state
        let newLocation
        api.getLongLat(location)
            .then((res) => {
                console.log(res)
                newLocation = res
                return newLocation
            })
            .then((newLocation) => {
                api.postSupermarkets(
                    name,
                    aisleInfo,
                    categoryLookup,
                    layout,
                    newLocation
                ).then(() => {
                    this.setState({
                        name: '',
                        categoryLookup: {},
                        aisleInfo: {
                            1: { type: 'tl', x: 0, y: 0, num: 1 },
                            2: { type: 'tm', x: 1, y: 0, num: 2 },
                            3: { type: 'tr', x: 2, y: 0, num: 3 },
                            4: { type: 'cl', x: 3, y: 0, num: 4 },
                            5: { type: 'cm', x: 4, y: 0, num: 5 },
                            6: { type: 'cr', x: 5, y: 0, num: 6 },
                        },
                        layout: [
                            [1, 2, 3],
                            [4, 5, 6],
                        ],
                        location: '',
                    })
                })
            })
    }
    handleChange = (event) => {
        event.preventDefault()
        console.log(event.target.value)
        event.target.name === 'name'
            ? this.setState({ name: event.target.value })
            : this.setState({ location: event.target.value })
    }

    updateCategoryLookup = (aisle, category) => {
        this.setState(
            (currentState) => {
                currentState.categoryLookup[category] = aisle
                return {
                    categoryLookup: { ...currentState.categoryLookup },
                }
            },
            () => {
                this.setState({ currentAisle: '', currentCategory: '' })
                console.log(this.state.categoryLookup)
            }
        )
    }
    updateCurrent = (type, value) => {
        type === 'category'
            ? this.setState({ currentCategory: value })
            : this.setState({ currentAisle: value })
    }

    incrementDimensions = (increment, type) => {
        this.setState((currentState) => {
            let newColumns
            let newRows
            if (type === 'row') {
                newColumns = currentState.layout[0].length
                newRows = currentState.layout.length + increment
            } else {
                newColumns = currentState.layout[0].length + increment
                newRows = currentState.layout.length
            }

            let newLayout = []
            let newAisleinfo = {}
            let count = 1
            for (let currentRow = 0; currentRow < newRows; currentRow++) {
                let row = []
                for (
                    let currentColumn = 0;
                    currentColumn < newColumns;
                    currentColumn++
                ) {
                    if (currentColumn === 0) {
                        newAisleinfo[count] = {
                            type: `${typeAssigner(currentRow, newRows)}l`,
                            x: currentColumn,
                            y: currentRow,
                            num: count,
                        }
                    }
                    if (currentColumn === newColumns - 1) {
                        newAisleinfo[count] = {
                            type: `${typeAssigner(currentRow, newRows)}r`,
                            x: currentColumn,
                            y: currentRow,
                            num: count,
                        }
                    }
                    if (
                        currentColumn !== newColumns - 1 &&
                        currentColumn !== 0
                    ) {
                        newAisleinfo[count] = {
                            type: `${typeAssigner(currentRow, newRows)}m`,
                            x: currentColumn,
                            y: currentRow,
                            num: count,
                        }
                    }
                    row.push(count)
                    count++
                }
                newLayout.push(row)
            }
            return { layout: newLayout, aisleInfo: newAisleinfo }
        })
    }
}

export default SupermarketCreator
