const StarIcon = ({ size = 28 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ display: 'block', flexShrink: 0 }}
  >
    <path
      d="M12 2L13.6 10.4L22 12L13.6 13.6L12 22L10.4 13.6L2 12L10.4 10.4Z"
      fill="#4a7fd4"
      stroke="#4a7fd4"
      strokeWidth="0.3"
      strokeLinejoin="round"
    />
  </svg>
);

export default StarIcon;
