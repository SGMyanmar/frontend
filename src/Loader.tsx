import {ClipLoader} from "react-spinners";


const Loader = ({ loading, message, color } : {loading:boolean, message:string, color:string}) => {

    return loading ? (
        <div className='overlay-content'>
            <div className='wrapper'>
                <ClipLoader
                        color={color}
                        loading={loading}
                    />
                <span className='message'>
                    {message}
                </span>
            </div>
        </div>
    ) : null
};

export default Loader;