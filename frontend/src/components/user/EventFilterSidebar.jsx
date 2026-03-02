import React from 'react';
import { Box, Typography, TextField, Slider, Button, Accordion, AccordionSummary, AccordionDetails, FormGroup, FormControlLabel, Checkbox, Paper } from '@mui/material';
import { ExpandMore, FilterList } from '@mui/icons-material';

const EventFilterSidebar = ({ filters, setFilters, categories = [], onApply, onReset }) => {

    const handleCategoryChange = (category) => {
        const currentCategories = filters.categories || [];
        const newCategories = currentCategories.includes(category)
            ? currentCategories.filter(c => c !== category)
            : [...currentCategories, category];

        setFilters({ ...filters, categories: newCategories });
    };

    const handlePriceChange = (event, newValue) => {
        setFilters({ ...filters, priceRange: newValue });
    };

    const handleDateChange = (e) => {
        setFilters({ ...filters, date: e.target.value });
    };

    return (
        <Paper elevation={0} sx={{ p: 2, bgcolor: 'transparent' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FilterList sx={{ mr: 1 }} />
                <Typography variant="h6">Filters</Typography>
            </Box>

            {/* Category Filter */}
            <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight="bold">Categories</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <FormGroup>
                        {categories.map((category) => (
                            <FormControlLabel
                                key={category}
                                control={
                                    <Checkbox
                                        checked={(filters.categories || []).includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                        size="small"
                                    />
                                }
                                label={category}
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            {/* Price Filter */}
            <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight="bold">Price Range</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Box sx={{ px: 1 }}>
                        <Slider
                            value={filters.priceRange || [0, 500]}
                            onChange={handlePriceChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={1000}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption">₹{filters.priceRange?.[0] || 0}</Typography>
                            <Typography variant="caption">₹{filters.priceRange?.[1] || 1000}</Typography>
                        </Box>
                    </Box>
                </AccordionDetails>
            </Accordion>

            {/* Date Filter */}
            <Accordion defaultExpanded elevation={0} sx={{ bgcolor: 'transparent', '&:before': { display: 'none' } }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography fontWeight="bold">Date</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TextField
                        type="date"
                        fullWidth
                        size="small"
                        value={filters.date || ''}
                        onChange={handleDateChange}
                        InputLabelProps={{ shrink: true }}
                    />
                </AccordionDetails>
            </Accordion>

            {/* Actions */}
            <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                <Button variant="contained" fullWidth onClick={onApply}>
                    Apply
                </Button>
                <Button variant="outlined" fullWidth onClick={onReset}>
                    Reset
                </Button>
            </Box>
        </Paper>
    );
};

export default EventFilterSidebar;
