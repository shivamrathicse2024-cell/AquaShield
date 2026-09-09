function SensorCard({ title, value, unit, icon, status }) {
  return (
    <div className="sensor-card">

      <div className="sensor-top">
        <div className="sensor-icon">
          {icon}
        </div>

        <span className="status">
          ● {status}
        </span>
      </div>

      <p className="sensor-title">
        {title}
      </p>

      <div className="sensor-value">
        {value}
        <span>{unit}</span>
      </div>

      <div className="sensor-line"></div>

    </div>
  );
}

export default SensorCard;