import Image from 'next/image';
export const LoadingSpinner = ({ className }: { className: string }) => {
  return (
    <div className={className}>
      <Image src="/assets/spinner.svg" alt="Loading spinner" height="100" width="100" />
    </div>
  );
};
