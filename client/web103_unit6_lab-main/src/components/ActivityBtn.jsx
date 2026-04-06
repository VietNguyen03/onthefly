import {useState} from 'react';
import './ActivityBtn.css'

const ActivityBtn = (props) =>  {

  const [num_votes, setNumVotes] = useState(props.num_votes)

  const updateCount = async () => {
    const options = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      // Increment the current vote count by 1
      body: JSON.stringify({ num_votes: num_votes + 1 })
    }

    // Send the update to the server using the activity ID from props
    await fetch('/api/activities/' + props.id, options)
    
    // Update the UI state so the user sees the vote increase
    setNumVotes((num_votes) => num_votes + 1)
  }

  return (
    <button className='activityBtn' id={props.id} onClick={updateCount}>
      {props.activity} <br/> {'△ ' + num_votes + ' Upvotes' }
    </button>
  )

}

export default ActivityBtn;