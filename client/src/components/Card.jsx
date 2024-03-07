import React, { useState } from 'react'

const Card = ({post}) => {
    const [showFullText, setShowFullText] = useState(false);
    
    const toggleShowFullText = () => {
        setShowFullText(!showFullText);
      };

  return (
    <>
      
      <div className='md:w-2/5 w-4/5 flex flex-col gap-2 border border-solid border-white p-2 rounded-lg bg-white '>
          <img className='object-cover' src={post.image.url} />
          <h1 className='font-bold text-black text-xl '>{post.title}</h1>
          <div className='flex justify-between gap-3 shadow-2xl border-t-2 border-gray-500 p-2 rounded-lg'>
          <h1  className='text-gray-600 text-md '>
          {showFullText ? post.text : `${post.text.slice(0, 50)}...`}
          </h1>
          <button
            className='text-blue-500 hover:underline focus:outline-none'
            onClick={toggleShowFullText}
          >
            {showFullText ? <i style={{color: 'black'}} className="fa-solid fa-angle-up"></i> : <i style={{color: 'black'}} className="fa-solid fa-angle-down"></i>}
          </button>
          </div>
        </div>
    </>
  )
}

export default Card
