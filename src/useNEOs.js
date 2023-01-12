import { useEffect, useState } from "react";
import _ from 'lodash';
import moment from 'moment';

const DEMO_KEY = 'VHMwQDzqZrIJUmq2WvpXWJId5GK2esO6ivFn7ns8'
const MILS_PER_WEEK = 604797179

const useNEOs = () => {
    const [startDate, setStartDate] = useState(moment())
    const [endDate, setEndDate] = useState(moment())
    const [closestObject, setClosestObject] = useState(null)
    const [fetchError, setFetchError] = useState("")
    const dateOrderError = startDate?.isAfter(endDate)
    const dateLimitError = endDate?.diff(startDate) > MILS_PER_WEEK 
        ? 'Date range must be 7 days or less' : ''
    const defaultObject = {close_approach_data: [{miss_distance: {}}]}

    const getDistance = (neo) => neo.close_approach_data[0].miss_distance.kilometers
    const url = (startDate && endDate)
        ? `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate.format('YYYY-MM-DD')}&end_date=${endDate.format('YYYY-MM-DD')}&api_key=${DEMO_KEY}`
        : null

        console.log(startDate, endDate)
    useEffect(() => {
        if (dateLimitError) {
           setClosestObject(defaultObject) 
        } else if (!dateOrderError && startDate?.isValid() && endDate?.isValid()) {
            if (url) {
                fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    const closestPerDay = _.mapValues(data.near_earth_objects, day => day
                        .sort((a, b) => {
                            return getDistance(a) - getDistance(b)
                        })[0])
                    const closestInDateRange = _.reduce(closestPerDay, (closest, next) => {
                        return getDistance(closest) > getDistance(next) ? closest : next
                    })
                    if (data.error) {
                        setFetchError(data.error)
                    } else {
                        setClosestObject(closestInDateRange)
                        setFetchError()
                    }
                })
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endDate, startDate])


    return { closestObject: closestObject || defaultObject, startDate, setStartDate, endDate, setEndDate, dateOrderError, fetchError, dateLimitError}
};

export default useNEOs;