import { useState } from "react";
import { Modal, Input, Button, Icon } from "semantic-ui-react";

const FileModal = ({ uploadFile, modal, closeModal }) => {
  const [file, setFile] = useState(null);

  const addFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const sendFile = () => {
    if (file !== null) {
      uploadFile(file);
      closeModal();
      setFile(null);
    }
  };

  return (
    <Modal basic open={modal} onClose={closeModal}>
      <Modal.Header>Select an Image File</Modal.Header>
      <Modal.Content>
        <Input onChange={addFile} fluid label="File types: jpg, png" name="file" type="file" />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={sendFile} color="green">
          <Icon name="checkmark" /> Send
        </Button>
        <Button color="red" onClick={closeModal}>
          <Icon name="remove" /> Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default FileModal;
