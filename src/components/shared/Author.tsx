import { User } from "@nextui-org/react";
import { VerifiedIcon } from "lucide-react";

interface IAuthor {
  name: string;
  email: string;
  image: string;
  isVerified: boolean;
}

interface AuthorProps {
  author: IAuthor;
  nameClass: string; // Optional class for the author's name
}

export default function Author({ author, nameClass }: AuthorProps) {
  return (
    <User
      name={
        <span className="flex items-center gap-2">
          <span className={`whitespace-nowrap ${nameClass}`}>
            {author?.name}
          </span>
          {author?.isVerified && <VerifiedIcon className="w-5 h-5 text-blue-500" />}
        </span>
      }
      description={
        <p className="text-blue-500">{author?.email}</p>
      }
      avatarProps={{
        src: `${author?.image}`,
      }}
    />
  );
}
