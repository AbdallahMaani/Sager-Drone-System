// src/components/Counter.jsx
import './Counter.css';

function Counter({ count }) {
  return (
    <div className="counter">
      <span className='dot'>{count}</span> Drone Flying
    </div>
  );
}

export default Counter;