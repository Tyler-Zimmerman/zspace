import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { client } from '../client';
import { searchQuery, feedQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout'; // Grid Layout
import Spinner from './Spinner'; 

const Feed = () => {
    const [loading, setLoading] = useState(false);
    const { categoryId } = useParams();
    const [pins, setPins] = useState(null);

    useEffect(() => {
        setLoading(true);
        // fetch all pins/posts for specific category
        if(categoryId) {
            const query = searchQuery(categoryId);

            client.fetch(query).then((data) => {
                setPins(data);
                setLoading(false);
            })
        // fetch all pins/posts without search query
        } else {
            client.fetch(feedQuery)
            .then((data) => {
                setPins(data);
                setLoading(false);
            })
        }
    }, [categoryId]);

    if(loading) return <Spinner message='Adding new things to the feed' />
    
    if(!pins?.length) return <h2>No pins available</h2>
    
    return (
        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed
