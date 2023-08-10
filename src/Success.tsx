import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Success(){
    return <>
    <div className="my-12 bg-orange-50 rounded-xl px-12 py-24">
        <div className="flex justify-center items-center mb-8">
            <FontAwesomeIcon icon={faCheckCircle} className="text-lime-500 text-8xl"></FontAwesomeIcon>
        </div>
        <p className="text-sm sm:text-base text-center">Form have been successfully submitted! Please check your email for your order info.</p>
    </div>
    </>
}