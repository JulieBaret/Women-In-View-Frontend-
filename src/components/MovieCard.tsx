import React, { useState } from 'react';
import { truncate } from '../utils';
import RatingBadge from './RatingBadge';
import { Movie } from './SearchResults';
import Button from './Button';


// Flowbite
import { Modal } from 'flowbite-react';
import type { CustomFlowbiteTheme } from 'flowbite-react';
import Heading from './Heading';

const customTheme: CustomFlowbiteTheme['modal'] = {
    "content": {
        "base": "relative h-full w-full p-4 md:h-auto",
        "inner": "relative rounded-lg bg-white shadow flex flex-col max-h-[90vh]"
    },
};

type Props = {
    movie: Movie
}

const MovieCard = ({ movie }: Props) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <div onClick={() => setOpenModal(true)} className="rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] w-64 h-112">
                <div
                    className="relative overflow-hidden bg-cover bg-no-repeat">
                    <RatingBadge rating={movie.rating} />
                    <img
                        className="rounded-t-lg object-cover h-[384px]"
                        src={movie.poster}
                        alt={movie.title} />
                    <div
                        className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,0%,98%,0.15)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100 flex">
                        {movie.overview && <span className='text-light self-end p-4 bg-black bg-opacity-70'>{truncate(movie.overview, 160)}</span>}
                    </div>
                </div>
                <div className="px-4 py-4 flex flex-col gap-2">
                    <span className="font-bold text-l">{truncate(movie.title, 28)}</span>
                    <span className="self-end bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">{movie.date}</span>
                </div>
            </div>

            {/* Modal */}
            <Modal show={openModal} onClose={() => setOpenModal(false)} theme={customTheme}>
                <Modal.Body>
                    <div className="space-y-6 flex flex-col gap-2">
                        <div className='flex justify-between h-12'>
                            <Heading variant="large">{movie.title}</Heading>
                            <Button type="button" variant="secondary" value="X" onClick={() => setOpenModal(false)}/>
                        </div>
                        <img src={movie.backdrop} alt={movie.title} />
                        <p className="text-base leading-relaxed text-gray-500">
                            {movie.overview}
                        </p>
                    <div className="self-end">
                    <Button type="button" variant="primary" value="Start review" onClick={() => setOpenModal(false)} />
                    </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default MovieCard;