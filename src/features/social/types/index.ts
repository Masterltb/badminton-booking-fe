export interface Post {
  id: string;
  userId: string;
  content: string;
  images: string[];
  likeCount: number;
  commentCount: number;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl: string;
  };
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: {
    fullName: string;
    avatarUrl: string;
  };
}

export interface CreatePostDTO {
  content: string;
  images?: File[];
}
