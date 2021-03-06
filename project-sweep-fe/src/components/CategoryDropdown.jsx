import React, { Component } from 'react'

import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

class CategoryDropdown extends Component {
    state = {
        open: true,
        categories: [],
    }

    handleChange = (event) => {
        const { foodName, handleCategoryChange } = this.props
        handleCategoryChange(foodName, event.target.value)
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    handleOpen = () => {
        this.setState({ open: true })
    }

    render() {
        const { open } = this.state
        const { categories, foodName, handleNewProduct } = this.props

        return (
            <div className="item-card-category dropdown">
                <FormControl>
                    <InputLabel id="dropdown">Category</InputLabel>
                    <Select
                        labelId="catergory dropdown"
                        open={open}
                        onClose={this.handleClose}
                        onOpen={this.handleOpen}
                        value=""
                        onChange={this.handleChange}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {categories.map((category, i) => {
                            return (
                                <MenuItem
                                    value={category.name.toLowerCase()}
                                    key={`${category.id} ${i}`}
                                    onClick={() => {
                                        handleNewProduct(foodName, category)
                                    }}
                                >
                                    {category.name}
                                </MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
            </div>
        )
    }
}

export default CategoryDropdown
