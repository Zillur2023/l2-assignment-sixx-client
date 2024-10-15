import CreatePost from '@/components/post/CreatePost'
import Posts from '@/components/post/Posts'
import React from 'react'
// import CreatePost from '../components/post/CreatePost'
// import Posts from '../components/post/Posts'

const PostsPage = () => {
  return (
<>
  <div className="max-w-4xl mx-auto p-4">
    <CreatePost />
  </div>

  <div className="flex items-center justify-center w-full">
    <div className="max-w-4xl w-full">
      <Posts />
    </div>
  </div>
</>
  )
}

export default PostsPage