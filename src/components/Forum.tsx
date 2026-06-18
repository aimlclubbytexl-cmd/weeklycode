import React, { useState } from 'react';
import { Send, Clock, Plus } from 'lucide-react';
import { MOCK_FORUM_POSTS, MOCK_CHALLENGES } from '../mockData';
import { ForumPost } from '../types';

export const Forum: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>(MOCK_FORUM_POSTS);
  const [activeChallengeId, setActiveChallengeId] = useState('c1');
  const [newPost, setNewPost] = useState('');
  const [postType, setPostType] = useState<'question' | 'discussion'>('question');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const currentPosts = posts.filter(p => p.challengeId === activeChallengeId);

  const handleAddPost = () => {
    if (!newPost.trim()) return;
    const newForumPost: ForumPost = {
      id: 'f' + Date.now(),
      challengeId: activeChallengeId,
      userId: 'u1',
      username: 'You',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
      content: newPost,
      timestamp: new Date().toISOString(),
      type: postType,
      replies: [],
    };
    setPosts([newForumPost, ...posts]);
    setNewPost('');
  };

  const handleAddReply = (postId: string) => {
    const reply = replyText[postId];
    if (!reply || !reply.trim()) return;

    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [
            ...post.replies,
            {
              id: 'r' + Date.now(),
              userId: 'u1',
              username: 'You',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
              content: reply,
              timestamp: new Date().toISOString(),
            },
          ],
        };
      }
      return post;
    }));
    setReplyText({ ...replyText, [postId]: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Community Forum</h1>
          <p className="text-slate-500 mt-1">Ask questions, share ideas, and discuss challenges</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 text-sm">
          <button onClick={() => setPostType('question')} className={`px-4 py-2 rounded-lg font-medium ${postType === 'question' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>
            Ask Question
          </button>
          <button onClick={() => setPostType('discussion')} className={`px-4 py-2 rounded-lg font-medium ${postType === 'discussion' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}>
            Start Discussion
          </button>
        </div>
      </div>

      {/* Challenge selector */}
      <div className="flex flex-wrap gap-2">
        {MOCK_CHALLENGES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveChallengeId(c.id)}
            className={`px-4 py-2 rounded-2xl text-sm font-semibold transition-all ${activeChallengeId === c.id ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* New Post */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-3 text-indigo-600">
          <Plus size={18} />
          <span className="font-semibold text-sm uppercase tracking-wider">New {postType}</span>
        </div>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder={postType === 'question' ? "What are you stuck on?" : "Share your thoughts or solutions..."}
          className="w-full min-h-[100px] resize-y border border-slate-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-end mt-3">
          <button 
            onClick={handleAddPost}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700"
          >
            <Send size={16} /> Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {currentPosts.length === 0 && (
          <div className="text-center py-14 text-slate-400">No discussions yet. Be the first to ask!</div>
        )}
        {currentPosts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-200 rounded-3xl p-6">
            <div className="flex gap-4">
              <img src={post.avatar} alt="" className="w-10 h-10 rounded-full border" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-900">{post.username}</span>
                    <span className="text-xs ml-2 px-2 py-0.5 rounded bg-slate-100 text-slate-500">{post.type}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock size={13} /> {new Date(post.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <p className="mt-3 text-slate-700 leading-relaxed">{post.content}</p>

                {/* Replies */}
                <div className="mt-5 pl-4 border-l-2 border-slate-100 space-y-3">
                  {post.replies.map((reply, idx) => (
                    <div key={idx} className="flex gap-3">
                      <img src={reply.avatar} alt="" className="w-7 h-7 rounded-full" />
                      <div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-slate-800">{reply.username}</span>
                          <span className="text-xs text-slate-400">{new Date(reply.timestamp).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 text-sm mt-1">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply box */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText[post.id] || ''}
                    onChange={(e) => setReplyText({ ...replyText, [post.id]: e.target.value })}
                    className="flex-1 px-4 py-2 text-sm border border-slate-200 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddReply(post.id); }}
                  />
                  <button onClick={() => handleAddReply(post.id)} className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl">
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
