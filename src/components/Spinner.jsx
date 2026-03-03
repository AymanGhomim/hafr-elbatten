const Spinner = ({ label = 'جارٍ التحميل...' }) => (
  <div className="load-wrap">
    <div className="spinner" />
    <span className="load-txt">{label}</span>
  </div>
);

export default Spinner;
