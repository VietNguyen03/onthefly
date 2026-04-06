import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import ActivityBtn from '../components/ActivityBtn';
import DestinationCard from '../components/DestinationCard';
import './TripDetails.css'

const TripDetails = ({ data }) => {
    const { id } = useParams();
    const [trip, setTrip] = useState({ id: 0, title: "", description: "", img_url: "", num_days: 0, start_date: "", end_date: "", total_cost: 0.0 });
    const [activities, setActivities] = useState([]);
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        // Find the specific trip from the data passed as props
        const result = data.filter(item => item.id === parseInt(id))[0];
        if (result) {
            setTrip(result);
        }

        const fetchActivities = async () => {
            const response = await fetch('/api/activities/' + id);
            const data = await response.json();
            setActivities(data);
        }

        const fetchDestinations = async () => {
            const response = await fetch('/api/trips-destinations/destinations/' + id);
            const data = await response.json();
            setDestinations(data);
        }

        fetchActivities();
        fetchDestinations();
    }, [data, id]);

    return (
        <div className="TripDetails">
            <main id="trip-main">
                <header id="trip-header">
                    <img src={trip.img_url} alt={trip.title} />
                    <div id="trip-info">
                        <h1>{trip.title}</h1>
                        <p>{trip.description}</p>
                    </div>
                </header>

                <div id="destinations">
                    {destinations && destinations.length > 0 ? 
                        destinations.map((destination, index) => 
                            <DestinationCard 
                                key={index} 
                                id={destination.id} 
                                destination={destination.destination} 
                                img_url={destination.img_url} 
                            />
                        ) : <h3>No Destinations Yet</h3>
                    }
                </div>

                <div id="activities">
                    {activities && activities.length > 0 ? 
                        activities.map((activity, index) => 
                           <ActivityBtn 
                                key={index} 
                                id={activity.id} 
                                activity={activity.activity} 
                                num_votes={activity.num_votes} 
                           />
                        ) : <h3>No Activities Yet</h3>
                    }
                </div>
            </main>
        </div>
    );
}

export default TripDetails;