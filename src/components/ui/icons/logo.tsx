export const LogoIcon = ({ classname }: { classname?: string }) => {
  return (
    <svg
      className={classname}
      width="24"
      height="24"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="12" fill="#1677FF" />
      <circle cx="12" cy="12" r="6" fill="white" />
    </svg>
  );
};
