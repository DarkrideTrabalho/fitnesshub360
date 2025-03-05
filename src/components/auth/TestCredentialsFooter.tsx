
import { CardFooter } from '@/components/ui/card';

export const TestCredentialsFooter = () => {
  return (
    <CardFooter className="flex flex-col space-y-4">
      <div className="text-sm text-gray-500 text-center w-full">
        For testing, use:
        <div className="font-mono bg-gray-100 p-2 rounded mt-1 text-xs">
          admin@fitnesshub.com / password
        </div>
      </div>
    </CardFooter>
  );
};
