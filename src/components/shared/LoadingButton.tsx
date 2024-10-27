"use client";
import { Button, Spinner } from "@nextui-org/react";
import { ReactNode, useState } from "react";

interface LoadingButtonProps {
  onClick?: () => Promise<void>; // Async function for handling the button action
  buttonId: string; // Unique identifier for each button
  children: ReactNode;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  onClick,
  buttonId,
  children,
}) => {
  const [loadingStates, setLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});

  const handleClick = async () => {
    if (!onClick) return; // Exit if onClick is undefined

    setLoadingStates((prev) => ({ ...prev, [buttonId]: true })); // Set loading for the specific button
    try {
      await onClick();
    } finally {
      setLoadingStates((prev) => ({ ...prev, [buttonId]: false })); // Reset loading for the button
    }
  };


  return (
    <Button
      size="sm"
      onClick={handleClick}
      disabled={loadingStates[buttonId]} 
      className="flex items-center space-x-2 bg-transparent hover:bg-gray-300 "
    >
      {loadingStates[buttonId] ? (
        <Spinner size="sm"></Spinner>
      ) : (
        <> {children} </>
      )}
    </Button>
  );
};

export default LoadingButton;
