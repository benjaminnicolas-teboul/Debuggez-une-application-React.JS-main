import { useCallback, useState } from "react";
import PropTypes from "prop-types";
import Field, { FIELD_TYPES } from "../../components/Field";
import Select from "../../components/Select";
import Button, { BUTTON_TYPES } from "../../components/Button";

const mockContactApi = () => new Promise((resolve) => { setTimeout(resolve, 500); });

const Form = ({ onSuccess, onError }) => {
  const [sending, setSending] = useState(false);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [type, setType] = useState(null); // null pour "Toutes"
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const sendContact = useCallback(async (evt) => {
    evt.preventDefault();
    
    // Validation des champs
    if (!nom || !prenom || !email || !message) {
      onError(new Error("Merci de remplir tous les champs obligatoires"));
      return;
    }

    setSending(true);
    
    try {
      await mockContactApi();
      onSuccess();
      // Réinitialisation après succès
      setNom('');
      setPrenom('');
      setType(null);
      setEmail('');
      setMessage('');
    } catch (err) {
      onError(err);
    } finally {
      setSending(false);
    }
  }, [onSuccess, onError, nom, prenom, email, message,type]);

  return (
    <form onSubmit={sendContact}>
      <div className="row">
        <div className="col">
          <Field
            label="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
          <Field
            label="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
          <Select
            selection={["Personnel", "Entreprise"]}
            label="Type"
            value={type}
            onChange={setType}
            
          />
          <Field
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button 
            type={BUTTON_TYPES.SUBMIT} 
            disabled={sending}
          >
            {sending ? "Envoi En cours..." : "Envoyer"}
          </Button>
        </div>
        <div className="col">
          <Field
            label="Message"
            type={FIELD_TYPES.TEXTAREA}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

Form.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

Form.defaultProps = {
  onError: () => null,
  onSuccess: () => null,
};

export default Form;
