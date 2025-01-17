import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for routing

const CustomHeader = () => {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <nav className="bg-transparent py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="text-black font-bold text-lg ml-24 sm:ml-12" to="/">
            <i>AI Waste Classifier</i>
          </Link>

          <div className="hidden lg:flex space-x-12 items-center mr-24">
            <Link
              className="text-black font-bold hover:text-green-500 cursor-pointer"
              onClick={() => setOpenModal(true)}
            >
              Disclaimer
            </Link>
            {/* Use Link to navigate between pages */}
            <Link className="text-black font-bold hover:text-green-500" to="/flow">
              Flow
            </Link>
            <Link className="text-black font-bold hover:text-green-500" to="/process">
              Processing
            </Link>
          </div>
        </div>
      </nav>

      {/* Modal Component */}
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Disclaimer</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              This is an AI-based waste classifier. The results provided by this tool are generated by artificial intelligence, which may not always be 100% accurate. 
              It is strongly recommended to consult with the Irish Environment Department or local authorities for proper waste disposal and recycling practices.
            </p>
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              While we strive for accuracy, please be aware that AI-based systems can make mistakes. Always double-check the results and provide feedback to help improve the system.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="green" onClick={() => setOpenModal(false)}>
            I understand
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomHeader;
