import React, { useState } from 'react';
import { urlFor, client } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);

    const navigate = useNavigate();
    const user = fetchUser();

    const savePin = (id) => {
        if(!alreadySaved) {
            client
                .patch(id)
                .setIfMissing({ save:[] })
                .insert('after', 'save[-1]', [{
                    _key: uuidv4(),
                    userId: user.googleId,
                    postedBy: {
                        _type: 'postedBy',
                        _ref: user.googleId
                    }
                }])
                .commit()
                .then(() => {
                    window.location.reload();
                })
        }
    }

    const deletePin = (id) => {
        client
        .delete(id).then(() => {
            window.location.reload();
        })
    }

    {/*
    Filter: 
        User id 1 
        [2, 3, 1] user has liked post
        filtered item.postedby returns array [1]

        .length = 1
        User id is 4
        array is empty and .length = 0

        1, [2, 3, 1] -> [1].length -> 1 -> !1 -> false -> !false -> true
        4, [2, 3, 1] -> [].length -> 0 -> !0 -> true -> !true -> false
    */}

    const alreadySaved = !!(save?.filter((item) => item.postedBy._id === user.googleId))?.length; // turns statement into a boolean value
    
    return (
        <div className="m-2">
            <div
                onMouseEnter={() => setPostHovered(true)}
                onMouseLeave={() => setPostHovered(false)}
                onClick={() => navigate(`/pin-detail/${_id}`)}
                className=" relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out"
            >
                <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />
                    {postHovered && (
                    <div
                        className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
                        style={{ height: '100%' }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                    <a
                                        href={`${image?.asset?.url}?dl=`}
                                        download
                                        onClick={(e) => {
                                            // clicking download will not redirect user to pin details page
                                            // stop propagation keeps the user on the same page while downloading the pinned image
                                            e.stopPropagation();
                                        }}
                                        className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                                    >
                                    <MdDownloadForOffline />
                                </a>
                            </div>
                            {alreadySaved ? ( // Is the pin already saved?
                                //yes
                                <button
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opactiy-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                                >
                                    {save?.length}Saved! 
                                </button>
                            ): (
                                //no
                                <button
                                    type='button'
                                    className='bg-red-500 opacity-70 hover:opactiy-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        savePin(_id);
                                    }}
                                >
                                    Save
                                </button>
                            )}
                        </div>
                        <div className='flex justify-between items-center gap-2 w-full'>
                            {destination && (
                                <a
                                    href={destination}
                                    target='_blank'
                                    rel='nureferrer'
                                    className='bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rouded-full opacity-70 hover:100 hover:shadow-md'
                                >
                                    <BsFillArrowUpRightCircleFill />
                                    {destination.length > 15 ? `${destination.slice(0,15)}...` : destination}
                                </a>
                            )}
                            {postedBy?._id === user.googleId && (
                                <button
                                    type='button'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className='bg-white p-2 opacity-70 hover:opactiy-100 font-bold text-dark text-base rounded-3xl hover:shadow-md outlined-none'
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            <Link 
                to={`user-profile/${user?._id}`} 
                className='flex gap-2 mt-2 items-center'
            >
                <img 
                    className='w-8 h-8 rounded-full object-cover'
                    src={postedBy?.image}
                    alt='user-profile'
                />
                <p className='font-semibold capitalize'> {postedBy?.userName} </p>
            </Link>
        </div>
    )
}

export default Pin
