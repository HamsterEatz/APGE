import Loading from '../../../public/loading.gif';
import Image from 'next/image';

export default function LoadingModal() {
    return (<div className="absolute w-screen h-screen bg-gray-700 text-center">
        <div className='translate-y-1/4'>
            <center><Image alt="" src={Loading} className='mr-16' /></center>
            <h1 className='font-bold text-4xl text-white'>LOADING...</h1>
        </div>
    </div>);
}