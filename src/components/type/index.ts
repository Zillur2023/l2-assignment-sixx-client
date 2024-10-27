

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    image: string;
    followers: number; // Array of ObjectIds referencing 'User'
    following: number; // Array of ObjectIds referencing 'User'
    isVerified: boolean;
    role: 'admin' | 'user'; // Role can be either 'admin' or 'user'
    paymentStatus?: 'Pending' | 'Paid' | 'Failed';
    transactionId?: string;
 
  }

  export interface IPost {
    _id?: string;
    author: {name:string,email:string,image: string, isVerified: boolean}; 
    title: string;
    category: string;
    isPremium?: boolean; 
    upvoteCount?: number; 
    downvoteCount?: number; 
    commentCount?: number;
  }

  export interface IInput {
    variant?: "flat" | "bordered" | "faded" | "underlined";
    size?: "sm" | "md" | "lg";
    required?: boolean;
    type?: string;
    label: string;
    name: string;
    disabled?: boolean;
  }

  // export interface IPost {
  //   _id?: string;
  //   title: string;
  //   content: string;
  //   category: string;
  //   isPremium?: boolean; // Optional because it has a default value
  //   image?: string; // Optional
  //   upvotes?: string[]; // Optional, defaults to 0
  //   downvotes?: string[]; // Optional, defaults to 0
  //   voteScore?: number; // Optional, defaults to 0
  //   comments?: string[];
  //   author: string[]; // References the User model
  //   createdAt?: Date; // Automatically handled by Mongoose timestamps
  //   updatedAt?: Date; // Automatically handled by Mongoose timestamps
  // }