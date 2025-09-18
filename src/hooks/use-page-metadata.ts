
import { useEffect, useState } from 'react';

interface UsePageMetadataProps {
  defaultTitle: string;
  defaultDescription: string;
}

export const usePageMetadata = ({ defaultTitle, defaultDescription }: UsePageMetadataProps) => {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState(defaultDescription);

  // Keep local state in sync when defaults change (e.g., after language switch)
  useEffect(() => {
    setTitle(defaultTitle);
  }, [defaultTitle]);

  useEffect(() => {
    setDescription(defaultDescription);
  }, [defaultDescription]);

  const handleTitleChange = (value: string | number) => {
    setTitle(String(value));
  };

  const handleDescriptionChange = (value: string | number) => {
    setDescription(String(value));
  };

  return {
    title,
    description,
    handleTitleChange,
    handleDescriptionChange
  };
};

export default usePageMetadata;
