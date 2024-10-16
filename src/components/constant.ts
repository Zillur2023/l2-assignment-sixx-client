export interface IUser {
    _id?: string;
    name: string;
    email: string;
    password: string;
    bio?: string;
    image?: string;
    followers: string[]; // Array of ObjectIds referencing 'User'
    following: string[]; // Array of ObjectIds referencing 'User'
    isVerified: boolean;
    role: 'admin' | 'user'; // Role can be either 'admin' or 'user'
    status: "in-progress" | "blocked";
    paymentStatus?: 'Pending' | 'Paid' | 'Failed';
    transactionId?: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface IPost {
    _id?: string;
    title: string;
    content: string;
    category: string;
    isPremium?: boolean; // Optional because it has a default value
    image?: string; // Optional
    upvotes?: string[]; // Optional, defaults to 0
    downvotes?: string[]; // Optional, defaults to 0
    voteScore?: number; // Optional, defaults to 0
    comments?: string[];
    author: string[]; // References the User model
    createdAt?: Date; // Automatically handled by Mongoose timestamps
    updatedAt?: Date; // Automatically handled by Mongoose timestamps
  }