function QualityStatus() {
  return (
    <div className="quality-card">

      <div className="quality-left">

        <div className="quality-icon">
          ✓
        </div>

        <div>
          <p>Overall Water Quality</p>
          <h2>SAFE TO USE</h2>
          <span>
            Current parameters are within the acceptable range.
          </span>
        </div>

      </div>

      <div className="quality-score">
        <strong>92</strong>
        <span>/100</span>
        <small>Quality Score</small>
      </div>

    </div>
  );
}

export default QualityStatus;