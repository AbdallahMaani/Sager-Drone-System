// src/components/Counter.jsx
import './Counter.css';

function Counter({ count }) {
  return (
    <div className="counter">
      <span className='dot'>{count}</span> Drone Flying
    </div> //number of drones that can fly (Green drones)
  );
}

export default Counter;